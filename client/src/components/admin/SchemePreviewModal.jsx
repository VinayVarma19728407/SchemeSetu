import React from 'react';
import { FaTimes, FaExternalLinkAlt, FaCheckCircle, FaFileAlt, FaQuestionCircle } from 'react-icons/fa';
import './SchemePreviewModal.css';

export const SchemePreviewModal = ({ scheme, isOpen, onClose }) => {
  if (!isOpen || !scheme) return null;

  const ministryName = typeof scheme.ministry === 'object' ? scheme.ministry?.name : scheme.ministry;
  const elig = scheme.eligibility || {};

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-container" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="preview-badge-group">
            <span className="preview-pill-admin">ADMIN PREVIEW</span>
            <span className="preview-status-badge" data-status={scheme.status || 'Active'}>
              {scheme.status || 'Active'}
            </span>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close Preview">
            <FaTimes />
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="preview-scheme-hero">
            {scheme.logo && (
              <img 
                src={scheme.logo} 
                alt="Scheme Logo" 
                className="preview-scheme-logo" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div>
              <div className="preview-category-tag">{scheme.category} {scheme.subcategory && `• ${scheme.subcategory}`}</div>
              <h2 className="preview-title">{scheme.name || 'Untitled Scheme'}</h2>
              <p className="preview-ministry">{ministryName || 'Ministry Not Specified'}</p>
              <div className="preview-id-code">Scheme ID: <code>{scheme.id}</code> | Slug: <code>{scheme.slug}</code></div>
            </div>
          </div>

          <div className="preview-section">
            <h4>Overview</h4>
            <p>{scheme.overview || 'No overview provided.'}</p>
          </div>

          {scheme.objectives && scheme.objectives.length > 0 && (
            <div className="preview-section">
              <h4>Key Objectives</h4>
              <ul className="preview-bullets">
                {scheme.objectives.map((obj, i) => (
                  <li key={i}><FaCheckCircle className="preview-check" /> {obj}</li>
                ))}
              </ul>
            </div>
          )}

          {scheme.benefits && scheme.benefits.length > 0 && (
            <div className="preview-section">
              <h4>Benefits</h4>
              <div className="preview-grid-cards">
                {scheme.benefits.map((b, i) => {
                  const title = typeof b === 'object' ? b.title : `Benefit #${i + 1}`;
                  const desc = typeof b === 'object' ? b.description : b;
                  return (
                    <div key={i} className="preview-card-item">
                      <strong>{title}</strong>
                      <p>{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="preview-section">
            <h4>Eligibility Overview</h4>
            <div className="preview-elig-chips">
              <span className="preview-chip"><strong>Age:</strong> {elig.age?.minimum || elig.minimumAge || 'Any'} - {elig.age?.maximum || elig.maximumAge || 'Any'} yrs</span>
              <span className="preview-chip"><strong>Gender:</strong> {Array.isArray(elig.gender) ? (elig.gender.length ? elig.gender.join(', ') : 'Any') : (elig.gender || 'Any')}</span>
              <span className="preview-chip"><strong>Max Income:</strong> {elig.income?.maximumAnnualIncome || elig.incomeLimit ? `?${(elig.income?.maximumAnnualIncome || elig.incomeLimit).toLocaleString('en-IN')}` : 'No limit'}</span>
              <span className="preview-chip"><strong>Occupations:</strong> {elig.occupation && Array.isArray(elig.occupation) && elig.occupation.length ? elig.occupation.join(', ') : 'All'}</span>
            </div>
          </div>

          {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
            <div className="preview-section">
              <h4>Required Documents</h4>
              <div className="preview-doc-list">
                {scheme.requiredDocuments.map((doc, i) => {
                  const name = typeof doc === 'object' ? doc.name : doc;
                  const mandatory = typeof doc === 'object' ? doc.mandatory : true;
                  return (
                    <div key={i} className="preview-doc-badge">
                      <FaFileAlt /> {name} {mandatory && <span className="req-pill">Mandatory</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="preview-section">
            <h4>Official Links</h4>
            <div className="preview-links-row">
              {(scheme.officialInfoLink || scheme.officialLinks?.information) && (
                <a 
                  href={scheme.officialInfoLink || scheme.officialLinks?.information} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="preview-btn-link"
                >
                  Official Scheme Portal <FaExternalLinkAlt />
                </a>
              )}
              {(scheme.officialApplyLink || scheme.officialLinks?.application) && (
                <a 
                  href={scheme.officialApplyLink || scheme.officialLinks?.application} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="preview-btn-link primary"
                >
                  Apply Online Portal <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="preview-btn-dismiss" onClick={onClose}>Close Preview</button>
        </div>
      </div>
    </div>
  );
};

export default SchemePreviewModal;
