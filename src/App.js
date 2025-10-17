import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, MousePointer, ArrowUpRight, ArrowDownRight, Search, AlertTriangle, Download, TrendingDown, X, ChevronRight, MessageCircle, Send, Sparkles } from 'lucide-react';

// Static campaign data
const campaigns = [
  { id: 1, name: 'Summer Sale 2025', status: 'active', budget: 15000, spent: 12450, conversions: 342, ctr: 3.8, roi: 285 },
  { id: 2, name: 'Product Launch', status: 'active', budget: 25000, spent: 18900, conversions: 521, ctr: 4.2, roi: 312 },
  { id: 3, name: 'Brand Awareness', status: 'paused', budget: 10000, spent: 8200, conversions: 156, ctr: 2.9, roi: 198 },
  { id: 4, name: 'Holiday Special', status: 'active', budget: 20000, spent: 16780, conversions: 438, ctr: 3.5, roi: 267 }
];

// Extended performance data for different date ranges
const allPerformanceData = {
    '7days': [
      { date: 'Oct 8', impressions: 45000, clicks: 1580, conversions: 125, spend: 2100, campaign: 'Summer Sale 2025' },
      { date: 'Oct 9', impressions: 52000, clicks: 1820, conversions: 142, spend: 2350, campaign: 'Product Launch' },
      { date: 'Oct 10', impressions: 48000, clicks: 1680, conversions: 138, spend: 2200, campaign: 'Summer Sale 2025' },
      { date: 'Oct 11', impressions: 61000, clicks: 2140, conversions: 168, spend: 2680, campaign: 'Holiday Special' },
      { date: 'Oct 12', impressions: 58000, clicks: 2030, conversions: 159, spend: 2520, campaign: 'Product Launch' },
      { date: 'Oct 13', impressions: 64000, clicks: 2240, conversions: 185, spend: 2850, campaign: 'Summer Sale 2025' },
      { date: 'Oct 14', impressions: 70000, clicks: 2450, conversions: 201, spend: 3080, campaign: 'Holiday Special' }
    ],
    '30days': [
      { date: 'Sep 15', impressions: 38000, clicks: 1200, conversions: 95, spend: 1800, campaign: 'Brand Awareness' },
      { date: 'Sep 22', impressions: 42000, clicks: 1450, conversions: 110, spend: 1950, campaign: 'Summer Sale 2025' },
      { date: 'Sep 29', impressions: 48000, clicks: 1680, conversions: 130, spend: 2200, campaign: 'Product Launch' },
      { date: 'Oct 6', impressions: 51000, clicks: 1790, conversions: 140, spend: 2400, campaign: 'Holiday Special' },
      { date: 'Oct 13', impressions: 64000, clicks: 2240, conversions: 185, spend: 2850, campaign: 'Summer Sale 2025' }
    ],
    '90days': [
      { date: 'Jul 20', impressions: 28000, clicks: 890, conversions: 68, spend: 1400, campaign: 'Brand Awareness' },
      { date: 'Aug 10', impressions: 35000, clicks: 1120, conversions: 85, spend: 1650, campaign: 'Summer Sale 2025' },
      { date: 'Aug 30', impressions: 41000, clicks: 1380, conversions: 105, spend: 1900, campaign: 'Product Launch' },
      { date: 'Sep 20', impressions: 47000, clicks: 1640, conversions: 128, spend: 2150, campaign: 'Holiday Special' },
      { date: 'Oct 10', impressions: 64000, clicks: 2240, conversions: 185, spend: 2850, campaign: 'Summer Sale 2025' }
    ]
  };

