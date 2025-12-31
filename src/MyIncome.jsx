import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Filter, Wallet, Briefcase, Gift, User } from 'lucide-react';

const MyIncome = () => {
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [incomeType, setIncomeType] = useState('all');

  const incomes = userInfo?.referrals?.referralIncomes || [];

  // FILTER LOGIC
  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const incomeDate = new Date(income?.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && incomeDate < start) return false;
      if (end) {
        const adjustedEnd = new Date(end.setHours(23, 59, 59, 999));
        if (incomeDate > adjustedEnd) return false;
      }

      if (incomeType === 'my' && income?.level !== 0) return false;
      if (incomeType === 'referral' && income?.level === 0) return false;

      return true;
    });
  }, [incomes, startDate, endDate, incomeType]);

  // Totals for the 3 Cards
  const totalIncome = filteredIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  const monthlyEarnings = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return filteredIncomes
      .filter(inc => {
        const d = new Date(inc.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [filteredIncomes]);

  const referralBonus = filteredIncomes
    .filter(inc => inc.level > 0)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Income Analytics</h1>
        <p className="text-gray-500 text-sm">Monthly Earnings</p>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income - Dark Blue */}
        <div className="bg-[#1E74C5] p-6 rounded-xl shadow-md text-white flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg"><Wallet size={28} /></div>
          <div>
            <p className="text-sm font-medium opacity-90">Total Income</p>
            <h2 className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</h2>
          </div>
        </div>

        {/* Monthly Earnings - Light Blue */}
        <div className="bg-[#47A1E5] p-6 rounded-xl shadow-md text-white flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg"><Briefcase size={28} /></div>
          <div>
            <p className="text-sm font-medium opacity-90">Monthly Earnings</p>
            <h2 className="text-2xl font-bold">₹{monthlyEarnings.toLocaleString()}</h2>
          </div>
        </div>

        {/* Referral Bonus - Purple */}
        <div className="bg-[#8E6AD1] p-6 rounded-xl shadow-md text-white flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg"><Gift size={28} /></div>
          <div>
            <p className="text-sm font-medium opacity-90">Referral Bonus</p>
            <h2 className="text-2xl font-bold">₹{referralBonus.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-end gap-6">
         <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Filter size={20} />
         </div>
         
         <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Filters</label>
            <select 
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="my">Direct Income</option>
              <option value="referral">Referral Income</option>
            </select>
         </div>

         <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-600 mb-1">From</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-gray-600 bg-gray-50"
            />
         </div>

         <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-600 mb-1">To</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-gray-600 bg-gray-50"
            />
         </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Ref ID</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Source</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Level</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredIncomes.length > 0 ? (
              filteredIncomes.map((income, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{index + 101}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(income?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {income?.sellerId?.name?.username?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {income?.sellerId?.name?.username || 'SanjayK'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase ${
                      income.level === 0 ? 'bg-green-500' : 'bg-[#8E6AD1]'
                    }`}>
                      {income.level === 0 ? 'Direct' : `Level ${income.level}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    ₹{income?.amount?.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyIncome;