import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Wallet } from 'lucide-react';
import { accountService } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    balance: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountService.getAll();
      setAccounts(response.data.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        accountName: formData.accountName,
        balance: parseFloat(formData.balance),
      };

      if (selectedAccount) {
        await accountService.update(selectedAccount.id, data);
      } else {
        await accountService.create(data);
      }

      loadAccounts();
      handleClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save account');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;

    try {
      await accountService.delete(id);
      loadAccounts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      accountName: account.accountName,
      balance: account.balance,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    setFormData({
      accountName: '',
      balance: '',
    });
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Accounts</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Account
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Total Balance</h3>
              <p className="text-4xl font-bold text-primary-700">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="p-4 bg-primary-500 rounded-full">
              <Wallet className="text-white" size={32} />
            </div>
          </div>
        </div>

        {/* Accounts List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No accounts found</p>
            <p className="text-gray-400 mt-2">Create your first account to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {account.accountName}
                    </h3>
                    <p className="text-3xl font-bold text-primary-600">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedAccount ? 'Edit Account' : 'Add Account'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Account Name *</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="input"
                  placeholder="e.g., Savings Account"
                  required
                />
              </div>

              <div>
                <label className="label">Balance *</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="input"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {selectedAccount ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
