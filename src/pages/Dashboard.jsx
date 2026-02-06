import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import TransactionModal from '../components/TransactionModal';

const Dashboard = () => {
  const { refreshKey } = useApp();
  const [period, setPeriod] = useState('MONTHLY');
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [divisionSummary, setDivisionSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadDashboardData();
  }, [period, selectedDate, refreshKey]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const year = new Date(selectedDate).getFullYear();

      // OPTIMIZED: Make all API calls in parallel using Promise.all
      const [summaryRes, chartRes, categoryRes, divisionRes] = await Promise.all([
        dashboardService.getSummary({ period, date: selectedDate }),
        dashboardService.getChartData({ period, year }),
        dashboardService.getCategorySummary({ type: 'EXPENSE' }),
        dashboardService.getDivisionSummary({})
      ]);

      // Set all states at once
      setSummary(summaryRes.data.data);
      setChartData(chartRes.data.data);
      setCategorySummary(categoryRes.data.data);
      setDivisionSummary(divisionRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set fallback data to prevent UI breaking
      setSummary({ totalIncome: 0, totalExpense: 0, balance: 0, periodLabel: '' });
      setChartData({ labels: [], income: [], expense: [] });
      setCategorySummary([]);
      setDivisionSummary({ divisions: {} });
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!chartData) return [];
    return chartData.labels.map((label, index) => ({
      name: label,
      Income: chartData.income[index] || 0,
      Expense: chartData.expense[index] || 0,
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  // Loading skeleton component
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="h-10 bg-gray-200 rounded w-48 mb-4 md:mb-0 animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center py-12">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={loadDashboardData} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input py-2"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            {/* Date Selector */}
            <input
              type="month"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input py-2"
            />

            {/* Add Transaction Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(summary.totalIncome)}</p>
              <p className="text-sm text-green-600 mt-2">{summary.periodLabel}</p>
            </div>

            {/* Expense Card */}
            <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-800">Total Expense</h3>
                <div className="p-3 bg-red-500 rounded-full">
                  <TrendingDown className="text-white" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-700">{formatCurrency(summary.totalExpense)}</p>
              <p className="text-sm text-red-600 mt-2">{summary.periodLabel}</p>
            </div>

            {/* Balance Card */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Balance</h3>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Wallet className="text-white" size={24} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {formatCurrency(summary.balance)}
              </p>
              <p className="text-sm text-blue-600 mt-2">{summary.periodLabel}</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Income vs Expense Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" />
                <Bar dataKey="Expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Category Summary */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Expense by Category</h3>
            {categorySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySummary}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category} (${entry.percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categorySummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Division Summary */}
        {divisionSummary && Object.keys(divisionSummary.divisions).length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Division Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(divisionSummary.divisions).map(([division, data]) => (
                <div key={division} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">{division}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Income:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(data.income)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expense:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(data.expense)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-semibold text-gray-700">Balance:</span>
                      <span className={`font-bold ${data.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(data.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};

export default Dashboard;