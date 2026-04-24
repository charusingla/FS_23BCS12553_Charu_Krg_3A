import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await roomAPI.getAll();
      setRooms(data);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setCreating(true);
      const { data } = await roomAPI.create(formData);
      setRooms((prev) => [data, ...prev]);
      setFormData({ name: '', description: '', isPublic: false });
      setShowCreate(false);
      navigate(`/board/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/board/${roomId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Sketchflow</span>
        </div>
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <div className={styles.avatar} style={{ backgroundColor: user?.color }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 8l4 4m-4 4l4-4M9 12h7"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <div>
            <h1 className={styles.title}>Boards</h1>
            <p className={styles.subtitle}>Create and manage your collaborative whiteboards</p>
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreate(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Board
          </button>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--rose)" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="var(--rose)" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="var(--rose)"/>
            </svg>
            {error}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreate && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Create new board</h2>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateRoom} className={styles.createForm}>
                <div className={styles.field}>
                  <label>Board name *</label>
                  <input
                    type="text"
                    placeholder="My awesome board..."
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    autoFocus
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Description</label>
                  <textarea
                    placeholder="Add a description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows="3"
                  />
                </div>
                <div className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <label htmlFor="isPublic">Make this board public</label>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Create Board'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Loading boards...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-3)" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="var(--text-3)" strokeWidth="2"/>
              </svg>
            </div>
            <h3>No boards yet</h3>
            <p>Create your first collaborative whiteboard to get started</p>
            <button
              className={styles.emptyCreateBtn}
              onClick={() => setShowCreate(true)}
            >
              Create your first board
            </button>
          </div>
        ) : (
          <div className={styles.roomsGrid}>
            {rooms.map((room) => (
              <div
                key={room._id}
                className={styles.roomCard}
                onClick={() => handleRoomClick(room._id)}
              >
                <div className={styles.roomThumbnail}>
                  {room.thumbnail ? (
                    <img src={room.thumbnail} alt={room.name} />
                  ) : (
                    <div className={styles.placeholderThumbnail}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.roomInfo}>
                  <div className={styles.roomHeader}>
                    <h3 className={styles.roomName}>{room.name}</h3>
                    {room.isPublic && (
                      <span className={styles.publicBadge}>Public</span>
                    )}
                  </div>
                  {room.description && (
                    <p className={styles.roomDescription}>{room.description}</p>
                  )}
                  <div className={styles.roomMeta}>
                    <span className={styles.activeUsers}>
                      {room.activeUsers} active
                    </span>
                    <span className={styles.members}>
                      {room.members?.length || 0} member{(room.members?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
