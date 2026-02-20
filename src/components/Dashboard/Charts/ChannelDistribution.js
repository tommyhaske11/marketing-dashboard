import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ChannelDistribution = ({ data }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold font-serif text-gray-900 mb-4">Traffic by Channel</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            color: '#1F2937',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
                {data.map((channel, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }}></div>
                            <span className="text-gray-600">{channel.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{channel.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChannelDistribution;
