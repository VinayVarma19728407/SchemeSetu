import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../../components/common/SkeletonLoader.jsx';
import './VerifyEligibility.css';

const VerifyEligibility = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/schemes/${slug}`),
      axios.get(`/api/eligibility/questionnaire/${slug}`)
    ]).then(([sRes, qRes]) => {
      setScheme(sRes.data.data);
      setQuestions(qRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const validate = () => {
    const e = {};
    questions.forEach(q => {
      if (q.required && !answers[q.id] && answers[q.id] !== 0) e[q.id] = 'This field is required';
      if (q.validation && answers[q.id]) {
        const v = Number(answers[q.id]);
        if (q.validation.min !== undefined && v < q.validation.min) e[q.id] = `Minimum value is ${q.validation.min}`;
        if (q.validation.max !== undefined && v > q.validation.max) e[q.id] = `Maximum value is ${q.validation.max}`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await axios.post('/api/eligibility/check', { schemeId: scheme.id, answers });
      navigate('/eligibility-result', { state: { result: res.data.data, scheme } });
    } catch { setErrors({ _api: 'Something went wrong. Please try again.' }); }
    setSubmitting(false);
  };

  if (loading) return <div className="container elig-page"><SkeletonLoader type="detail" /></div>;

  return (
    <div className="elig-page container">
      <h1 className="elig-title">Verify Eligibility</h1>
      {scheme && <h2 className="elig-scheme-name">{scheme.name}</h2>}

      {questions.length === 0 ? (
        <div className="elig-open"><p>No specific eligibility criteria. This scheme is open to all eligible citizens.</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="elig-form card" noValidate>
          {errors._api && <div className="auth-error">{errors._api}</div>}
          {questions.map(q => (
            <div key={q.id} className={`form-field ${errors[q.id] ? 'has-error' : ''}`}>
              <label>{q.question} {q.required && <span className="required">*</span>}</label>
              {q.type === 'dropdown' ? (
                <select value={answers[q.id] || ''} onChange={e => { setAnswers({ ...answers, [q.id]: e.target.value }); if (errors[q.id]) setErrors({ ...errors, [q.id]: '' }); }}>
                  <option value="">Select...</option>
                  {(q.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type="number" value={answers[q.id] || ''} onChange={e => { setAnswers({ ...answers, [q.id]: e.target.value }); if (errors[q.id]) setErrors({ ...errors, [q.id]: '' }); }}
                  min={q.validation?.min} max={q.validation?.max} placeholder={q.validation ? `${q.validation.min || 0} - ${q.validation.max || ''}` : ''} />
              )}
              {errors[q.id] && <span className="field-error">{errors[q.id]}</span>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? 'Checking...' : 'Check Eligibility'}</button>
        </form>
      )}
    </div>
  );
};

export default VerifyEligibility;
