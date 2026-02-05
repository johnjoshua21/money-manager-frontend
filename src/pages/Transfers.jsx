import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { transferService, accountService } from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/helpers';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transfersRes, accountsRes] = await Promise.all([
        transferService.getAll(filters.startDate && filters.endDate ? filters : {}),
        accountService.getAll(),
      ]);
      setTransfers(transfersRes.data.data);
      setAccounts(accountsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: new Date(formData.date).toISOString(),
      };

      await transferService.create(data);
      loadData();
      handleClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create transfer');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({
      fromAccountId: '',
      toAccountId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
    });
  };

  const applyFilters = () => {
    loadData();
  };

  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.accountName : 'Unknown Account';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Transfers</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Transfer
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter by Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <button onClick={applyFilters} className="btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : transfers.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No transfers found</p>
            <p className="text-gray-400 mt-2">Create your first transfer between accounts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <div key={transfer.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Transfer Flow */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">From</p>
                      <p className="font-semibold text-gray-800">
                        {getAccountName(transfer.fromAccountId)}
                      </p>
                    </div>

                    <div className="p-2 bg-primary-100 rounded-full">
                      <ArrowRight className="text-primary-600" size={24} />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">To</p>
                      <p className="font-semibold text-gray-800">
                        {getAccountName(transfer.toAccountId)}
                      </p>
                    </div>
                  </div>

                  {/* Amount and Details */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(transfer.amount)}
                    </p>
                    {transfer.description && (
                      <p className="text-gray-600 mt-1">{transfer.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(transfer.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">New Transfer</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">From Account *</label>
                <select
                  value={formData.fromAccountId}
                  onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountName} ({formatCurrency(account.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">To Account *</label>
                <select
                  value={formData.toAccountId}
                  onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((acc) => acc.id !== formData.fromAccountId)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountName} ({formatCurrency(account.balance)})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="label">Amount *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Enter description (optional)"
                  rows="3"
                />
              </div>

              <div>
                <label className="label">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;
