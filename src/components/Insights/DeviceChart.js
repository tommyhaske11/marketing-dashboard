import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Monitor, Smartphone, Globe } from 'lucide-react';

const tabs = [
    { key: 'devices', label: 'Device', icon: Smartphone },
    { key: 'os', label: 'OS', icon: Monitor },
    { key: 'browser', label: 'Browser', icon: Globe },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg">
                <p className="text-xs font-semibold text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.value}% of traffic</p>
            </div>
        );
    }
    return null;
};

const DeviceChart = ({ data }) => {
    const [activeTab, setActiveTab] = useState('devices');
    const chartData = data[activeTab] || [];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-ps-dark/10 rounded-xl">
                        <Monitor className="w-5 h-5 text-ps-dark" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold font-serif text-gray-900">Device Analytics</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Traffic by platform</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-6">
                {tabs.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${activeTab === key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="flex items-center gap-6">
                <div className="w-48 h-48 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {chartData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeviceChart;
