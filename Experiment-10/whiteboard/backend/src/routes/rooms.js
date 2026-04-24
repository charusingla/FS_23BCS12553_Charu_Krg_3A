const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/rooms
// @desc    Get all rooms for current user
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    })
      .populate('owner', 'name email color')
      .populate('members.user', 'name email color')
      .select('-strokes')
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (err) {
    console.error('Get rooms error:', err);
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
});

// @route   GET /api/rooms/public
// @desc    Get public rooms
router.get('/public', optionalAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPublic: true })
      .populate('owner', 'name color')
      .select('-strokes')
      .sort({ activeUsers: -1, updatedAt: -1 })
      .limit(20);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public rooms.' });
  }
});

// @route   POST /api/rooms
// @desc    Create a new room
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) return res.status(400).json({ message: 'Room name is required.' });

    const room = await Room.create({
      name,
      description,
      isPublic: isPublic || false,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    });

    // Add room to user's rooms list
    await User.findByIdAndUpdate(req.user._id, { $push: { rooms: room._id } });

    await room.populate('owner', 'name email color');

    res.status(201).json(room);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message });
    }
    console.error('Create room error:', err);
    res.status(500).json({ message: 'Failed to create room.' });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get a single room (with strokes)
router.get('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name email color')
      .populate('members.user', 'name email color');

    if (!room) return res.status(404).json({ message: 'Room not found.' });

    // Check access
    const isOwner = room.owner._id.toString() === req.user._id.toString();
    const isMember = room.members.some((m) => m.user._id.toString() === req.user._id.toString());
    if (!isOwner && !isMember && !room.isPublic) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Add to members if public and not already member
    if (room.isPublic && !isMember && !isOwner) {
      room.members.push({ user: req.user._id, role: 'editor' });
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ message: 'Failed to fetch room.' });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room settings
router.put('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can update this room.' });
    }

    const { name, description, isPublic, background } = req.body;
    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (isPublic !== undefined) room.isPublic = isPublic;
    if (background) room.background = background;

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update room.' });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete a room
router.delete('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this room.' });
    }

    await Room.deleteOne({ _id: room._id });
    await User.updateMany({ rooms: room._id }, { $pull: { rooms: room._id } });

    res.json({ message: 'Room deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete room.' });
  }
});

// @route   POST /api/rooms/:id/invite
// @desc    Invite a user by email
router.post('/:id/invite', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can invite users.' });
    }

    const { email } = req.body;
    const invitee = await User.findOne({ email: email.toLowerCase() });
    if (!invitee) return res.status(404).json({ message: 'User not found with that email.' });

    const alreadyMember = room.members.some((m) => m.user.toString() === invitee._id.toString());
    if (alreadyMember) return res.status(409).json({ message: 'User is already a member.' });

    room.members.push({ user: invitee._id, role: 'editor' });
    await room.save();
    await User.findByIdAndUpdate(invitee._id, { $push: { rooms: room._id } });

    res.json({ message: `${invitee.name} invited successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to invite user.' });
  }
});

// @route   POST /api/rooms/:id/save-strokes
// @desc    Save strokes snapshot (called periodically or on disconnect)
router.post('/:id/save-strokes', protect, async (req, res) => {
  try {
    const { strokes } = req.body;
    await Room.findByIdAndUpdate(req.params.id, { strokes });
    res.json({ message: 'Strokes saved.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save strokes.' });
  }
});

module.exports = router;