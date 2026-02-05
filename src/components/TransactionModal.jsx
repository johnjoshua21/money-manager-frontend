import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { transactionService } from '../services/api';
import { useApp } from '../contexts/AppContext';

const TransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const { categories, refresh } = useApp();
  const [activeTab, setActiveTab] = useState('INCOME');
  const [formData, setFormData] = useState({
    type: 'INCOME',
    amount: '',
    category: '',
    division: 'PERSONAL',
    description: '',
    date: new Date().toISOString().slice(0, 16),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setActiveTab(transaction.type);
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        division: transaction.division,
        description: transaction.description || '',
        date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    } else {
      resetForm();
    }
  }, [transaction, isOpen]);

  const resetForm = () => {
    setFormData({
      type: 'INCOME',
      amount: '',
      category: '',
      division: 'PERSONAL',
      description: '',
      date: new Date().toISOString().slice(0, 16),
    });
    setActiveTab('INCOME');
    setErrors({});
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab, category: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      if (transaction) {
        await transactionService.update(transaction.id, data);
      } else {
        await transactionService.create(data);
      }

      refresh();
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert(error.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === activeTab || cat.type === 'BOTH'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        {!transaction && (
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-semibold transition-colors ${
                activeTab === 'INCOME'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('INCOME')}
            >
              Income
            </button>
            <button
              className={`flex-1 py-4 font-semibold transition-colors ${
                activeTab === 'EXPENSE'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('EXPENSE')}
            >
              Expense
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="label">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`input ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              step="0.01"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Division */}
          <div>
            <label className="label">Division</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="division"
                  value="PERSONAL"
                  checked={formData.division === 'PERSONAL'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Personal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="division"
                  value="OFFICE"
                  checked={formData.division === 'OFFICE'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Office
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              placeholder="Enter description (optional)"
              rows="3"
            />
          </div>

          {/* Date */}
          <div>
            <label className="label">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 ${
                activeTab === 'INCOME'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
              disabled={loading}
            >
              {loading ? 'Saving...' : transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
