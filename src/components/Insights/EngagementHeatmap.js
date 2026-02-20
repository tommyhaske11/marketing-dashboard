import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const getHourLabel = (h) =>
    h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`;

const getColor = (value) => {
    if (value <= 10) return 'bg-red-50';
    if (value <= 25) return 'bg-red-100';
    if (value <= 40) return 'bg-red-200';
    if (value <= 55) return 'bg-red-300';
    if (value <= 70) return 'bg-red-400';
    return 'bg-red-500';
};



const EngagementHeatmap = ({ data }) => {
    const [tooltip, setTooltip] = useState(null);

    const lookup = {};
    data.forEach((d) => {
        lookup[`${d.dayIndex}-${d.hour}`] = d;
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-ps-red/10 rounded-xl">
                    <Clock className="w-5 h-5 text-ps-red" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold font-serif text-gray-900">Engagement Heatmap</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Activity intensity by day &amp; hour</p>
                </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
                <div className="min-w-[640px]">
                    {/* Hour Labels */}
                    <div className="flex ml-12 mb-1">
                        {hours.map((h) => (
                            <div
                                key={h}
                                className="flex-1 text-center text-[10px] text-gray-400 select-none"
                            >
                                {h % 3 === 0 ? getHourLabel(h) : ''}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    {days.map((day, di) => (
                        <div key={day} className="flex items-center mb-1">
                            <div className="w-12 text-xs font-medium text-gray-500 text-right pr-3 select-none">
                                {day}
                            </div>
                            <div className="flex flex-1 gap-[2px]">
                                {hours.map((h) => {
                                    const cell = lookup[`${di}-${h}`];
                                    const val = cell ? cell.value : 0;
                                    return (
                                        <div
                                            key={h}
                                            className={`flex-1 aspect-square rounded-sm cursor-pointer transition-all duration-150 ${getColor(val)} hover:scale-125 hover:z-10 hover:shadow-md relative`}
                                            onMouseEnter={() => setTooltip({ day, hour: h, value: val })}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            {tooltip && tooltip.day === day && tooltip.hour === h && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 whitespace-nowrap pointer-events-none">
                                                    <p className="text-xs font-semibold text-gray-900">
                                                        {day} · {getHourLabel(h)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Engagement: <span className="text-gray-900 font-medium">{val}%</span>
                                                    </p>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <span className="text-[10px] text-gray-400">Low</span>
                        <div className="flex gap-[2px]">
                            {['bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500'].map(
                                (cls, i) => (
                                    <div key={i} className={`w-4 h-3 rounded-sm ${cls}`} />
                                )
                            )}
                        </div>
                        <span className="text-[10px] text-gray-400">High</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EngagementHeatmap;
