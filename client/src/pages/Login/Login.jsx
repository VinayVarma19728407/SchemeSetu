import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext.jsx';
import './Login.css';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate(user.role === 'Administrator' ? '/admin/dashboard' : '/dashboard'); }, [user]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await login(form.email, form.password);
      navigate(res?.role === 'Administrator' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (field, val) => { setForm({ ...form, [field]: val }); if (errors[field]) setErrors({ ...errors, [field]: '' }); };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your bookmarks and eligibility history</p>
        {apiError && <div className="auth-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email Address" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
            <FaLock className="input-icon" />
            <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
            <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <FaEyeSlash /> : <FaEye />}</button>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