const MarketingDashboard = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drillDownCampaign, setDrillDownCampaign] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Campaign Performance Assistant. I can help you analyze your campaigns, answer questions about metrics, and provide insights. What would you like to know?'
    }
  ]);
  const [userInput, setUserInput] = useState('');

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

  const channelData = [
    { name: 'Google Ads', value: 42, color: '#A855F7' },
    { name: 'Facebook', value: 28, color: '#EC4899' },
    { name: 'Instagram', value: 18, color: '#F59E0B' },
    { name: 'LinkedIn', value: 12, color: '#3B82F6' }
  ];

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
        color: '#A855F7'
      },
      {
        stage: 'Clicks',
        value: totalClicks,
        percentage: parseFloat(clickRate),
        dropOff: 100 - parseFloat(clickRate),
        color: '#EC4899'
      },
      {
        stage: 'Conversions',
        value: totalConversions,
        percentage: parseFloat(impressionToConversionRate),
        dropOff: parseFloat(clickRate) - parseFloat(impressionToConversionRate),
        color: '#10B981'
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

  // AI Chat Agent - Analyzes campaign data and answers questions
  const analyzeCampaignData = (question) => {
    const lowerQ = question.toLowerCase();

    // Calculate key metrics
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;
    const bestCampaign = campaigns.reduce((best, c) => c.roi > best.roi ? c : best);
    const worstCampaign = campaigns.reduce((worst, c) => c.roi < worst.roi ? c : worst);
    const overBudgetCampaigns = campaigns.filter(c => (c.spent / c.budget) >= 0.85);

    // Question matching and responses
    if (lowerQ.includes('best') || lowerQ.includes('top') || lowerQ.includes('highest')) {
      return `The best performing campaign is **${bestCampaign.name}** with an ROI of ${bestCampaign.roi}% and ${bestCampaign.conversions} conversions. It has a CTR of ${bestCampaign.ctr}% and has spent $${bestCampaign.spent.toLocaleString()} of its $${bestCampaign.budget.toLocaleString()} budget.`;
    }

    if (lowerQ.includes('worst') || lowerQ.includes('lowest') || lowerQ.includes('underperforming')) {
      return `The campaign with the lowest ROI is **${worstCampaign.name}** at ${worstCampaign.roi}%. Consider reviewing its targeting, creative, or budget allocation. It has ${worstCampaign.conversions} conversions with a ${worstCampaign.ctr}% CTR.`;
    }

    if (lowerQ.includes('budget') || lowerQ.includes('spending') || lowerQ.includes('spent')) {
      const utilizationRate = ((totalSpent / totalBudget) * 100).toFixed(1);
      let response = `Overall budget utilization is at ${utilizationRate}%. You've spent $${totalSpent.toLocaleString()} out of a total budget of $${totalBudget.toLocaleString()}.`;
      if (overBudgetCampaigns.length > 0) {
        response += ` **Alert**: ${overBudgetCampaigns.length} campaign(s) are nearing or over budget: ${overBudgetCampaigns.map(c => c.name).join(', ')}.`;
      }
      return response;
    }

    if (lowerQ.includes('conversion') || lowerQ.includes('converting')) {
      const avgConversions = (totalConversions / campaigns.length).toFixed(0);
      return `You have ${totalConversions} total conversions across all campaigns, averaging ${avgConversions} per campaign. **${bestCampaign.name}** leads with ${bestCampaign.conversions} conversions. Your average cost per conversion across the selected date range is $${calculatedMetrics.costPerConversion}.`;
    }

    if (lowerQ.includes('roi') || lowerQ.includes('return')) {
      return `Your average ROI across all campaigns is ${avgROI.toFixed(1)}%. **${bestCampaign.name}** has the highest ROI at ${bestCampaign.roi}%, while **${worstCampaign.name}** is at ${worstCampaign.roi}%. This suggests focusing more budget on ${bestCampaign.name} for better returns.`;
    }

    if (lowerQ.includes('ctr') || lowerQ.includes('click')) {
      const avgCTR = (campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length).toFixed(2);
      const bestCTR = campaigns.reduce((best, c) => c.ctr > best.ctr ? c : best);
      return `Your average CTR is ${avgCTR}%. **${bestCTR.name}** has the best CTR at ${bestCTR.ctr}%, which is ${(bestCTR.ctr - avgCTR).toFixed(2)}% above average. Consider analyzing its ad creative and targeting for insights to apply to other campaigns.`;
    }

    if (lowerQ.includes('recommend') || lowerQ.includes('suggest') || lowerQ.includes('advice') || lowerQ.includes('improve')) {
      let recommendations = `Based on your campaign data, here are my recommendations:\n\n`;
      recommendations += `1. **Increase budget** for ${bestCampaign.name} (ROI: ${bestCampaign.roi}%) - it's your best performer\n`;
      recommendations += `2. **Optimize or pause** ${worstCampaign.name} (ROI: ${worstCampaign.roi}%) to reduce wasted spend\n`;
      if (overBudgetCampaigns.length > 0) {
        recommendations += `3. **Review budget allocation** - ${overBudgetCampaigns.length} campaign(s) are at 85%+ budget usage\n`;
      }
      recommendations += `4. **A/B test** the creative and targeting from ${bestCampaign.name} in underperforming campaigns`;
      return recommendations;
    }

    if (lowerQ.includes('summary') || lowerQ.includes('overview') || lowerQ.includes('status')) {
      return `**Campaign Overview:**\n\n` +
        `📊 **Total Campaigns**: ${campaigns.length} (${campaigns.filter(c => c.status === 'active').length} active)\n` +
        `💰 **Total Budget**: $${totalBudget.toLocaleString()}\n` +
        `📈 **Total Spent**: $${totalSpent.toLocaleString()} (${((totalSpent/totalBudget)*100).toFixed(1)}%)\n` +
        `🎯 **Total Conversions**: ${totalConversions}\n` +
        `📊 **Average ROI**: ${avgROI.toFixed(1)}%\n` +
        `🏆 **Top Performer**: ${bestCampaign.name}\n` +
        `⚠️ **Needs Attention**: ${worstCampaign.name}`;
    }

    // Default response with suggestions
    return `I can help you with:\n\n` +
      `• **"Which campaign is performing best?"**\n` +
      `• **"How is my budget utilization?"**\n` +
      `• **"What's my average ROI?"**\n` +
      `• **"Show me conversion stats"**\n` +
      `• **"Give me recommendations"**\n` +
      `• **"Campaign summary"**\n\n` +
      `Just ask me anything about your campaign performance!`;
  };

  // Handle chat message submission
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = { role: 'assistant', content: analyzeCampaignData(userInput) };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 500);

    setUserInput('');
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${calculatedMetrics.revenue.toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Conversions',
      value: calculatedMetrics.conversions.toLocaleString(),
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-pink-500 to-pink-700'
    },
    {
      title: 'Avg CTR',
      value: `${calculatedMetrics.avgCTR}%`,
      change: '+0.4%',
      isPositive: true,
      icon: MousePointer,
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Cost per Conv.',
      value: `$${calculatedMetrics.costPerConversion}`,
      change: '-5.3%',
      isPositive: true,
      icon: Users,
      gradient: 'from-amber-500 to-amber-700'
    }
  ];

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-32">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-96">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-700/50 rounded"></div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-96">
          <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Dashboard</h3>
        <p className="text-purple-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Chat Agent Component
  const ChatAgent = () => {
    if (!isChatOpen) {
      return (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>
      );
    }

    return (
      <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-semibold text-white">Campaign Assistant</h3>
              <p className="text-xs text-purple-100">AI-Powered Analytics</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800 text-purple-100 border border-purple-500/20'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content.split('**').map((part, i) =>
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <strong key={i} className="font-semibold text-white">
                        {part}
                      </strong>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 py-2 border-t border-purple-500/20 flex gap-2 overflow-x-auto">
          {['Best campaign?', 'ROI summary', 'Recommendations'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setUserInput(suggestion);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="px-3 py-1 bg-slate-800 text-purple-300 text-xs rounded-full hover:bg-purple-600 hover:text-white transition-colors whitespace-nowrap border border-purple-500/30"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your campaigns..."
              className="flex-1 px-4 py-2 bg-slate-800 border border-purple-500/30 text-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Campaign drill-down modal
  const DrillDownModal = ({ campaign }) => {
    if (!campaign) return null;

    const campaignPerformance = performanceData.filter(d => d.campaign === campaign.name);
    const totalSpent = campaignPerformance.reduce((sum, d) => sum + d.spend, 0);
    const totalConversions = campaignPerformance.reduce((sum, d) => sum + d.conversions, 0);
    const avgDailySpend = campaignPerformance.length > 0 ? totalSpent / campaignPerformance.length : 0;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
              <p className="text-sm text-purple-300 mt-1">Detailed Campaign Analytics</p>
            </div>
            <button
              onClick={() => setDrillDownCampaign(null)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-purple-300" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/10">
                <div className="text-xs text-purple-300 mb-1">Budget</div>
                <div className="text-2xl font-bold text-white">${campaign.budget.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/10">
                <div className="text-xs text-purple-300 mb-1">Spent</div>
                <div className="text-2xl font-bold text-white">${campaign.spent.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/10">
                <div className="text-xs text-purple-300 mb-1">ROI</div>
                <div className="text-2xl font-bold text-green-400">{campaign.roi}%</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/10">
                <div className="text-xs text-purple-300 mb-1">CTR</div>
                <div className="text-2xl font-bold text-white">{campaign.ctr}%</div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#a78bfa" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a78bfa" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" />
                  <Line type="monotone" dataKey="spend" stroke="#F59E0B" strokeWidth={2} name="Spend" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-xl p-4 border border-purple-500/10">
                <div className="text-sm text-purple-300 mb-2">Total Conversions</div>
                <div className="text-3xl font-bold text-white">{totalConversions}</div>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-purple-500/10">
                <div className="text-sm text-purple-300 mb-2">Avg Daily Spend</div>
                <div className="text-3xl font-bold text-white">${avgDailySpend.toFixed(0)}</div>
              </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Budget Utilization</span>
                <span className="text-sm text-purple-300">{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Drill-down Modal */}
      <DrillDownModal campaign={drillDownCampaign} />

      {/* AI Chat Agent */}
      <ChatAgent />

      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Campaign Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 sm:mt-2">Monitor and optimize your marketing performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-purple-500/30 text-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                ))}
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-purple-500/30 text-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span className="sm:inline">Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Error State */}
        {error && !isLoading && <ErrorState />}

        {/* Main Content */}
        {!isLoading && !error && (
          <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${metric.gradient} p-3 rounded-lg shadow-lg`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-purple-300 text-sm font-medium mb-1">{metric.title}</h3>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Trend */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis dataKey="date" stroke="#a78bfa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a78bfa" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #a855f7',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="conversions" stroke="#a855f7" strokeWidth={3} name="Conversions" dot={{ fill: '#a855f7', r: 4 }} />
                <Line type="monotone" dataKey="clicks" stroke="#ec4899" strokeWidth={3} name="Clicks" dot={{ fill: '#ec4899', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Traffic by Channel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #a855f7',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {channelData.map((channel, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: channel.color }}></div>
                    <span className="text-purple-200">{channel.name}</span>
                  </div>
                  <span className="font-semibold text-white">{channel.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spend Trend and Conversion Funnel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spend Trend Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Daily Spend Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis dataKey="date" stroke="#a78bfa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a78bfa" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #a855f7',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="spend" fill="#F59E0B" name="Daily Spend" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Conversion Funnel</h2>
            <div className="space-y-4 mt-8">
              {funnelData.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <span className="text-sm font-semibold text-white">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-purple-200">{stage.value.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-purple-300">
                        {stage.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-12 bg-slate-700/30 rounded-lg overflow-hidden">
                      <div
                        className="h-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-500"
                        style={{
                          width: `${stage.percentage}%`,
                          backgroundColor: stage.color
                        }}
                      >
                        {stage.percentage > 15 && stage.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {idx < funnelData.length - 1 && stage.dropOff > 0 && (
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">
                        {stage.dropOff.toFixed(2)}% drop-off
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-purple-500/10">
              <div className="text-sm text-purple-200">
                <span className="font-semibold text-white">Overall Conversion Rate: </span>
                {funnelData[2]?.percentage.toFixed(2)}% (Impressions → Conversions)
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Active Campaigns</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-900/50 border border-purple-500/30 text-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400/50"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Campaign {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('budget')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Budget {sortConfig.key === 'budget' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('spent')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Spent {sortConfig.key === 'spent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('conversions')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Conversions {sortConfig.key === 'conversions' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('ctr')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    CTR {sortConfig.key === 'ctr' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('roi')}
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    ROI {sortConfig.key === 'roi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredAndSortedCampaigns.map((campaign) => {
                  const budgetUtilization = (campaign.spent / campaign.budget) * 100;
                  const isNearBudget = budgetUtilization >= 85;
                  const isOverBudget = budgetUtilization >= 100;

                  return (
                    <tr
                      key={campaign.id}
                      onClick={() => setDrillDownCampaign(campaign)}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{campaign.name}</div>
                          <ChevronRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {isNearBudget && (
                            <AlertTriangle className={`w-4 h-4 ${isOverBudget ? 'text-red-400' : 'text-amber-400'}`} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">${campaign.budget.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm text-purple-200">${campaign.spent.toLocaleString()}</div>
                          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                isOverBudget ? 'bg-red-500' : isNearBudget ? 'bg-amber-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">{campaign.conversions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">{campaign.ctr}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">{campaign.roi}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default MarketingDashboard;
