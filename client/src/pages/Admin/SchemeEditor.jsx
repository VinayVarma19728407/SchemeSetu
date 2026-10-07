import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaSave, 
  FaArrowLeft, 
  FaEye, 
  FaUpload, 
  FaPlus, 
  FaTrash, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaFileAlt
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SchemePreviewModal from '../../components/admin/SchemePreviewModal.jsx';
import adminService from '../../services/adminService.js';
import './SchemeEditor.css';

const CATEGORIES = [
  'Agriculture',
  'Education',
  'Employment',
  'Financial Assistance',
  'Food & Public Distribution',
  'Green India & Environment',
  'Health',
  'Housing',
  'Infrastructure',
  'Insurance',
  'MSME',
  'Pension',
  'Senior Citizens',
  'Skill Development',
  'Startups & Entrepreneurship',
  'Students',
  'Women & Child Development'
];

const MINISTRIES = [
  'Ministry of Agriculture and Farmers Welfare',
  'Ministry of Education',
  'Ministry of Finance',
  'Ministry of Health and Family Welfare',
  'Ministry of Housing and Urban Affairs',
  'Ministry of Labour and Employment',
  'Ministry of Micro, Small and Medium Enterprises',
  'Ministry of Skill Development and Entrepreneurship',
  'Ministry of Women and Child Development',
  'Ministry of Consumer Affairs, Food and Public Distribution',
  'Ministry of Environment, Forest and Climate Change',
  'Ministry of Rural Development',
  'Ministry of Social Justice and Empowerment'
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry',
  'Jammu & Kashmir','Ladakh','Andaman & Nicobar Islands','Dadra & Nagar Haveli','Lakshadweep'
];

const INITIAL_SCHEME = {
  id: '',
  name: '',
  slug: '',
  category: 'Agriculture',
  subcategory: '',
  ministry: {
    name: 'Ministry of Agriculture and Farmers Welfare',
    department: ''
  },
  status: 'Active',
  overview: '',
  logo: '',
  objectives: [''],
  benefits: [{ title: '', description: '' }],
  eligibility: {
    age: { minimum: '', maximum: '' },
    gender: [],
    income: { maximumAnnualIncome: '', currency: 'INR' },
    occupation: [],
    education: [],
    socialCategory: [],
    disability: false,
    residency: { country: 'India', states: [] },
    customQuestions: [],
    otherCriteria: ['']
  },
  requiredDocuments: [{ name: '', mandatory: true }],
  applicationProcess: [{ step: 1, description: '' }],
  faqs: [{ question: '', answer: '' }],
  officialInfoLink: '',
  officialApplyLink: '',
  officialLinks: {
    information: '',
    application: '',
    guidelines: ''
  },
  keywords: [],
  tags: [],
  analytics: {
    featured: false,
    popular: false,
    recentlyAdded: true
  }
};

