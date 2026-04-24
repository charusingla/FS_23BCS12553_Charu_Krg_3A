import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { roomAPI } from '../services/api';
import Canvas from '../components/board/Canvas';
import Toolbar from '../components/board/Toolbar';
import Topbar from '../components/board/Topbar';
import styles from './Board.module.css';

const Board = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { socket, emit, on } = useSocket(token);
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [strokes, setStrokes] = useState([]);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedWidth, setSelectedWidth] = useState(3);
  const [background, setBackground] = useState('#0a0a0f');

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const { data } = await roomAPI.getById(roomId);
        setRoom(data);
        setBackground(data.background || '#0a0a0f');
        setStrokes(data.strokes || []);
      } catch (err) {
        setError('Failed to load board');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, navigate]);

  // Join room via socket
  useEffect(() => {
    if (!socket || !room) return;

    emit('join-room', { roomId });

    const unsubRoomState = on('room-state', ({ strokes: initialStrokes, users: initialUsers, background: bg }) => {
      setStrokes(initialStrokes || []);
      setUsers(initialUsers || []);
      setBackground(bg || '#0a0a0f');
    });

    const unsubUserJoined = on('user-joined', (userData) => {
      setUsers((prev) => [...prev, userData]);
    });

    const unsubUserLeft = on('user-left', ({ socketId }) => {
      setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
    });

    const unsubDrawStart = on('draw-start', (data) => {
      // Handle draw start visualization if needed
    });

    const unsubDrawMove = on('draw-move', (data) => {
      // Handle draw move visualization if needed
    });

    const unsubDrawEnd = on('draw-end', ({ stroke }) => {
      if (stroke) setStrokes((prev) => [...prev, stroke]);
    });

    const unsubAddShape = on('add-shape', ({ shape }) => {
      if (shape) setStrokes((prev) => [...prev, shape]);
    });

    const unsubUndo = on('undo', ({ strokeId }) => {
      setStrokes((prev) => prev.filter((s) => s.id !== strokeId));
    });

    const unsubBoardCleared = on('board-cleared', () => {
      setStrokes([]);
    });

    const unsubError = on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      unsubRoomState?.();
      unsubUserJoined?.();
      unsubUserLeft?.();
      unsubDrawStart?.();
      unsubDrawMove?.();
      unsubDrawEnd?.();
      unsubAddShape?.();
      unsubUndo?.();
      unsubBoardCleared?.();
      unsubError?.();
    };
  }, [socket, room, emit, on]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.board}>
      <Topbar room={room} users={users} />
      <div className={styles.workspace}>
        <Toolbar
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          selectedWidth={selectedWidth}
          onWidthChange={setSelectedWidth}
          roomId={roomId}
          emit={emit}
          strokes={strokes}
        />
        <Canvas
          roomId={roomId}
          emit={emit}
          strokes={strokes}
          selectedTool={selectedTool}
          selectedColor={selectedColor}
          selectedWidth={selectedWidth}
          background={background}
          userId={user?._id}
          userName={user?.name}
        />
      </div>
    </div>
  );
};

export default Board;
