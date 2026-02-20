import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

const DrillDownModal = ({ campaign, onClose, performanceData }) => {
    if (!campaign) return null;

    const campaignPerformance = performanceData.filter(d => d.campaign === campaign.name);
    const totalSpent = campaignPerformance.reduce((sum, d) => sum + d.spend, 0);
    const totalConversions = campaignPerformance.reduce((sum, d) => sum + d.conversions, 0);
    const avgDailySpend = campaignPerformance.length > 0 ? totalSpent / campaignPerformance.length : 0;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white border border-gray-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold font-serif text-gray-900">{campaign.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed Campaign Analytics</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Budget</div>
                            <div className="text-2xl font-bold text-gray-900">${campaign.budget.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Spent</div>
                            <div className="text-2xl font-bold text-gray-900">${campaign.spent.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">ROI</div>
                            <div className="text-2xl font-bold text-emerald-600">{campaign.roi}%</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">CTR</div>
                            <div className="text-2xl font-bold text-gray-900">{campaign.ctr}%</div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold font-serif text-gray-900 mb-4">Performance Over Time</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={campaignPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.7} />
                                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        color: '#1F2937',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="conversions" stroke="#2ECC71" strokeWidth={2} name="Conversions" />
                                <Line type="monotone" dataKey="spend" stroke="#E4002B" strokeWidth={2} name="Spend" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-sm text-gray-500 mb-2">Total Conversions</div>
                            <div className="text-3xl font-bold text-gray-900">{totalConversions}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="text-sm text-gray-500 mb-2">Avg Daily Spend</div>
                            <div className="text-3xl font-bold text-gray-900">${avgDailySpend.toFixed(0)}</div>
                        </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">Budget Utilization</span>
                            <span className="text-sm text-gray-500">{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-ps-red rounded-full transition-all"
                                style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrillDownModal;