export const SchemeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(INITIAL_SCHEME);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Tag inputs helper
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [occupationInput, setOccupationInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadScheme(id);
    }
  }, [id, isEditMode]);

  const loadScheme = async (schemeId) => {
    try {
      setLoading(true);
      const res = await adminService.getSchemeById(schemeId);
      if (res.success && res.data) {
        const s = res.data;
        const customQ = Array.isArray(s.eligibility?.customQuestions)
          ? s.eligibility.customQuestions
          : (Array.isArray(s.customQuestions) ? s.customQuestions : []);

        setFormData({
          ...INITIAL_SCHEME,
          ...s,
          ministry: typeof s.ministry === 'string' ? { name: s.ministry, department: '' } : { name: s.ministry?.name || '', department: s.ministry?.department || '' },
          objectives: s.objectives?.length ? s.objectives : [''],
          benefits: s.benefits?.length ? s.benefits.map(b => typeof b === 'string' ? { title: 'Benefit', description: b } : b) : [{ title: '', description: '' }],
          requiredDocuments: s.requiredDocuments?.length ? s.requiredDocuments.map(d => typeof d === 'string' ? { name: d, mandatory: true } : d) : [{ name: '', mandatory: true }],
          applicationProcess: s.applicationProcess?.length ? s.applicationProcess.map((p, i) => typeof p === 'string' ? { step: i + 1, description: p } : p) : [{ step: 1, description: '' }],
          faqs: s.faqs?.length ? s.faqs : [{ question: '', answer: '' }],
          officialInfoLink: s.officialInfoLink || s.officialLinks?.information || '',
          officialApplyLink: s.officialApplyLink || s.officialLinks?.application || '',
          keywords: Array.isArray(s.keywords) ? s.keywords : [],
          tags: Array.isArray(s.tags) ? s.tags : [],
          eligibility: {
            ...INITIAL_SCHEME.eligibility,
            ...(s.eligibility || {}),
            age: {
              minimum: s.eligibility?.age?.minimum !== undefined && s.eligibility?.age?.minimum !== null ? s.eligibility.age.minimum : '',
              maximum: s.eligibility?.age?.maximum !== undefined && s.eligibility?.age?.maximum !== null ? s.eligibility.age.maximum : ''
            },
            income: {
              maximumAnnualIncome: s.eligibility?.income?.maximumAnnualIncome !== undefined && s.eligibility?.income?.maximumAnnualIncome !== null ? s.eligibility.income.maximumAnnualIncome : '',
              currency: 'INR'
            },
            gender: Array.isArray(s.eligibility?.gender) ? s.eligibility.gender : [],
            occupation: Array.isArray(s.eligibility?.occupation) ? s.eligibility.occupation : [],
            socialCategory: Array.isArray(s.eligibility?.socialCategory) ? s.eligibility.socialCategory : [],
            disability: Boolean(s.eligibility?.disability),
            residency: {
              country: 'India',
              states: Array.isArray(s.eligibility?.residency?.states) ? s.eligibility.residency.states : []
            },
            customQuestions: customQ
          },
          analytics: {
            featured: Boolean(s.analytics?.featured || s.featured),
            popular: Boolean(s.analytics?.popular || s.popular),
            recentlyAdded: Boolean(s.analytics?.recentlyAdded || s.recentlyAdded)
          }
        });
      } else {
        setError('Failed to load scheme details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching scheme data');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMinistryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      ministry: { ...prev.ministry, [field]: value }
    }));
  };

  const handleAgeChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        age: { ...prev.eligibility.age, [field]: val ? parseInt(val) : '' }
      }
    }));
  };

  const handleIncomeChange = (val) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        income: { ...prev.eligibility.income, maximumAnnualIncome: val ? parseInt(val) : '' }
      }
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      setError('');
      const res = await adminService.uploadLogo(file);
      if (res.success && res.data?.filePath) {
        setFormData(prev => ({ ...prev, logo: res.data.filePath }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Objectives List
  const addObjective = () => setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  const updateObjective = (idx, val) => {
    const arr = [...formData.objectives];
    arr[idx] = val;
    setFormData(prev => ({ ...prev, objectives: arr }));
  };
  const removeObjective = (idx) => {
    setFormData(prev => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== idx) }));
  };

  // Benefits List
  const addBenefit = () => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, { title: '', description: '' }] }));
  const updateBenefit = (idx, field, val) => {
    const arr = [...formData.benefits];
    arr[idx] = { ...arr[idx], [field]: val };
    setFormData(prev => ({ ...prev, benefits: arr }));
  };
  const removeBenefit = (idx) => {
    setFormData(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== idx) }));
  };

  // Documents List
  const addDocument = () => setFormData(prev => ({ ...prev, requiredDocuments: [...prev.requiredDocuments, { name: '', mandatory: true }] }));
  const updateDocument = (idx, field, val) => {
    const arr = [...formData.requiredDocuments];
    arr[idx] = { ...arr[idx], [field]: val };
    setFormData(prev => ({ ...prev, requiredDocuments: arr }));
  };
  const removeDocument = (idx) => {
    setFormData(prev => ({ ...prev, requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== idx) }));
  };

  // Application Process List
  const addProcessStep = () => setFormData(prev => ({
    ...prev,
    applicationProcess: [...prev.applicationProcess, { step: prev.applicationProcess.length + 1, description: '' }]
  }));
  const updateProcessStep = (idx, val) => {
    const arr = [...formData.applicationProcess];
    arr[idx] = { ...arr[idx], description: val };
    setFormData(prev => ({ ...prev, applicationProcess: arr }));
  };
  const removeProcessStep = (idx) => {
    const filtered = formData.applicationProcess.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 }));
    setFormData(prev => ({ ...prev, applicationProcess: filtered }));
  };

  // FAQs List
  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  const updateFaq = (idx, field, val) => {
    const arr = [...formData.faqs];
    arr[idx] = { ...arr[idx], [field]: val };
    setFormData(prev => ({ ...prev, faqs: arr }));
  };
  const removeFaq = (idx) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
  };

  // Demographic Eligibility Toggles
  const handleGenderToggle = (gen) => {
    const cur = formData.eligibility.gender || [];
    const updated = cur.includes(gen) ? cur.filter(g => g !== gen) : [...cur, gen];
    setFormData(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility, gender: updated }
    }));
  };

  const handleCategoryToggle = (cat) => {
    const cur = formData.eligibility.socialCategory || [];
    const updated = cur.includes(cat) ? cur.filter(c => c !== cat) : [...cur, cat];
    setFormData(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility, socialCategory: updated }
    }));
  };

  const handleDisabilityToggle = (val) => {
    setFormData(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility, disability: val }
    }));
  };

  const handleStateToggle = (st) => {
    const cur = formData.eligibility.residency?.states || [];
    const updated = cur.includes(st) ? cur.filter(s => s !== st) : [...cur, st];
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        residency: { ...prev.eligibility.residency, states: updated }
      }
    }));
  };

  // Custom Eligibility Questions Builder
  const addCustomQuestion = () => {
    const list = formData.eligibility?.customQuestions || [];
    const newQ = {
      id: `q${list.length + 1}_${Date.now().toString(36)}`,
      question: '',
      type: 'dropdown',
      options: ['Yes', 'No'],
      expectedAnswer: 'Yes',
      required: true
    };
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        customQuestions: [...(prev.eligibility?.customQuestions || []), newQ]
      }
    }));
  };

  const updateCustomQuestion = (idx, field, val) => {
    const list = [...(formData.eligibility?.customQuestions || [])];
    list[idx] = { ...list[idx], [field]: val };
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        customQuestions: list
      }
    }));
  };

  const removeCustomQuestion = (idx) => {
    const list = (formData.eligibility?.customQuestions || []).filter((_, i) => i !== idx);
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        customQuestions: list
      }
    }));
  };

  // Tags and Arrays
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
      setKeywordInput('');
    }
  };
  const removeKeyword = (kw) => setFormData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (t) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(item => item !== t) }));

  const addOccupation = () => {
    if (occupationInput.trim() && !(formData.eligibility.occupation || []).includes(occupationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          occupation: [...(prev.eligibility.occupation || []), occupationInput.trim()]
        }
      }));
      setOccupationInput('');
    }
  };
  const removeOccupation = (occ) => setFormData(prev => ({
    ...prev,
    eligibility: {
      ...prev.eligibility,
      occupation: (prev.eligibility.occupation || []).filter(o => o !== occ)
    }
  }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    // Validation checks
    if (!formData.name.trim()) {
      setError('Scheme Name is required.');
      setActiveTab('basic');
      return;
    }
    if (!formData.overview.trim()) {
      setError('Overview is required.');
      setActiveTab('description');
      return;
    }
    if (!formData.officialInfoLink.trim()) {
      setError('Official Information Link is required.');
      setActiveTab('links');
      return;
    }
    if (!formData.officialApplyLink.trim()) {
      setError('Official Application Link is required.');
      setActiveTab('links');
      return;
    }

    const cleanedCustomQuestions = (formData.eligibility?.customQuestions || [])
      .filter(q => q.question && q.question.trim().length > 0)
      .map(q => ({
        ...q,
        question: q.question.trim(),
        options: Array.isArray(q.options) ? q.options.filter(o => String(o).trim()) : ['Yes', 'No'],
        expectedAnswer: q.expectedAnswer !== undefined ? String(q.expectedAnswer).trim() : 'Yes'
      }));

    const payload = {
      ...formData,
      eligibility: {
        ...formData.eligibility,
        customQuestions: cleanedCustomQuestions
      },
      customQuestions: cleanedCustomQuestions,
      objectives: formData.objectives.filter(o => o.trim().length > 0),
      benefits: formData.benefits.filter(b => b.title.trim() || b.description.trim()),
      requiredDocuments: formData.requiredDocuments.filter(d => d.name.trim().length > 0),
      applicationProcess: formData.applicationProcess.filter(s => s.description.trim().length > 0),
      faqs: formData.faqs.filter(f => f.question.trim().length > 0),
      officialLinks: {
        information: formData.officialInfoLink.trim(),
        application: formData.officialApplyLink.trim(),
        guidelines: formData.officialLinks?.guidelines || ''
      }
    };

    try {
      setSaving(true);
      if (isEditMode) {
        await adminService.updateScheme(id, payload);
        setSuccess('Scheme updated successfully!');
      } else {
        await adminService.createScheme(payload);
        setSuccess('Scheme created successfully!');
        setTimeout(() => {
          navigate('/admin/manage-schemes');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving scheme');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading Scheme...">
        <div className="editor-loading">Loading scheme details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={isEditMode ? `Edit Scheme: ${formData.name || id}` : 'Add New Government Scheme'}
      subtitle={isEditMode ? `Editing Scheme ID: ${id}` : 'Fill in the structured fields below to publish a new scheme'}
    >
      <div className="scheme-editor-container">
        {/* Top Controls Bar */}
        <div className="editor-top-actions">
          <button 
            type="button" 
            className="editor-btn-secondary" 
            onClick={() => navigate('/admin/manage-schemes')}
          >
            <FaArrowLeft /> Back to Schemes
          </button>
          
          <div className="editor-right-buttons">
            <button 
              type="button" 
              className="editor-btn-preview" 
              onClick={() => setPreviewOpen(true)}
            >
              <FaEye /> Preview Citizen View
            </button>
            <button 
              type="button" 
              className="editor-btn-primary" 
              onClick={handleSubmit} 
              disabled={saving}
            >
              <FaSave /> {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Scheme')}
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="editor-alert-error">
            <FaExclamationTriangle /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="editor-alert-success">
            <FaCheckCircle /> <span>{success}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="editor-tabs">
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            1. Basic & Branding
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            2. Description & Benefits
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('eligibility')}
          >
            3. Eligibility & Questions
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => setActiveTab('process')}
          >
            4. Documents & FAQs
          </button>
          <button 
            type="button"
            className={`editor-tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            5. Links & Tags
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="editor-form">
          {/* TAB 1: BASIC & BRANDING */}
          {activeTab === 'basic' && (
            <div className="editor-tab-content">
              <div className="editor-grid-2">
                <div className="form-group">
                  <label>Scheme Name <span className="req">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleTextChange('name', e.target.value)} 
                    placeholder="e.g., Pradhan Mantri Awas Yojana"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category <span className="req">*</span></label>
                  <select 
                    value={formData.category} 
                    onChange={e => handleTextChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="editor-grid-3">
                <div className="form-group">
                  <label>Scheme ID (Optional - Auto generated)</label>
                  <input 
                    type="text" 
                    value={formData.id} 
                    onChange={e => handleTextChange('id', e.target.value)} 
                    placeholder="e.g. SCH171 (Leave blank to auto-assign)"
                    disabled={isEditMode}
                  />
                  {isEditMode && <span className="input-hint">Scheme ID cannot be modified once created.</span>}
                </div>

                <div className="form-group">
                  <label>URL Slug (Optional - Auto derived)</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={e => handleTextChange('slug', e.target.value)} 
                    placeholder="e.g. pradhan-mantri-awas-yojana"
                  />
                </div>

                <div className="form-group">
                  <label>Publication Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => handleTextChange('status', e.target.value)}
                  >
                    <option value="Active">Active (Publicly Visible)</option>
                    <option value="Inactive">Inactive (Hidden/Draft)</option>
                  </select>
                </div>
              </div>

              <div className="editor-grid-2">
                <div className="form-group">
                  <label>Ministry Name <span className="req">*</span></label>
                  <input 
                    type="text" 
                    list="ministry-list" 
                    value={formData.ministry?.name || ''} 
                    onChange={e => handleMinistryChange('name', e.target.value)} 
                    placeholder="Choose or type ministry"
                    required
                  />
                  <datalist id="ministry-list">
                    {MINISTRIES.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>

                <div className="form-group">
                  <label>Subcategory / Department</label>
                  <input 
                    type="text" 
                    value={formData.subcategory} 
                    onChange={e => handleTextChange('subcategory', e.target.value)} 
                    placeholder="e.g. Subsidies, Urban Welfare"
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="form-group logo-upload-section">
                <label>Scheme Logo</label>
                <div className="logo-upload-box">
                  {formData.logo ? (
                    <div className="logo-preview-wrapper">
                      <img src={formData.logo} alt="Logo" className="uploaded-logo-preview" />
                      <button 
                        type="button" 
                        className="btn-remove-logo" 
                        onClick={() => handleTextChange('logo', '')}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="logo-placeholder">
                      <FaUpload className="upload-icon" />
                      <span>No logo uploaded</span>
                    </div>
                  )}

                  <div className="logo-inputs">
                    <label className="btn-file-chooser">
                      <FaUpload /> {uploadingLogo ? 'Uploading...' : 'Choose Logo Image'}
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                        onChange={handleLogoUpload} 
                        disabled={uploadingLogo} 
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span className="logo-url-divider">or paste URL:</span>
                    <input 
                      type="text" 
                      value={formData.logo} 
                      onChange={e => handleTextChange('logo', e.target.value)} 
                      placeholder="/uploads/logo-sample.png or https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION & BENEFITS */}
          {activeTab === 'description' && (
            <div className="editor-tab-content">
              <div className="form-group">
                <label>Overview & Scheme Summary <span className="req">*</span></label>
                <textarea 
                  rows={4} 
                  value={formData.overview} 
                  onChange={e => handleTextChange('overview', e.target.value)} 
                  placeholder="Provide a concise, user-friendly description of the scheme..."
                  required
                />
              </div>

              <div className="form-group dynamic-list-section">
                <div className="section-title-row">
                  <label>Key Objectives</label>
                  <button type="button" className="btn-add-item" onClick={addObjective}>
                    <FaPlus /> Add Objective
                  </button>
                </div>
                {formData.objectives.map((obj, i) => (
                  <div key={i} className="dynamic-input-row">
                    <span className="row-index">{i + 1}.</span>
                    <input 
                      type="text" 
                      value={obj} 
                      onChange={e => updateObjective(i, e.target.value)} 
                      placeholder="e.g. Provide financial security to farmers"
                    />
                    <button type="button" className="btn-del-item" onClick={() => removeObjective(i)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group dynamic-list-section">
                <div className="section-title-row">
                  <label>Benefits Offered</label>
                  <button type="button" className="btn-add-item" onClick={addBenefit}>
                    <FaPlus /> Add Benefit
                  </button>
                </div>
                {formData.benefits.map((b, i) => (
                  <div key={i} className="benefit-input-block">
                    <div className="benefit-block-header">
                      <strong>Benefit #{i + 1}</strong>
                      <button type="button" className="btn-del-item" onClick={() => removeBenefit(i)}>
                        <FaTrash />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={b.title} 
                      onChange={e => updateBenefit(i, 'title', e.target.value)} 
                      placeholder="Benefit Title (e.g. Direct Subsidy)"
                    />
                    <textarea 
                      rows={2} 
                      value={b.description} 
                      onChange={e => updateBenefit(i, 'description', e.target.value)} 
                      placeholder="Benefit Description (e.g. Rs. 6000 directly transferred to bank account)"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ELIGIBILITY & QUESTIONS */}
          {activeTab === 'eligibility' && (
            <div className="editor-tab-content">
              <h4>Demographic Eligibility Criteria</h4>
              <p className="section-help" style={{ marginTop: '-0.5rem', marginBottom: '1.25rem', color: '#64748b' }}>
                Define core demographic rules used by the automated recommendation engine.
              </p>

              <div className="editor-grid-3">
                <div className="form-group">
                  <label>Minimum Age</label>
                  <input 
                    type="number" 
                    value={formData.eligibility.age?.minimum || ''} 
                    onChange={e => handleAgeChange('minimum', e.target.value)} 
                    placeholder="e.g. 18"
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Age</label>
                  <input 
                    type="number" 
                    value={formData.eligibility.age?.maximum || ''} 
                    onChange={e => handleAgeChange('maximum', e.target.value)} 
                    placeholder="e.g. 60 (Empty for no limit)"
                  />
                </div>

                <div className="form-group">
                  <label>Max Annual Income (₹)</label>
                  <input 
                    type="number" 
                    value={formData.eligibility.income?.maximumAnnualIncome || ''} 
                    onChange={e => handleIncomeChange(e.target.value)} 
                    placeholder="e.g. 250000 (Empty for any)"
                  />
                </div>
              </div>

              {/* Gender & Social Category */}
              <div className="editor-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Eligible Genders (Select applicable, or leave empty for All)</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input 
                          type="checkbox" 
                          checked={(formData.eligibility.gender || []).includes(g)} 
                          onChange={() => handleGenderToggle(g)}
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Eligible Social Categories (Leave empty for All)</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {['General', 'OBC', 'SC', 'ST'].map(cat => (
                      <label key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input 
                          type="checkbox" 
                          checked={(formData.eligibility.socialCategory || []).includes(cat)} 
                          onChange={() => handleCategoryToggle(cat)}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disability Checkbox */}
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    checked={Boolean(formData.eligibility.disability)} 
                    onChange={e => handleDisabilityToggle(e.target.checked)}
                  />
                  <span>Restrict to Persons with Disabilities (PwD) only</span>
                </label>
              </div>

              {/* Occupations */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Eligible Occupations</label>
                <div className="tag-input-group">
                  <input 
                    type="text" 
                    value={occupationInput} 
                    onChange={e => setOccupationInput(e.target.value)} 
                    placeholder="Type occupation and click Add (e.g. Farmer, Student, Artisan, Self-Employed)"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOccupation(); } }}
                  />
                  <button type="button" className="btn-add-tag" onClick={addOccupation}>Add</button>
                </div>
                <div className="tag-cloud">
                  {(formData.eligibility.occupation || []).length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>All occupations eligible</span>
                  ) : (
                    (formData.eligibility.occupation || []).map(occ => (
                      <span key={occ} className="tag-item">
                        {occ} <button type="button" onClick={() => removeOccupation(occ)}>&times;</button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* State Residency */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Eligible State(s) / Territories</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select 
                    onChange={e => {
                      if (e.target.value) {
                        handleStateToggle(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select State / UT to add to eligible list...</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="tag-cloud">
                  {(formData.eligibility.residency?.states || []).length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Open to residents across all Indian States & UTs</span>
                  ) : (
                    (formData.eligibility.residency?.states || []).map(st => (
                      <span key={st} className="tag-item">
                        {st} <button type="button" onClick={() => handleStateToggle(st)}>&times;</button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Custom Eligibility Questionnaire Builder */}
              <div className="dynamic-questionnaire-box" style={{ marginTop: '2rem' }}>
                <div className="section-title-row">
                  <div>
                    <h4>Custom Eligibility Questions (Verification Questionnaire)</h4>
                    <p className="section-help">
                      Define custom questions asked to citizens when verifying eligibility. Specify the expected qualifying answer.
                    </p>
                  </div>
                  <button type="button" className="btn-add-item" onClick={addCustomQuestion}>
                    <FaPlus /> Add Question
                  </button>
                </div>

                {(!formData.eligibility?.customQuestions || formData.eligibility.customQuestions.length === 0) ? (
                  <p className="empty-subtext">
                    No custom questions configured. The scheme will rely entirely on the demographic criteria above.
                  </p>
                ) : (
                  formData.eligibility.customQuestions.map((q, i) => (
                    <div key={q.id || i} className="question-builder-card" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', background: '#f8fafc' }}>
                      <div className="question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>
                          Question #{i + 1} <code style={{ fontSize: '0.8rem', color: '#64748b' }}>({q.id || `q${i + 1}`})</code>
                        </span>
                        <button 
                          type="button" 
                          className="btn-del-item" 
                          onClick={() => removeCustomQuestion(i)}
                          title="Remove Question"
                          style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Question Prompt / Label *</label>
                        <input 
                          type="text" 
                          value={q.question || ''} 
                          onChange={e => updateCustomQuestion(i, 'question', e.target.value)} 
                          placeholder="e.g. Do you cultivate agricultural land up to 2 hectares?"
                          required
                        />
                      </div>

                      <div className="editor-grid-3">
                        <div className="form-group">
                          <label>Input Type</label>
                          <select 
                            value={q.type || 'dropdown'} 
                            onChange={e => updateCustomQuestion(i, 'type', e.target.value)}
                          >
                            <option value="dropdown">Dropdown Selection</option>
                            <option value="radio">Yes / No Radio</option>
                            <option value="text">Text Input</option>
                            <option value="number">Numeric Input</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Allowed Options (comma-separated)</label>
                          <input 
                            type="text" 
                            value={Array.isArray(q.options) ? q.options.join(', ') : (q.options || '')} 
                            onChange={e => updateCustomQuestion(i, 'options', e.target.value.split(',').map(s => s.trim()))} 
                            placeholder="e.g. Yes, No"
                          />
                        </div>

                        <div className="form-group">
                          <label>Qualifying Answer *</label>
                          <input 
                            type="text" 
                            value={q.expectedAnswer !== undefined ? q.expectedAnswer : ''} 
                            onChange={e => updateCustomQuestion(i, 'expectedAnswer', e.target.value)} 
                            placeholder="e.g. Yes"
                            required
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={q.required !== false} 
                            onChange={e => updateCustomQuestion(i, 'required', e.target.checked)}
                          />
                          <span>Mandatory for eligibility check</span>
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & FAQS */}
          {activeTab === 'process' && (
            <div className="editor-tab-content">
              {/* Documents */}
              <div className="dynamic-list-section">
                <div className="section-title-row">
                  <label>Required Documents</label>
                  <button type="button" className="btn-add-item" onClick={addDocument}>
                    <FaPlus /> Add Document
                  </button>
                </div>
                {formData.requiredDocuments.map((doc, i) => (
                  <div key={i} className="dynamic-input-row">
                    <span className="row-index">{i + 1}.</span>
                    <input 
                      type="text" 
                      value={doc.name} 
                      onChange={e => updateDocument(i, 'name', e.target.value)} 
                      placeholder="e.g. Aadhaar Card, Income Certificate"
                    />
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={doc.mandatory} 
                        onChange={e => updateDocument(i, 'mandatory', e.target.checked)} 
                      />
                      <span>Mandatory</span>
                    </label>
                    <button type="button" className="btn-del-item" onClick={() => removeDocument(i)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              {/* Application Steps */}
              <div className="dynamic-list-section">
                <div className="section-title-row">
                  <label>Application Process Steps</label>
                  <button type="button" className="btn-add-item" onClick={addProcessStep}>
                    <FaPlus /> Add Step
                  </button>
                </div>
                {formData.applicationProcess.map((s, i) => (
                  <div key={i} className="dynamic-input-row">
                    <span className="row-index">Step {s.step || i + 1}</span>
                    <input 
                      type="text" 
                      value={s.description} 
                      onChange={e => updateProcessStep(i, e.target.value)} 
                      placeholder="e.g. Register on the official portal with mobile number"
                    />
                    <button type="button" className="btn-del-item" onClick={() => removeProcessStep(i)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="dynamic-list-section">
                <div className="section-title-row">
                  <label>Frequently Asked Questions (FAQs)</label>
                  <button type="button" className="btn-add-item" onClick={addFaq}>
                    <FaPlus /> Add FAQ
                  </button>
                </div>
                {formData.faqs.map((faq, i) => (
                  <div key={i} className="benefit-input-block">
                    <div className="benefit-block-header">
                      <strong>FAQ #{i + 1}</strong>
                      <button type="button" className="btn-del-item" onClick={() => removeFaq(i)}>
                        <FaTrash />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={faq.question} 
                      onChange={e => updateFaq(i, 'question', e.target.value)} 
                      placeholder="Question: e.g. What is the deadline to apply?"
                    />
                    <textarea 
                      rows={2} 
                      value={faq.answer} 
                      onChange={e => updateFaq(i, 'answer', e.target.value)} 
                      placeholder="Answer: e.g. Applications are open throughout the year."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LINKS & TAGS */}
          {activeTab === 'links' && (
            <div className="editor-tab-content">
              <div className="editor-grid-2">
                <div className="form-group">
                  <label>Official Information Portal Link <span className="req">*</span></label>
                  <input 
                    type="url" 
                    value={formData.officialInfoLink} 
                    onChange={e => handleTextChange('officialInfoLink', e.target.value)} 
                    placeholder="https://scheme.gov.in"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Official Online Application Link <span className="req">*</span></label>
                  <input 
                    type="url" 
                    value={formData.officialApplyLink} 
                    onChange={e => handleTextChange('officialApplyLink', e.target.value)} 
                    placeholder="https://scheme.gov.in/apply"
                    required
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="form-group">
                <label>Search Keywords (for instant search matching)</label>
                <div className="tag-input-group">
                  <input 
                    type="text" 
                    value={keywordInput} 
                    onChange={e => setKeywordInput(e.target.value)} 
                    placeholder="Add search keyword..."
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                  />
                  <button type="button" className="btn-add-tag" onClick={addKeyword}>Add Keyword</button>
                </div>
                <div className="tag-cloud">
                  {formData.keywords.map(kw => (
                    <span key={kw} className="tag-item">
                      {kw} <button type="button" onClick={() => removeKeyword(kw)}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label>System Tags</label>
                <div className="tag-input-group">
                  <input 
                    type="text" 
                    value={tagInput} 
                    onChange={e => setTagInput(e.target.value)} 
                    placeholder="Add tag..."
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  />
                  <button type="button" className="btn-add-tag" onClick={addTag}>Add Tag</button>
                </div>
                <div className="tag-cloud">
                  {formData.tags.map(t => (
                    <span key={t} className="tag-item">
                      #{t} <button type="button" onClick={() => removeTag(t)}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Flags */}
              <div className="flags-box">
                <label className="checkbox-card">
                  <input 
                    type="checkbox" 
                    checked={formData.analytics.featured} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      analytics: { ...prev.analytics, featured: e.target.checked }
                    }))} 
                  />
                  <div>
                    <strong>Featured Scheme</strong>
                    <p>Displays in the 6 Highlighted Schemes on the Home page.</p>
                  </div>
                </label>

                <label className="checkbox-card">
                  <input 
                    type="checkbox" 
                    checked={formData.analytics.recentlyAdded} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      analytics: { ...prev.analytics, recentlyAdded: e.target.checked }
                    }))} 
                  />
                  <div>
                    <strong>Recently Added</strong>
                    <p>Highlights the scheme in the Recently Added feed.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="editor-bottom-bar">
            <button 
              type="button" 
              className="editor-btn-secondary" 
              onClick={() => navigate('/admin/manage-schemes')}
            >
              Cancel
            </button>
            <div className="editor-right-buttons">
              <button 
                type="button" 
                className="editor-btn-preview" 
                onClick={() => setPreviewOpen(true)}
              >
                <FaEye /> Preview
              </button>
              <button 
                type="submit" 
                className="editor-btn-primary" 
                disabled={saving}
              >
                <FaSave /> {saving ? 'Saving...' : (isEditMode ? 'Save Scheme Updates' : 'Publish Scheme')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <SchemePreviewModal 
        scheme={formData} 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
      />
    </AdminLayout>
  );
};

export default SchemeEditor;
