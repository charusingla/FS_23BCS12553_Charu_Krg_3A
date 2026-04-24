import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';

const Topbar = ({ room, users }) => {
  const navigate = useNavigate();

  if (!room) return null;

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.titleSection}>
          <h1 className={styles.roomName}>{room.name}</h1>
          {room.description && <p className={styles.roomDesc}>{room.description}</p>}
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.statusInfo}>
          <div className={styles.status}>
            <div className={styles.statusDot} />
            <span>{users.length} active</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.usersList}>
          <div className={styles.usersLabel}>Collaborating:</div>
          <div className={styles.userAvatars}>
            {users.slice(0, 3).map((user) => (
              <div
                key={user.socketId}
                className={styles.userAvatar}
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {users.length > 3 && (
              <div className={styles.userAvatar} title={`+${users.length - 3} more`}>
                +{users.length - 3}
              </div>
            )}
          </div>
        </div>

        <button className={styles.helpBtn} title="Help">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v.01M12 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
