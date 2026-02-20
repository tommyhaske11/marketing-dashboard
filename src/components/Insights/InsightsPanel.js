import React, { useState } from 'react';
import {
    TrendingUp,
    AlertTriangle,
    AlertCircle,
    Info,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Sparkles,
} from 'lucide-react';

const severityConfig = {
    success: {
        icon: TrendingUp,
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        metricColor: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconColor: 'text-amber-600',
        metricColor: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconColor: 'text-red-600',
        metricColor: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconColor: 'text-blue-600',
        metricColor: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
    },
};

const InsightsPanel = ({ insights }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('all');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'success', label: 'Trends' },
        { key: 'warning', label: 'Warnings' },
        { key: 'error', label: 'Alerts' },
        { key: 'info', label: 'Info' },
    ];

    const filtered =
        filter === 'all' ? insights : insights.filter((i) => i.severity === filter);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold font-serif text-gray-900 flex items-center gap-2">
                            Smart Insights
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {insights.length} automated findings
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-5">
                {filters.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Insights list */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {filtered.map((insight) => {
                    const config = severityConfig[insight.severity];
                    const Icon = config.icon;
                    const isExpanded = expandedId === insight.id;

                    return (
                        <div
                            key={insight.id}
                            className={`${config.bg} border ${config.border} rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer`}
                            onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {insight.title}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span
                                                className={`text-sm font-bold ${config.metricColor}`}
                                            >
                                                {insight.metric}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-2 space-y-2 animate-fadeIn">
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                {insight.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                                <span>{insight.timestamp}</span>
                                                {insight.campaign && (
                                                    <>
                                                        <span>·</span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full ${config.badge}`}
                                                        >
                                                            {insight.campaign}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-center py-8">
                        <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No insights in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsPanel;
