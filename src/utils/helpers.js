import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMM dd, yyyy');
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return '';
  }
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const toISOString = (date) => {
  if (!date) return null;
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toISOString();
  } catch (error) {
    return null;
  }
};

export const getDateRange = (period, date = new Date()) => {
  switch (period) {
    case 'WEEKLY':
      return {
        startDate: startOfWeek(date),
        endDate: endOfWeek(date),
      };
    case 'YEARLY':
      return {
        startDate: startOfYear(date),
        endDate: endOfYear(date),
      };
    case 'MONTHLY':
    default:
      return {
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
      };
  }
};

export const getCategoryIcon = (category) => {
  const icons = {
    salary: '💰',
    freelance: '💼',
    investment: '📈',
    gift: '🎁',
    'other-income': '💵',
    fuel: '⛽',
    food: '🍔',
    movie: '🎬',
    medical: '🏥',
    loan: '🏦',
    rent: '🏠',
    utilities: '💡',
    shopping: '🛍️',
    transportation: '🚗',
    entertainment: '🎮',
    education: '📚',
    'other-expense': '💳',
  };
  return icons[category] || '💰';
};
