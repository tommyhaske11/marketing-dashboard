import React from 'react';
import { Download, BarChart3, Lightbulb } from 'lucide-react';

const Header = ({
    selectedCampaign,
    setSelectedCampaign,
    campaigns,
    dateRange,
    setDateRange,
    handleExport,
    isLoading,
    activeTab,
    setActiveTab
}) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
                            Campaign Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Monitor and optimize your marketing performance</p>
                        <div className="flex gap-1 mt-3 bg-gray-100 rounded-full p-1 w-fit">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'dashboard'
                                        ? 'bg-ps-red text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('insights')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'insights'
                                        ? 'bg-ps-red text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Lightbulb className="w-3.5 h-3.5" />
                                Insights
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ps-red focus:border-transparent w-full sm:w-auto"
                        >
                            <option value="all">All Campaigns</option>
                            {campaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                            ))}
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ps-red focus:border-transparent w-full sm:w-auto"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                        </select>
                        <button
                            onClick={handleExport}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <Download className="w-4 h-4" />
                            <span className="sm:inline">Export Report</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
