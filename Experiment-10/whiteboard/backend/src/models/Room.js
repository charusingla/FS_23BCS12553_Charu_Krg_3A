const mongoose = require('mongoose');

const strokeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // pen, highlighter, eraser, line, rect, circle, arrow, text
    color: { type: String, default: '#ffffff' },
    width: { type: Number, default: 3 },
    opacity: { type: Number, default: 1 },
    fill: { type: Boolean, default: false },
    points: [{ x: Number, y: Number }], // for pen/highlighter/eraser
    x1: Number, y1: Number, x2: Number, y2: Number, // for line/arrow
    x: Number, y: Number, w: Number, h: Number,     // for rect
    cx: Number, cy: Number, rx: Number, ry: Number, // for circle
    text: String, fontSize: Number,                  // for text
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    strokes: [strokeSchema],
    isPublic: { type: Boolean, default: false },
    thumbnail: { type: String, default: '' },
    activeUsers: { type: Number, default: 0 },
    background: { type: String, default: '#0a0a0f' },
  },
  { timestamps: true }
);

// Auto-generate slug from name
roomSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 7);
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);