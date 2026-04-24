# Quick Start Guide - Sketchflow

## Getting Started in 5 Minutes

### Step 1: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas - update MONGO_URI in backend/.env
```

### Step 2: Start Backend Server
```bash
cd backend
npm install  # Only needed first time
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
📡 Socket.io ready
🌍 Environment: development
```

### Step 3: Start Frontend (in a new terminal)
```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

Expected output:
```
  VITE v8.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

### Step 4: Open in Browser
- Open `http://localhost:5173`
- Create an account or log in
- Create your first board
- Start drawing!

## Testing Multi-User Collaboration

1. Open `http://localhost:5173` in **two different browser windows** (or incognito)
2. Log in with different accounts
3. Both users join the same board
4. Draw something in one window
5. See it appear in real-time in the other window

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo last stroke |
| `D` | Select Pen tool |
| `E` | Select Eraser |
| `C` | Select Circle |
| `R` | Select Rectangle |

## Common Issues & Solutions

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
- Ensure MongoDB is running (`mongod` command)
- Check `MONGO_URI` in `backend/.env`
- Try `mongodb://localhost:27017/whiteboard-db`

### Module Not Found: uuid
```bash
cd frontend
npm install uuid
```

### Changes Not Reflecting
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend dev server
3. Hard refresh (Ctrl+Shift+R)

## File Structure Quick Reference

```
backend/
├── src/index.js          ← Main server
├── config/db.js          ← MongoDB setup
├── middleware/auth.js    ← JWT verification
├── socket/handlers.js    ← Real-time events
├── routes/auth.js        ← Login/Register
├── routes/rooms.js       ← Board operations
└── models/               ← Database schemas

frontend/
├── src/main.jsx          ← App entry
├── pages/
│   ├── Login.jsx         ← Auth pages
│   ├── Board.jsx         ← Canvas page
│   └── Dashboard.jsx     ← Board list
├── components/board/
│   ├── Canvas.jsx        ← Drawing surface
│   ├── Toolbar.jsx       ← Tool options
│   └── Topbar.jsx        ← Header
└── services/api.js       ← API calls
```

## Authentication Flow

1. **Register**: Create account with name, email, password
2. **Login**: Enter email and password
3. **Token**: JWT stored in localStorage
4. **Protected**: All routes check for valid token
5. **Socket.io**: Uses same token for real-time connection

## Real-Time Communication

- **Socket.io**: WebSocket fallback to HTTP polling
- **Room Isolation**: Only users in same room see updates
- **Auto-sync**: Canvas updates broadcast to all members
- **Event Batching**: Strokes saved on `draw-end` event

## Development Tips

### Enable Debug Logs
Edit `backend/src/index.js`:
```javascript
io.use(async (socket, next) => {
  console.log('Socket connection:', socket.handshake);
  // ...
});
```

### Hot Reload
- Frontend: Automatic (Vite)
- Backend: Use `nodemon` (configured in `npm run dev`)

### Database Inspection
```bash
# Connect to MongoDB
mongosh

# View databases
show databases

# Use whiteboard
use whiteboard-db

# View collections
show collections

# View documents
db.users.find()
db.rooms.find()
```

## Production Deployment

### Before Deploying

1. **Environment Variables**
   - Change `JWT_SECRET` to strong random value
   - Update `CLIENT_URL` to production domain
   - Use MongoDB Atlas or similar
   - Set `NODE_ENV=production`

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   # Creates dist/ folder
   ```

3. **Security Checklist**
   - [ ] JWT_SECRET is secure
   - [ ] CORS allows only your domain
   - [ ] Database credentials are secure
   - [ ] SSL/HTTPS enabled
   - [ ] Rate limiting configured

## Getting Help

### Check Logs
```bash
# Backend logs show connection issues
# Frontend console (F12) shows frontend errors

# On macOS/Linux
tail -f backend/server.log
```

### Browser DevTools
- **Network**: Check API calls and WebSocket
- **Application**: Verify JWT in localStorage
- **Console**: Look for JavaScript errors

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ENOENT: no such file` | Run `npm install` |
| `connect ECONNREFUSED` | Restart MongoDB |
| `Unauthorized` | Clear localStorage, re-login |
| `Room not found` | Room was deleted or invalid ID |

## Next Steps

1. Customize colors in `User.js`
2. Add more drawing tools in `Canvas.jsx`
3. Implement chat in socket handlers
4. Add export to PDF/PNG
5. Deploy to Heroku or AWS

Happy drawing! 🎨
