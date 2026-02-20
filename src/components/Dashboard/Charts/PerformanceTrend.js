import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceTrend = ({ data }) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold font-serif text-gray-900 mb-4">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
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
                    <Legend wrapperStyle={{ color: '#374151' }} />
                    <Line type="monotone" dataKey="conversions" stroke="#E4002B" strokeWidth={3} name="Conversions" dot={{ fill: '#E4002B', r: 4 }} />
                    <Line type="monotone" dataKey="clicks" stroke="#1A1A2E" strokeWidth={3} name="Clicks" dot={{ fill: '#1A1A2E', r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceTrend;
