import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                <AlertTriangle className="w-8 h-8 text-ps-red" />
            </div>
            <h3 className="text-xl font-semibold font-serif text-gray-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all"
            >
                Retry
            </button>
        </div>
    </div>
);

export default ErrorState;
