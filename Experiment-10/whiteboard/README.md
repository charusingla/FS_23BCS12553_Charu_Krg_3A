# Sketchflow - Multi-User Collaborative Whiteboard

A real-time collaborative whiteboard application built with React, Node.js, Socket.io, and MongoDB.

## Features

- **Real-time Collaboration**: Multiple users can draw simultaneously on the same canvas
- **Multiple Drawing Tools**: Pen, Highlighter, Eraser, Line, Rectangle, Circle, Arrow, and Text
- **Color & Width Customization**: Choose from multiple colors and adjust brush width
- **User Avatars**: See who's collaborating with their assigned colors
- **Room Management**: Create public/private rooms and invite others
- **Auto-save**: Drawings are automatically saved to MongoDB
- **Responsive Design**: Works on different screen sizes

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Bcrypt for password hashing, CORS

### Frontend
- **Library**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Styling**: CSS Modules

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env` file already created):
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/whiteboard-db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

4. Update `MONGO_URI` if using MongoDB Atlas or different host

5. Start the backend:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open on `http://localhost:5173`

## Usage

### 1. Authentication
- Register a new account or log in
- Each user gets an automatic color for identification

### 2. Dashboard
- View all your boards
- Create new boards (public or private)
- Click on a board to open it

### 3. Drawing
- **Select Tools**: Use the left toolbar to choose drawing tools
- **Change Color**: Click the color button and select a color
- **Adjust Width**: Use the width slider (2-20px)
- **Undo**: Click undo button or press Ctrl+Z
- **Clear Board**: Clear all drawings (confirmation required)

### 4. Collaboration
- See active users at the top
- User avatars show who's online
- All drawings are synchronized in real-time
- Changes persist automatically

## Drawing Tools

| Tool | Usage |
|------|-------|
| **Pen** | Free-hand drawing |
| **Highlighter** | Transparent drawing |
| **Eraser** | Remove drawings |
| **Line** | Draw straight lines |
| **Rectangle** | Draw rectangular shapes |
| **Circle** | Draw circular shapes |
| **Arrow** | Draw arrows |
| **Text** | Add text (feature ready) |

## Project Structure

```
whiteboard/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── middleware/auth.js    # JWT authentication
│   │   ├── models/
│   │   │   ├── Room.js           # Room schema
│   │   │   └── User.js           # User schema
│   │   ├── routes/
│   │   │   ├── auth.js           # Auth endpoints
│   │   │   └── rooms.js          # Room endpoints
│   │   ├── socket/handlers.js    # Socket.io event handlers
│   │   └── index.js              # Server entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/board/
    │   │   ├── Canvas.jsx        # Drawing canvas
    │   │   ├── Toolbar.jsx       # Tool selection
    │   │   ├── Topbar.jsx        # Room header
    │   │   └── *.module.css      # Component styles
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── Dashboard.jsx     # Board list
    │   │   ├── Board.jsx         # Main board page
    │   │   └── *.module.css      # Page styles
    │   ├── context/AuthContext.jsx    # Auth state
    │   ├── hooks/useSocket.js         # Socket.io hook
    │   ├── services/api.js            # API client
    │   ├── App.jsx               # Route setup
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Log in user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Rooms
- `GET /api/rooms` - Get user's rooms
- `GET /api/rooms/public` - Get public rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/:id/invite` - Invite user

## Socket.io Events

### Client → Server
- `join-room` - Join a room
- `draw-start` - Start drawing
- `draw-move` - Draw move event
- `draw-end` - Finish drawing
- `add-shape` - Add shape
- `undo` - Undo last stroke
- `clear-board` - Clear all strokes
- `cursor-move` - Update cursor position
- `chat-message` - Send message

### Server → Client
- `room-state` - Initial room state
- `user-joined` - User joined notification
- `user-left` - User left notification
- `draw-start` - Receive draw start
- `draw-move` - Receive draw move
- `draw-end` - Receive draw end
- `add-shape` - Receive shape
- `undo` - Receive undo
- `board-cleared` - Board cleared notification

## Configuration

### Colors
Default user colors (assigned randomly):
- Teal, Cyan, Rose, Pink, Green, Gold, Amber, Coral, etc.

### Canvas
- Background: Customizable (default: dark)
- Size: Responsive to window size
- Quality: 2D context with high fidelity

### Database
- Collections: `users`, `rooms`
- Indexes: Email (unique), Room slug (unique)
- Auto-save: Every 30 seconds or on disconnect

## Troubleshooting

### Connection Issues
- Ensure backend is running on port 5000
- Check `CLIENT_URL` in backend .env
- Verify MongoDB connection string

### Drawing Not Syncing
- Check browser console for errors
- Verify Socket.io connection in Network tab
- Ensure all users are in the same room

### Port Already in Use
```bash
# Change frontend port
npm run dev -- --port 5174

# Kill process on backend port
lsof -ti:5000 | xargs kill -9
```

## Future Enhancements

- [ ] Text tool with font selection
- [ ] Layers panel
- [ ] Image upload/insertion
- [ ] Export to PNG/PDF
- [ ] Redo functionality
- [ ] History timeline
- [ ] Shape templates
- [ ] Freehand selection/transform
- [ ] Collaborative cursor display
- [ ] Chat system
- [ ] Comments/annotations
- [ ] Version history

## Performance Optimization

- **Stroke Batching**: Only send strokes when drawing ends
- **Throttled Saves**: Save to DB every 30 seconds
- **Socket.io Rooms**: Isolate users by room
- **Selective Broadcasting**: Only send to room members
- **Canvas Rendering**: Efficient path drawing

## Security

- JWT authentication for all API routes
- Socket.io authentication middleware
- Password hashing with bcrypt (salt: 12)
- CORS configuration
- Email validation
- Room access control

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for real-time collaboration
