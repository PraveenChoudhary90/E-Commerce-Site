import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Wallet, Briefcase, Gift } from 'lucide-react';
import { getIncomeOrdersByAdmin } from './api/auth-api';
import PageLoader from './components/ui/PageLoader';


const MyIncome = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [incomeType, setIncomeType] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH ALL INCOME (ADMIN)
  const fetchIncomeOrders = async () => {
    try {
      setLoading(true);
      const data = await getIncomeOrdersByAdmin();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeOrders();
  }, []);

  // FILTER LOGIC
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && orderDate < start) return false;
      if (end) {
        const adjustedEnd = new Date(end);
        adjustedEnd.setHours(23, 59, 59, 999);
        if (orderDate > adjustedEnd) return false;
      }

      if (incomeType !== 'all' && order.incomeType !== incomeType) return false;

      return true;
    });
  }, [orders, startDate, endDate, incomeType]);

  // SUMMARY CALCULATIONS
  const totalIncome = filteredOrders.reduce((a, b) => a + (b.income || 0), 0);

  const monthlyEarnings = filteredOrders
    .filter(o => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((a, b) => a + (b.income || 0), 0);

  const referralBonus = filteredOrders
    .filter(o => o.level)
    .reduce((a, b) => a + (b.income || 0), 0);


 if (loading) {
    return <PageLoader />;
  }


    

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#F8F9FA] min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Income Analytics</h1>
        <p className="text-gray-500 text-sm">Admin – All Income Records</p>
      </div>

     {/* SUMMARY CARDS */}
{/* grid-cols-1: Mobile pe ek ke niche ek
  md:grid-cols-2: 768px (Tablet) pe do cards upar
  lg:grid-cols-3: 1024px+ pe teeno ek line mein
*/}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <SummaryCard title="Total Income" value={totalIncome.toFixed(2)} icon={<Wallet />} color="bg-[#1E74C5]" />
  <SummaryCard title="Monthly Earnings" value={monthlyEarnings.toFixed(2)} icon={<Briefcase />} color="bg-[#47A1E5]" />
  
  {/* Ye div 768px pe full width le lega (2 columns), lekin 1024px pe normal 1 column ho jayega */}
  <div className="md:col-span-2 lg:col-span-1">
    <SummaryCard title="Level Income" value={referralBonus.toFixed(2)} icon={<Gift />} color="bg-[#8E6AD1]" />
  </div>
</div>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-end gap-6">
        <Filter size={20} className="text-gray-400" />

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Income Type</label>
          <select
            value={incomeType}
            onChange={e => setIncomeType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-gray-600 bg-gray-50"
          >
            <option value="all">All</option>
            <option value="monthly_return">Monthly Return</option>
            <option value="loyalty_bonus">Loyalty Bonus</option>
            <option value="level">Level Income</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[1600px] w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-600">Index</th>
                <th className="px-6 py-4 font-bold text-gray-600">Ref ID</th>
                <th className="px-6 py-4 font-bold text-gray-600">Vendor</th>
                <th className="px-6 py-4 font-bold text-gray-600">From Vendor</th>
                <th className="px-6 py-4 font-bold text-gray-600">Type</th>
                <th className="px-6 py-4 font-bold text-gray-600">Description</th>
                <th className="px-6 py-4 font-bold text-gray-600">Level</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-right">% Total</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-right">Income</th>
                <th className="px-6 py-4 font-bold text-gray-600">Date & Time</th>
                <th className="px-6 py-4 font-bold text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {order.referenceId}
                    </td>

                    {/* ✅ VENDOR: NAME + EMAIL */}
                    <td className="px-6 py-3">
                      {order.userId ? (
                        <>
                          <div className="font-medium">
                            {order.userId.firstName} {order.userId.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.userId.email}
                          </div>
                        </>
                      ) : '—'}
                    </td>

                    {/* ✅ FROM VENDOR: NAME + EMAIL */}
                    <td className="px-6 py-3">
                      {order.fromUserId ? (
                        <>
                          <div className="font-medium">
                            {order.fromUserId.firstName} {order.fromUserId.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.fromUserId.email}
                          </div>
                        </>
                      ) : '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {order.incomeType}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.description}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.level ? `Level ${order.level}` : '—'}
                    </td>

                    <td className="px-6 py-4 text-right text-gray-700 font-medium">
                      {order.percentage ?? '—'}%
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ₹{(order.amount || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      ₹{(order.income || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        order.status === 'credited'
                          ? 'bg-green-500'
                          : order.status === 'pending'
                          ? 'bg-yellow-500'
                          : order.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="px-6 py-10 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};



{/* Updated SummaryCard Component */}
const SummaryCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-xl text-white flex items-center gap-4 shadow-sm`}>
    <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0 text-left">
      <p className="text-sm opacity-90 font-medium truncate">{title}</p>
      <h2 className="text-2xl font-bold">₹{value}</h2>
    </div>
  </div>
);

export default MyIncome;
