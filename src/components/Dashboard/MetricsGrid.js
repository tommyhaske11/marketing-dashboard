import React from 'react';
import { TrendingUp, DollarSign, Users, MousePointer, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricsGrid = ({ metrics }) => {
    const metricItems = [
        {
            title: 'Total Revenue',
            value: `$${metrics.revenue.toLocaleString()}`,
            change: '+12.5%',
            isPositive: true,
            icon: DollarSign,
            iconBg: 'bg-ps-red'
        },
        {
            title: 'Conversions',
            value: metrics.conversions.toLocaleString(),
            change: '+8.2%',
            isPositive: true,
            icon: TrendingUp,
            iconBg: 'bg-ps-dark'
        },
        {
            title: 'Avg CTR',
            value: `${metrics.avgCTR}%`,
            change: '+0.4%',
            isPositive: true,
            icon: MousePointer,
            iconBg: 'bg-blue-600'
        },
        {
            title: 'Cost per Conv.',
            value: `$${metrics.costPerConversion}`,
            change: '-5.3%',
            isPositive: true,
            icon: Users,
            iconBg: 'bg-emerald-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricItems.map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-gray-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`${metric.iconBg} p-3 rounded-xl shadow-sm`}>
                            <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${metric.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {metric.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {metric.change}
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{metric.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>
            ))}
        </div>
    );
};

export default MetricsGrid;
