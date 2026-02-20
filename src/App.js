import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Dashboard/Header';
import MetricsGrid from './components/Dashboard/MetricsGrid';
import PerformanceTrend from './components/Dashboard/Charts/PerformanceTrend';
import ChannelDistribution from './components/Dashboard/Charts/ChannelDistribution';
import DailySpend from './components/Dashboard/Charts/DailySpend';
import ConversionFunnel from './components/Dashboard/Charts/ConversionFunnel';
import CampaignTable from './components/Dashboard/CampaignTable';
import InsightsView from './components/Insights/InsightsView';
import SkeletonLoader from './components/Shared/SkeletonLoader';
import ErrorState from './components/Shared/ErrorState';
import DrillDownModal from './components/Shared/DrillDownModal';
import ChatAgent from './components/Shared/ChatAgent';
import { campaigns, allPerformanceData, channelData, engagementHeatmapData, deviceStats, smartInsights } from './data/mockData';

const MarketingDashboard = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drillDownCampaign, setDrillDownCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter performance data based on date range and selected campaign
  const performanceData = useMemo(() => {
    let data = allPerformanceData[dateRange] || [];
    if (selectedCampaign !== 'all') {
      data = data.filter(d => d.campaign === selectedCampaign);
    }
    return data;
  }, [dateRange, selectedCampaign]);

  // Calculate metrics based on filtered data
  const calculatedMetrics = useMemo(() => {
    const totalConversions = performanceData.reduce((sum, d) => sum + d.conversions, 0);
    const totalSpend = performanceData.reduce((sum, d) => sum + d.spend, 0);
    const totalClicks = performanceData.reduce((sum, d) => sum + d.clicks, 0);
    const totalImpressions = performanceData.reduce((sum, d) => sum + d.impressions, 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const costPerConversion = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : 0;
    const revenue = totalConversions * 128; // Assuming $128 avg order value

    return {
      revenue,
      conversions: totalConversions,
      avgCTR,
      costPerConversion,
      spend: totalSpend
    };
  }, [performanceData]);

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, sortConfig]);

  // Calculate conversion funnel data
  const funnelData = useMemo(() => {
    const totalImpressions = performanceData.reduce((sum, d) => sum + d.impressions, 0);
    const totalClicks = performanceData.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = performanceData.reduce((sum, d) => sum + d.conversions, 0);

    const clickRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const impressionToConversionRate = totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(2) : 0;

    return [
      {
        stage: 'Impressions',
        value: totalImpressions,
        percentage: 100,
        dropOff: 0,
        color: '#E4002B'
      },
      {
        stage: 'Clicks',
        value: totalClicks,
        percentage: parseFloat(clickRate),
        dropOff: 100 - parseFloat(clickRate),
        color: '#1A1A2E'
      },
      {
        stage: 'Conversions',
        value: totalConversions,
        percentage: parseFloat(impressionToConversionRate),
        dropOff: parseFloat(clickRate) - parseFloat(impressionToConversionRate),
        color: '#2ECC71'
      }
    ];
  }, [performanceData]);

  // Export function
  const handleExport = () => {
    const csvContent = [
      ['Campaign', 'Status', 'Budget', 'Spent', 'Conversions', 'CTR', 'ROI'].join(','),
      ...campaigns.map(c =>
        [c.name, c.status, c.budget, c.spent, c.conversions, c.ctr, c.roi].join(',')
      ),
      [],
      ['Performance Data'],
      ['Date', 'Impressions', 'Clicks', 'Conversions', 'Spend'].join(','),
      ...performanceData.map(d =>
        [d.date, d.impressions, d.clicks, d.conversions, d.spend].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-dashboard-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Sort handler
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DrillDownModal
        campaign={drillDownCampaign}
        onClose={() => setDrillDownCampaign(null)}
        performanceData={performanceData}
      />

      <ChatAgent
        campaigns={campaigns}
        calculatedMetrics={calculatedMetrics}
        performanceData={performanceData}
        engagementHeatmapData={engagementHeatmapData}
        deviceStats={deviceStats}
        smartInsights={smartInsights}
        setActiveTab={setActiveTab}
        openDrillDown={setDrillDownCampaign}
        handleExport={handleExport}
      />

      <Header
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        campaigns={campaigns}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleExport={handleExport}
        isLoading={isLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading && <SkeletonLoader />}

        {error && !isLoading && <ErrorState error={error} onRetry={() => window.location.reload()} />}

        {!isLoading && !error && activeTab === 'dashboard' && (
          <>
            <MetricsGrid metrics={calculatedMetrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <PerformanceTrend data={performanceData} />
              <ChannelDistribution data={channelData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <DailySpend data={performanceData} />
              <ConversionFunnel data={funnelData} />
            </div>

            <CampaignTable
              campaigns={filteredAndSortedCampaigns}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSort={handleSort}
              openDrillDown={setDrillDownCampaign}
            />
          </>
        )}

        {!isLoading && !error && activeTab === 'insights' && (
          <InsightsView
            heatmapData={engagementHeatmapData}
            deviceData={deviceStats}
            insights={smartInsights}
          />
        )}
      </main>
    </div>
  );
};

export default MarketingDashboard;
