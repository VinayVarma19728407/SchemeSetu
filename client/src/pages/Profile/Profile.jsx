import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { OCCUPATIONS, GENDERS, SOCIAL_CATEGORIES } from '../../utils/constants.js';
import { formatDate } from '../../utils/helpers.js';
import Toast from '../../components/common/Toast.jsx';
import './Profile.css';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh','Andaman & Nicobar Islands','Dadra & Nagar Haveli','Lakshadweep'];

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [form, setForm] = useState({ age: '', gender: '', occupation: '', income: '', state: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (user) setForm({ age: user.age || '', gender: user.gender || '', occupation: user.occupation || '', income: user.income || '', state: user.state || '', category: user.category || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      setToast({ visible: true, message: 'Profile updated successfully!', type: 'success' });
    } catch {
      setToast({ visible: true, message: 'Failed to update profile.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="profile-page container">
      <h1 className="page-title">My Profile</h1>
      <div className="profile-grid">
        <div className="profile-info card">
          <h2>Account Information</h2>
          <div className="info-row"><strong>Name:</strong> {user?.name}</div>
          <div className="info-row"><strong>Email:</strong> {user?.email}</div>
          <div className="info-row"><strong>Member Since:</strong> {formatDate(user?.createdAt)}</div>
        </div>
        <form className="profile-form card" onSubmit={handleSubmit}>
          <h2>Demographic Profile</h2>
          <p className="form-desc">Complete your profile to get better scheme recommendations.</p>
          <div className="form-grid">
            <div className="form-field"><label>Age</label><input type="number" min="0" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Enter age" /></div>
            <div className="form-field"><label>Gender</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option value="">Select Gender</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div className="form-field"><label>Occupation</label><select value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })}><option value="">Select Occupation</option>{OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div className="form-field"><label>Annual Income (₹)</label><input type="number" min="0" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} placeholder="Annual income" /></div>
            <div className="form-field"><label>State</label><select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}><option value="">Select State</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="form-field"><label>Social Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="">Select Category</option>{SOCIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
};

export default Profile;
