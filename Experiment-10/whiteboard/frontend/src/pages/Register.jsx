import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.logoText}>Sketchflow</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Start collaborating in seconds — it's free</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--rose)" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="var(--rose)"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {[
            { name: 'name', type: 'text', label: 'Full name', placeholder: 'Your name' },
            { name: 'email', type: 'email', label: 'Email address', placeholder: 'you@example.com' },
            { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
            { name: 'confirm', type: 'password', label: 'Confirm password', placeholder: '••••••••' },
          ].map(({ name, type, label, placeholder }) => (
            <div className={styles.field} key={name}>
              <label className={styles.label}>{label}</label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  style={{ paddingLeft: 14 }}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ))}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <><div className={styles.spinner} /> Creating account…</> : 'Create account →'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;