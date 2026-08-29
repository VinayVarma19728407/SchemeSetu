import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBookmark, FaRegBookmark, FaCheckCircle, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaClipboardList } from 'react-icons/fa';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import SkeletonLoader from '../../components/common/SkeletonLoader.jsx';
import { getCategoryColor, getMinistryShortName, formatDate } from '../../utils/helpers.js';
import './SchemeDetails.css';

const SchemeDetails = () => {
  const { slug } = useParams();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const [scheme, setScheme] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/schemes/${slug}`)
      .then(r => {
        const s = r.data.data;
        setScheme(s);
        if (s?.category) {
          axios.get(`/api/schemes?category=${encodeURIComponent(s.category)}&limit=4`)
            .then(r2 => setRelated((r2.data.data?.schemes || []).filter(x => x.slug !== slug).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => setError('Scheme not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container detail-page"><SkeletonLoader type="detail" /></div>;
  if (error || !scheme) return <div className="container detail-page"><div className="detail-error"><h2>{error || 'Scheme not found.'}</h2><Link to="/browse" className="btn btn-primary">Browse Schemes</Link></div></div>;

  const isBookmarked = bookmarks.some(b => b.id === scheme.id);
  const elig = scheme.eligibility || {};

  return (
    <div className="detail-page container">
      <div className="detail-header">
        <div>
          <span className="scheme-category-badge" style={{ backgroundColor: getCategoryColor(scheme.category) }}>{scheme.category}</span>
          {scheme.subcategory && <span className="detail-subcategory">{scheme.subcategory}</span>}
        </div>
        <div className="detail-meta">
          <span className="detail-ministry">{getMinistryShortName(scheme.ministry)}</span>
          {scheme.ministry?.department && <span className="detail-dept">{scheme.ministry.department}</span>}
        </div>
      </div>

      <h1 className="detail-title">{scheme.name}</h1>

      <div className="detail-actions">
        <button className={`btn ${isBookmarked ? 'btn-accent' : 'btn-outline-dark'}`} onClick={() => toggleBookmark(scheme.id)}>
          {isBookmarked ? <><FaBookmark /> Bookmarked</> : <><FaRegBookmark /> Bookmark</>}
        </button>
        <Link to={`/eligibility/${scheme.slug}`} className="btn btn-primary"><FaClipboardList /> Verify Eligibility</Link>
      </div>

      {/* Overview */}
      <section className="detail-section">
        <h2>Overview</h2>
        <p>{scheme.overview}</p>
      </section>

      {/* Objectives */}
      {scheme.objectives?.length > 0 && (
        <section className="detail-section">
          <h2>Objectives</h2>
          <ul className="detail-list">{scheme.objectives.map((o, i) => <li key={i}><FaCheckCircle className="list-icon" /> {o}</li>)}</ul>
        </section>
      )}

      {/* Benefits */}
      {scheme.benefits?.length > 0 && (
        <section className="detail-section">
          <h2>Benefits</h2>
          <div className="benefits-grid">{scheme.benefits.map((b, i) => (
            <div key={i} className="benefit-card"><h4>{b.title}</h4><p>{b.description}</p></div>
          ))}</div>
        </section>
      )}

      {/* Eligibility */}
      <section className="detail-section">
        <h2>Eligibility Criteria</h2>
        <div className="elig-grid">
          {elig.age && <div className="elig-item"><strong>Age:</strong> {elig.age.minimum || 0} – {elig.age.maximum || 'No limit'} years</div>}
          {elig.gender?.length > 0 && <div className="elig-item"><strong>Gender:</strong> {elig.gender.join(', ')}</div>}
          {elig.income?.maximumAnnualIncome && <div className="elig-item"><strong>Max Income:</strong> ₹{Number(elig.income.maximumAnnualIncome).toLocaleString('en-IN')}</div>}
          {elig.occupation?.length > 0 && <div className="elig-item"><strong>Occupation:</strong> {elig.occupation.join(', ')}</div>}
          {elig.socialCategory?.length > 0 && <div className="elig-item"><strong>Social Category:</strong> {elig.socialCategory.join(', ')}</div>}
          {elig.residency?.states?.length > 0 && <div className="elig-item"><strong>States:</strong> {elig.residency.states.join(', ')}</div>}
        </div>
        {elig.otherCriteria?.length > 0 && (
          <ul className="detail-list" style={{ marginTop: '1rem' }}>{elig.otherCriteria.map((c, i) => <li key={i}><FaCheckCircle className="list-icon" /> {c}</li>)}</ul>
        )}
      </section>

      {/* Documents */}
      {scheme.requiredDocuments?.length > 0 && (
        <section className="detail-section">
          <h2>Required Documents</h2>
          <ul className="doc-list">{scheme.requiredDocuments.map((d, i) => (
            <li key={i}>{d.name} {d.mandatory && <span className="mandatory-badge">Mandatory</span>}</li>
          ))}</ul>
        </section>
      )}

      {/* Application Process */}
      {scheme.applicationProcess?.length > 0 && (
        <section className="detail-section">
          <h2>Application Process</h2>
          <ol className="process-steps">{scheme.applicationProcess.map((s, i) => (
            <li key={i}><span className="step-num">{s.step || i + 1}</span><div><p>{s.description}</p></div></li>
          ))}</ol>
        </section>
      )}

      {/* FAQs */}
      {scheme.faqs?.length > 0 && (
        <section className="detail-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">{scheme.faqs.map((f, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.question}</span>{openFaq === i ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openFaq === i && <div className="faq-answer"><p>{f.answer}</p></div>}
            </div>
          ))}</div>
        </section>
      )}

      {/* Links */}
      {scheme.officialLinks && (
        <section className="detail-section">
          <h2>Official Links</h2>
          <div className="official-links">
            {scheme.officialLinks.information && <a href={scheme.officialLinks.information} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">Scheme Information <FaExternalLinkAlt /></a>}
            {scheme.officialLinks.application && <a href={scheme.officialLinks.application} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Apply Online <FaExternalLinkAlt /></a>}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="detail-section">
          <h2>Related Schemes</h2>
          <div className="scheme-grid">{related.map(s => <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={bookmarks.some(b => b.id === s.id)} />)}</div>
        </section>
      )}
    </div>
  );
};

export default SchemeDetails;
