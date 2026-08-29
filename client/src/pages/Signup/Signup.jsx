import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext.jsx';
import '../Login/Login.css';
import './Signup.css';

const Signup = () => {
  const { user, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#D32F2F', '#F57C00', '#FBC02D', '#2E7D32'];
  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (field, val) => { setForm({ ...form, [field]: val }); if (errors[field]) setErrors({ ...errors, [field]: '' }); };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Join SchemeSetu to discover government schemes for you</p>
        {apiError && <div className="auth-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
            <FaUser className="input-icon" />
            <input type="text" placeholder="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email Address" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
            <FaLock className="input-icon" />
            <input type={showPwd ? 'text' : 'password'} placeholder="Password (min 8 characters)" value={form.password} onChange={e => handleChange('password', e.target.value)} />
            <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <FaEyeSlash /> : <FaEye />}</button>
            {errors.password && <span className="field-error">{errors.password}</span>}
            {form.password && (
              <div className="pwd-strength">
                <div className="strength-bar"><div className="strength-fill" style={{ width: `${strength * 25}%`, background: strengthColors[strength] }} /></div>
                <span style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
              </div>
            )}
          </div>
          <div className={`input-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <FaLock className="input-icon" />
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;
