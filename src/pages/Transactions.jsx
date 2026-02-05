import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Filter, Plus, Download } from 'lucide-react';
import { transactionService } from '../services/api';
import { formatDateTime, formatCurrency, getCategoryIcon } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const { refreshKey, categories } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    division: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [refreshKey]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = new Date(filters.startDate).toISOString();
      if (filters.endDate) params.endDate = new Date(filters.endDate).toISOString();
      if (filters.type) params.type = filters.type;
      if (filters.division) params.division = filters.division;
      if (filters.category) params.category = filters.category;

      const response = await transactionService.getAll(params);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionService.delete(id);
      loadTransactions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleEdit = (transaction) => {
    if (!transaction.isEditable) {
      alert('This transaction can only be edited within 12 hours of creation');
      return;
    }
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    loadTransactions();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      division: '',
      category: '',
    });
    setTimeout(loadTransactions, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Transaction History</h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
            <button
              onClick={() => {
                setSelectedTransaction(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label className="label">Division</label>
                <select
                  name="division"
                  value={filters.division}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="OFFICE">Office</option>
                </select>
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={applyFilters} className="btn-primary">
                Apply Filters
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Transactions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No transactions found</p>
            <p className="text-gray-400 mt-2">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className={`text-4xl ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full`}>
                      {getCategoryIcon(transaction.category)}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                          {transaction.category}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.division === 'OFFICE' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {transaction.division}
                        </span>
                        {!transaction.isEditable && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Read-only
                          </span>
                        )}
                      </div>
                      {transaction.description && (
                        <p className="text-gray-600 mt-1">{transaction.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDateTime(transaction.date)}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(transaction)}
                      disabled={!transaction.isEditable}
                      className={`p-2 rounded-lg transition-colors ${
                        transaction.isEditable
                          ? 'hover:bg-blue-50 text-blue-600'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={transaction.isEditable ? 'Edit' : 'Cannot edit after 12 hours'}
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      disabled={!transaction.isEditable}
                      className={`p-2 rounded-lg transition-colors ${
                        transaction.isEditable
                          ? 'hover:bg-red-50 text-red-600'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={transaction.isEditable ? 'Delete' : 'Cannot delete after 12 hours'}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onSuccess={loadTransactions}
      />
    </div>
  );
};

export default Transactions;
