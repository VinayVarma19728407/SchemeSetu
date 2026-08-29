export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const categoryColors = {
  'Agriculture': '#2E7D32', 'Education': '#1565C0', 'Employment': '#6A1B9A',
  'Financial Assistance': '#E65100', 'Food & Public Distribution': '#D84315',
  'Green India & Environment': '#1B5E20', 'Health': '#C62828', 'Housing': '#4E342E',
  'Infrastructure': '#37474F', 'Insurance': '#00838F', 'MSME': '#AD1457',
  'Pension': '#283593', 'Senior Citizens': '#5D4037', 'Skill Development': '#00695C',
  'Startups & Entrepreneurship': '#F57F17', 'Students': '#0277BD',
  'Women & Child Development': '#880E4F'
};

export const getCategoryColor = (category) => categoryColors[category] || '#0B3D91';

export const getMinistryShortName = (ministry) => {
  if (!ministry) return '';
  const name = typeof ministry === 'object' ? ministry.name : ministry;
  return name.replace('Ministry of ', '').replace(' and ', ' & ');
};

export const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
