import React from 'react';

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 h-32">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 h-96">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-100 rounded"></div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-96">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-100 rounded"></div>
            </div>
        </div>
    </div>
);

export default SkeletonLoader;
