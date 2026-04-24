const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const User = require('../models/User');

// Active room sessions: roomId -> Map<socketId, userData>
const roomSessions = new Map();

// Throttle save to DB every 30 seconds per room
const saveTimers = new Map();

function scheduleSave(roomId, strokes) {
  if (saveTimers.has(roomId)) clearTimeout(saveTimers.get(roomId));
  const timer = setTimeout(async () => {
    try {
      await Room.findByIdAndUpdate(roomId, { strokes });
      saveTimers.delete(roomId);
    } catch (err) {
      console.error(`Auto-save failed for room ${roomId}:`, err.message);
    }
  }, 30000); // save after 30s of inactivity
  saveTimers.set(roomId, timer);
}

const setupSocket = (io) => {
  // ── Authenticate socket connections ──────────────────────────────────────────
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('name email color _id');
      if (!socket.user) return next(new Error('User not found'));
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.user.name} (${socket.id})`);

    // ── Join Room ────────────────────────────────────────────────────────────
    socket.on('join-room', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return socket.emit('error', { message: 'Room not found' });

        socket.join(roomId);
        socket.currentRoom = roomId;

        // Track session
        if (!roomSessions.has(roomId)) roomSessions.set(roomId, new Map());
        const session = roomSessions.get(roomId);
        session.set(socket.id, {
          socketId: socket.id,
          userId: socket.user._id.toString(),
          name: socket.user.name,
          color: socket.user.color,
          cursor: { x: 0, y: 0 },
        });

        // Update active user count
        await Room.findByIdAndUpdate(roomId, { activeUsers: session.size });

        // Send room state to joining user
        socket.emit('room-state', {
          strokes: room.strokes,
          users: [...session.values()],
          background: room.background,
        });

        // Notify others
        socket.to(roomId).emit('user-joined', {
          socketId: socket.id,
          userId: socket.user._id,
          name: socket.user.name,
          color: socket.user.color,
        });

        console.log(`📋 ${socket.user.name} joined room ${roomId} (${session.size} users)`);
      } catch (err) {
        socket.emit('error', { message: 'Failed to join room' });
        console.error('join-room error:', err);
      }
    });

    // ── Drawing Events ──────────────────────────────────────────────────────
    socket.on('draw-start', (data) => {
      socket.to(socket.currentRoom).emit('draw-start', {
        ...data,
        socketId: socket.id,
        color: socket.user.color,
      });
    });

    socket.on('draw-move', (data) => {
      socket.to(socket.currentRoom).emit('draw-move', {
        ...data,
        socketId: socket.id,
      });
    });

    socket.on('draw-end', async (data) => {
      const { stroke, roomId } = data;
      socket.to(roomId || socket.currentRoom).emit('draw-end', {
        stroke,
        socketId: socket.id,
      });

      // Persist stroke to DB
      try {
        const strokeWithAuthor = {
          ...stroke,
          author: socket.user._id,
          authorName: socket.user.name,
        };
        await Room.findByIdAndUpdate(roomId || socket.currentRoom, {
          $push: { strokes: strokeWithAuthor },
        });
        scheduleSave(roomId || socket.currentRoom, null); // mark dirty
      } catch (err) {
        console.error('draw-end save error:', err.message);
      }
    });

    // ── Shape (complete, not streamed) ──────────────────────────────────────
    socket.on('add-shape', async (data) => {
      const { shape, roomId } = data;
      const shapeWithAuthor = {
        ...shape,
        author: socket.user._id,
        authorName: socket.user.name,
      };

      socket.to(roomId || socket.currentRoom).emit('add-shape', {
        shape: shapeWithAuthor,
        socketId: socket.id,
      });

      try {
        await Room.findByIdAndUpdate(roomId || socket.currentRoom, {
          $push: { strokes: shapeWithAuthor },
        });
      } catch (err) {
        console.error('add-shape save error:', err.message);
      }
    });

    // ── Undo ────────────────────────────────────────────────────────────────
    socket.on('undo', async ({ roomId, strokeId }) => {
      const rid = roomId || socket.currentRoom;
      io.to(rid).emit('undo', { strokeId, socketId: socket.id });
      try {
        await Room.findByIdAndUpdate(rid, { $pull: { strokes: { id: strokeId } } });
      } catch (err) {
        console.error('undo save error:', err.message);
      }
    });

    // ── Clear Board ─────────────────────────────────────────────────────────
    socket.on('clear-board', async ({ roomId }) => {
      const rid = roomId || socket.currentRoom;
      io.to(rid).emit('board-cleared', {
        socketId: socket.id,
        userName: socket.user.name,
      });
      try {
        await Room.findByIdAndUpdate(rid, { strokes: [] });
      } catch (err) {
        console.error('clear-board save error:', err.message);
      }
    });

    // ── Cursor Movement ─────────────────────────────────────────────────────
    socket.on('cursor-move', ({ x, y }) => {
      if (!socket.currentRoom) return;
      const session = roomSessions.get(socket.currentRoom);
      if (session?.has(socket.id)) {
        session.get(socket.id).cursor = { x, y };
      }
      socket.to(socket.currentRoom).emit('cursor-move', {
        socketId: socket.id,
        name: socket.user.name,
        color: socket.user.color,
        x, y,
      });
    });

    // ── Chat Message ────────────────────────────────────────────────────────
    socket.on('chat-message', ({ roomId, message }) => {
      const rid = roomId || socket.currentRoom;
      io.to(rid).emit('chat-message', {
        socketId: socket.id,
        userId: socket.user._id,
        userName: socket.user.name,
        color: socket.user.color,
        message: message.slice(0, 500),
        timestamp: Date.now(),
      });
    });

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`❌ Socket disconnected: ${socket.user.name}`);
      if (!socket.currentRoom) return;

      const session = roomSessions.get(socket.currentRoom);
      if (session) {
        session.delete(socket.id);
        if (session.size === 0) roomSessions.delete(socket.currentRoom);
      }

      socket.to(socket.currentRoom).emit('user-left', { socketId: socket.id });

      try {
        await Room.findByIdAndUpdate(socket.currentRoom, {
          activeUsers: session?.size || 0,
        });
      } catch {}
    });
  });
};

module.exports = setupSocket;