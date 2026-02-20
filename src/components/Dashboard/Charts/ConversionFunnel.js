import React from 'react';
import { TrendingDown } from 'lucide-react';

const ConversionFunnel = ({ data }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold font-serif text-gray-900 mb-4">Conversion Funnel</h2>
            <div className="space-y-4 mt-8">
                {data.map((stage, idx) => (
                    <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: stage.color }}
                                ></div>
                                <span className="text-sm font-semibold text-gray-900">{stage.stage}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">{stage.value.toLocaleString()}</span>
                                <span className="text-xs font-semibold text-gray-500">
                                    {stage.percentage.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-full h-12 bg-gray-100 rounded-xl overflow-hidden">
                                <div
                                    className="h-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-500 rounded-xl"
                                    style={{
                                        width: `${stage.percentage}%`,
                                        backgroundColor: stage.color
                                    }}
                                >
                                    {stage.percentage > 15 && stage.value.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        {idx < data.length - 1 && stage.dropOff > 0 && (
                            <div className="flex items-center gap-2 mt-2 ml-6">
                                <TrendingDown className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-red-500">
                                    {stage.dropOff.toFixed(2)}% drop-off
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Overall Conversion Rate: </span>
                    {data[2]?.percentage.toFixed(2)}% (Impressions → Conversions)
                </div>
            </div>
        </div>
    );
};

export default ConversionFunnel;
