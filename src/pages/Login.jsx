import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerUser, loginUser } from '../services/apiService';

/**
 * Login / Register Page — Premium glassmorphic authentication page.
 * Includes Sign In and Register tabs, comprehensive field validation,
 * password visibility toggles, strength indicator, and user persistence in MySQL.
 */
function Login({ onLoginSuccess, onShowToast }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper for input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Field Validations
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isRegister) {
      // Full Name Validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }

      // Email Validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Password Validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }

      // Confirm Password
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms Checkbox
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the Terms of Service';
      }

    } else {
      // Sign In Validations
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 66, label: 'Moderate', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#22c55e' };
  };

  const strength = getPasswordStrength();

  // Submit Handler connected to MySQL backend API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isRegister) {
        const response = await registerUser(
          formData.fullName.trim(),
          formData.email.trim(),
          formData.password
        );
        const userObj = response.user;
        onLoginSuccess(userObj);
        onShowToast(`Account created in MySQL! Welcome to QuoteVerse, ${userObj.name}! 🎉`, 'success');
        navigate('/');
      } else {
        const response = await loginUser(
          formData.email.trim(),
          formData.password
        );
        const userObj = response.user;
        onLoginSuccess(userObj);
        onShowToast(`Welcome back, ${userObj.name}! ✨`, 'success');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Authentication failed. Please check your credentials.';
      setErrors({ form: msg });
      onShowToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegister(!isRegister);
    setErrors({});
  };

  return (
    <div className="page-enter" style={{
      padding: '2rem 0',
      minHeight: 'calc(100vh - var(--navbar-height) - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ maxWidth: '480px' }}>

        {/* Card Container */}
        <div className="glass-card-static glow-pulse" style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient-subtle)',
              color: 'var(--accent-primary)',
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={28} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.35rem'
            }}>
              {isRegister ? 'Create Your Account' : 'Welcome to QuoteVerse'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {isRegister
                ? 'Join our community of thought discoverers'
                : 'Sign in to access your saved quotes & stats'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-glass)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => { if (isRegister) toggleAuthMode(); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: !isRegister ? 'var(--accent-primary)' : 'transparent',
                color: !isRegister ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { if (!isRegister) toggleAuthMode(); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: isRegister ? 'var(--accent-primary)' : 'transparent',
                color: isRegister ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              New Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name Field (Register Only) */}
            {isRegister && (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem'
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: errors.fullName ? '#ef4444' : 'var(--text-muted)'
                  }} />
                  <input
                    type="text"
                    name="fullName"
                    className="input-glass"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{
                      paddingLeft: '2.8rem',
                      borderColor: errors.fullName ? '#ef4444' : undefined
                    }}
                  />
                </div>
                {errors.fullName && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                    {errors.fullName}
                  </span>
                )}
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: errors.email ? '#ef4444' : 'var(--text-muted)'
                }} />
                <input
                  type="email"
                  name="email"
                  className="input-glass"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    paddingLeft: '2.8rem',
                    borderColor: errors.email ? '#ef4444' : undefined
                  }}
                />
              </div>
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                {!isRegister && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); onShowToast('Password reset link sent to email!', 'info'); }} style={{ fontSize: '0.75rem' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: errors.password ? '#ef4444' : 'var(--text-muted)'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-glass"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    paddingLeft: '2.8rem',
                    paddingRight: '2.8rem',
                    borderColor: errors.password ? '#ef4444' : undefined
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {errors.password}
                </span>
              )}

              {/* Password Strength Indicator (Register only) */}
              {isRegister && formData.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <span>Password strength:</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-glass)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${strength.score}%`,
                      background: strength.color,
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Register Only) */}
            {isRegister && (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem'
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: errors.confirmPassword ? '#ef4444' : 'var(--text-muted)'
                  }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="input-glass"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      paddingLeft: '2.8rem',
                      paddingRight: '2.8rem',
                      borderColor: errors.confirmPassword ? '#ef4444' : undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Terms Checkbox (Register Only) */}
            {isRegister && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    style={{
                      accentColor: 'var(--accent-primary)',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></span>
                </label>
                {errors.agreeTerms && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                    {errors.agreeTerms}
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-accent"
              disabled={isSubmitting}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '0.95rem',
                marginTop: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                  <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle link */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={toggleAuthMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-accent)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              {isRegister ? 'Sign In' : 'Register now'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
