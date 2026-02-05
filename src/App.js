import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, MousePointer, ArrowUpRight, ArrowDownRight, Search, AlertTriangle, Download, TrendingDown, X, ChevronRight, MessageCircle, Send, Sparkles } from 'lucide-react';

// Static campaign data with audience insights
const campaigns = [
  {
    id: 1,
    name: 'Summer Sale 2025',
    status: 'active',
    budget: 15000,
    spent: 12450,
    conversions: 342,
    ctr: 3.8,
    roi: 285,
    topAudiences: [
      { segment: 'Women 25-34', performance: 95, conversionRate: 4.2 },
      { segment: 'Tech Enthusiasts', performance: 88, conversionRate: 3.8 },
      { segment: 'Urban Professionals', performance: 82, conversionRate: 3.5 }
    ],
    predictedMetrics: {
      endOfMonthConversions: 445,
      predictedROI: 295,
      projectedSpend: 15000,
      confidence: 92
    }
  },
  {
    id: 2,
    name: 'Product Launch',
    status: 'active',
    budget: 25000,
    spent: 18900,
    conversions: 521,
    ctr: 4.2,
    roi: 312,
    topAudiences: [
      { segment: 'Men 30-44', performance: 93, conversionRate: 5.1 },
      { segment: 'Early Adopters', performance: 91, conversionRate: 4.9 },
      { segment: 'High Income', performance: 85, conversionRate: 4.3 }
    ],
    predictedMetrics: {
      endOfMonthConversions: 680,
      predictedROI: 325,
      projectedSpend: 25000,
      confidence: 95
    }
  },
  {
    id: 3,
    name: 'Brand Awareness',
    status: 'paused',
    budget: 10000,
    spent: 8200,
    conversions: 156,
    ctr: 2.9,
    roi: 198,
    topAudiences: [
      { segment: 'All Ages', performance: 68, conversionRate: 2.1 },
      { segment: 'Millennials', performance: 72, conversionRate: 2.4 },
      { segment: 'Gen Z', performance: 65, conversionRate: 1.9 }
    ],
    predictedMetrics: {
      endOfMonthConversions: 180,
      predictedROI: 205,
      projectedSpend: 9500,
      confidence: 78
    }
  },
  {
    id: 4,
    name: 'Holiday Special',
    status: 'active',
    budget: 20000,
    spent: 16780,
    conversions: 438,
    ctr: 3.5,
    roi: 267,
    topAudiences: [
      { segment: 'Families', performance: 89, conversionRate: 3.9 },
      { segment: 'Women 35-54', performance: 86, conversionRate: 3.7 },
      { segment: 'Gift Shoppers', performance: 91, conversionRate: 4.1 }
    ],
    predictedMetrics: {
      endOfMonthConversions: 550,
      predictedROI: 275,
      projectedSpend: 20000,
      confidence: 88
    }
  }
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
  const [showScenarioPlanner, setShowScenarioPlanner] = useState(false);
  const [isAgentThinking, setIsAgentThinking] = useState(false);

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

  const campaignStats = useMemo(() => {
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const avgROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;
    const activeCount = campaigns.filter(c => c.status === 'active').length;
    const pausedCount = campaigns.length - activeCount;
    const overBudgetCount = campaigns.filter(c => (c.spent / c.budget) >= 0.85).length;
    const bestCampaign = campaigns.reduce((best, c) => c.roi > best.roi ? c : best);
    const worstCampaign = campaigns.reduce((worst, c) => c.roi < worst.roi ? c : worst);

    return {
      totalBudget,
      totalSpent,
      avgROI,
      activeCount,
      pausedCount,
      overBudgetCount,
      bestCampaign,
      worstCampaign
    };
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

  const getSortAria = (key) => {
    if (sortConfig.key !== key) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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

  // Agentic Task Execution Functions
  const executeAgenticTask = (taskName) => {
    setIsAgentThinking(true);

    // Add user's task request
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: `Run task: ${taskName}`
    }]);

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      let response = '';

      switch(taskName) {
        case 'Budget Optimizer':
          response = generateBudgetOptimizationReport();
          break;
        case 'Performance Analysis':
          response = generatePerformanceAnalysis();
          break;
        case 'ROI Maximization':
          response = generateROIMaximizationReport();
          break;
        case 'Audience Insights':
          response = generateAudienceInsightsReport();
          break;
        case 'Weekly Report':
          response = generateWeeklyReport();
          break;
        case 'Funnel Optimization':
          response = generateFunnelOptimizationReport();
          break;
        default:
          response = 'Task not found.';
      }

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      setIsAgentThinking(false);
    }, 2000); // 2 second delay to simulate AI processing
  };

  // Task 1: Budget Reallocation Optimizer
  const generateBudgetOptimizationReport = () => {
    const sortedByROI = [...campaigns].sort((a, b) => b.roi - a.roi);
    const topPerformer = sortedByROI[0];
    const bottomPerformer = sortedByROI[sortedByROI.length - 1];

    const suggestedReallocation = Math.min(bottomPerformer.budget * 0.3, 5000);
    const projectedAdditionalConversions = Math.round((suggestedReallocation / topPerformer.spent) * topPerformer.conversions * 0.8);
    const projectedROIIncrease = ((topPerformer.roi + bottomPerformer.roi) / 2 * 1.15).toFixed(1);

    return `## 🎯 Budget Reallocation Strategy\n\n` +
      `**Analysis Complete** - I've identified a high-impact optimization opportunity:\n\n` +
      `### Current Situation\n` +
      `• **${bottomPerformer.name}** (ROI: ${bottomPerformer.roi}%) is underperforming\n` +
      `• **${topPerformer.name}** (ROI: ${topPerformer.roi}%) is your top performer\n` +
      `• Efficiency gap: **${(topPerformer.roi - bottomPerformer.roi).toFixed(1)}%**\n\n` +
      `### Recommended Action\n` +
      `**Reallocate $${suggestedReallocation.toLocaleString()}** from ${bottomPerformer.name} → ${topPerformer.name}\n\n` +
      `### Projected Impact\n` +
      `• **+${projectedAdditionalConversions} conversions** (estimated)\n` +
      `• **${projectedROIIncrease}% average ROI** (up from ${((topPerformer.roi + bottomPerformer.roi) / 2).toFixed(1)}%)\n` +
      `• **$${(projectedAdditionalConversions * 128).toLocaleString()} additional revenue**\n\n` +
      `### Implementation Plan\n` +
      `1. Reduce ${bottomPerformer.name} budget to $${(bottomPerformer.budget - suggestedReallocation).toLocaleString()}\n` +
      `2. Increase ${topPerformer.name} budget to $${(topPerformer.budget + suggestedReallocation).toLocaleString()}\n` +
      `3. Monitor performance for 7 days\n` +
      `4. Adjust based on results\n\n` +
      `**Confidence Level:** 87% - Based on current performance trends`;
  };

  // Task 2: Underperforming Campaign Deep Dive
  const generatePerformanceAnalysis = () => {
    const sortedByROI = [...campaigns].sort((a, b) => a.roi - b.roi);
    const underperformer = sortedByROI[0];
    const avgROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;
    const avgCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length;

    return `## ⚠️ Underperforming Campaign Analysis\n\n` +
      `**Campaign:** ${underperformer.name}\n\n` +
      `### Performance Metrics\n` +
      `• **ROI:** ${underperformer.roi}% (${(avgROI - underperformer.roi).toFixed(1)}% below average)\n` +
      `• **CTR:** ${underperformer.ctr}% (${(avgCTR - underperformer.ctr).toFixed(1)}% below average)\n` +
      `• **Conversions:** ${underperformer.conversions} (${((underperformer.conversions / campaigns.reduce((sum, c) => sum + c.conversions, 0)) * 100).toFixed(1)}% of total)\n` +
      `• **Budget Used:** ${((underperformer.spent / underperformer.budget) * 100).toFixed(1)}%\n\n` +
      `### Root Cause Analysis\n` +
      `🔍 **Primary Issues Identified:**\n` +
      `1. ${underperformer.ctr < avgCTR ? '**Low CTR** - Ad creative may not be resonating with audience' : 'Adequate CTR but low conversion rate'}\n` +
      `2. ${underperformer.topAudiences[0].performance < 85 ? '**Poor Audience Fit** - Current targeting may be too broad' : 'Audience targeting needs refinement'}\n` +
      `3. **ROI Gap** - ${(avgROI - underperformer.roi).toFixed(1)}% below portfolio average\n\n` +
      `### Recommended Actions\n` +
      `**Immediate (This Week):**\n` +
      `• Pause and A/B test new creative variations\n` +
      `• Narrow targeting to top ${underperformer.topAudiences[0].segment} segment\n` +
      `• Reduce daily budget by 30% while testing\n\n` +
      `**Short-term (Next 2 Weeks):**\n` +
      `• Analyze heat maps and user behavior data\n` +
      `• Test different landing page variants\n` +
      `• Implement retargeting for cart abandoners\n\n` +
      `**Long-term (This Month):**\n` +
      `• Consider pausing if ROI doesn't improve by 25%\n` +
      `• Reallocate budget to better performing campaigns\n` +
      `• Archive learnings for future campaign planning\n\n` +
      `**Expected Outcome:** 40-60% ROI improvement within 14 days`;
  };

  // Task 3: ROI Maximization Report
  const generateROIMaximizationReport = () => {
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + (c.conversions * 128), 0);
    const currentROI = ((totalRevenue - totalSpent) / totalSpent * 100).toFixed(1);
    const topPerformer = campaigns.reduce((best, c) => c.roi > best.roi ? c : best);

    const optimizationOpportunities = campaigns.filter(c => c.roi < topPerformer.roi * 0.7);
    const potentialSavings = optimizationOpportunities.reduce((sum, c) => sum + (c.spent * 0.2), 0);

    return `## 📈 ROI Maximization Strategy\n\n` +
      `### Current Performance\n` +
      `• **Overall ROI:** ${currentROI}%\n` +
      `• **Total Spent:** $${totalSpent.toLocaleString()}\n` +
      `• **Total Revenue:** $${totalRevenue.toLocaleString()}\n` +
      `• **Net Profit:** $${(totalRevenue - totalSpent).toLocaleString()}\n\n` +
      `### Optimization Opportunities\n` +
      `I've identified **${optimizationOpportunities.length} campaigns** with significant ROI improvement potential:\n\n` +
      optimizationOpportunities.map((c, i) =>
        `${i + 1}. **${c.name}** - Current ROI: ${c.roi}%, Target: ${(topPerformer.roi * 0.85).toFixed(0)}%\n`
      ).join('') +
      `\n### Quick Wins\n` +
      `**1. Channel Reallocation** 💡\n` +
      `• Shift 15% of budget from underperformers to ${topPerformer.name}\n` +
      `• Projected ROI lift: +${(parseFloat(currentROI) * 0.12).toFixed(1)}%\n\n` +
      `**2. Audience Optimization** 🎯\n` +
      `• Focus on high-converting segments (${topPerformer.topAudiences[0].segment})\n` +
      `• Expected conversion rate increase: +18%\n\n` +
      `**3. Bid Strategy Refinement** 💰\n` +
      `• Reduce bids on low-converting keywords\n` +
      `• Potential savings: $${potentialSavings.toLocaleString()}\n\n` +
      `### Projected Impact\n` +
      `**If all recommendations implemented:**\n` +
      `• New Overall ROI: **${(parseFloat(currentROI) * 1.25).toFixed(1)}%** (+${(parseFloat(currentROI) * 0.25).toFixed(1)}%)\n` +
      `• Additional Monthly Profit: **$${(totalRevenue * 0.25).toLocaleString()}**\n` +
      `• Payback Period: **5-7 days**\n\n` +
      `**Action Priority:** 🔥 HIGH - Implement within 48 hours for maximum impact`;
  };

  // Task 4: Cross-Campaign Audience Analysis
  const generateAudienceInsightsReport = () => {
    const allAudiences = campaigns.flatMap(c =>
      c.topAudiences.map(a => ({ ...a, campaign: c.name, campaignROI: c.roi }))
    );

    const audiencePerformance = {};
    allAudiences.forEach(a => {
      if (!audiencePerformance[a.segment]) {
        audiencePerformance[a.segment] = {
          appearances: 0,
          avgPerformance: 0,
          avgConversion: 0,
          campaigns: []
        };
      }
      audiencePerformance[a.segment].appearances++;
      audiencePerformance[a.segment].avgPerformance += a.performance;
      audiencePerformance[a.segment].avgConversion += a.conversionRate;
      audiencePerformance[a.segment].campaigns.push(a.campaign);
    });

    Object.keys(audiencePerformance).forEach(segment => {
      audiencePerformance[segment].avgPerformance /= audiencePerformance[segment].appearances;
      audiencePerformance[segment].avgConversion /= audiencePerformance[segment].appearances;
    });

    const topAudiences = Object.entries(audiencePerformance)
      .sort(([,a], [,b]) => b.avgPerformance - a.avgPerformance)
      .slice(0, 5);

    return `## 👥 Cross-Campaign Audience Intelligence\n\n` +
      `**Analysis Period:** Last 30 days across ${campaigns.length} campaigns\n\n` +
      `### Top Performing Audience Segments\n\n` +
      topAudiences.map(([segment, data], i) =>
        `**${i + 1}. ${segment}**\n` +
        `• Avg Performance Score: ${data.avgPerformance.toFixed(1)}/100\n` +
        `• Avg Conversion Rate: ${data.avgConversion.toFixed(2)}%\n` +
        `• Appears in: ${data.campaigns.join(', ')}\n` +
        `• Recommendation: ${data.avgPerformance > 90 ? '🔥 Scale immediately' : data.avgPerformance > 80 ? '✅ Maintain focus' : '⚠️ Test and optimize'}\n\n`
      ).join('') +
      `### Key Insights\n` +
      `🎯 **Universal Winners:**\n` +
      `• **${topAudiences[0][0]}** performs consistently across campaigns\n` +
      `• Shows ${topAudiences[0][1].avgConversion.toFixed(2)}% conversion rate\n` +
      `• Present in ${topAudiences[0][1].appearances} of your top campaigns\n\n` +
      `💡 **Opportunity:**\n` +
      `• Create dedicated campaign for ${topAudiences[0][0]}\n` +
      `• Estimated ROI: ${(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length * 1.3).toFixed(0)}%\n` +
      `• Projected conversions: +${Math.round(campaigns.reduce((sum, c) => sum + c.conversions, 0) * 0.15)}/month\n\n` +
      `### Action Items\n` +
      `1. ✅ Increase spend on ${topAudiences[0][0]} by 25%\n` +
      `2. 🔄 A/B test messaging specifically for this segment\n` +
      `3. 📊 Set up dedicated tracking for audience performance\n` +
      `4. 🎨 Create custom creatives for top 3 segments\n\n` +
      `**Implementation Timeline:** Start this week for Q4 optimization`;
  };

  // Task 5: Weekly Performance Report
  const generateWeeklyReport = () => {
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;
    const bestCampaign = campaigns.reduce((best, c) => c.roi > best.roi ? c : best);
    const activeCampaigns = campaigns.filter(c => c.status === 'active');

    return `## 📊 Weekly Performance Report\n\n` +
      `**Report Period:** Last 7 Days\n` +
      `**Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\n` +
      `### Executive Summary\n\n` +
      `📈 **Overall Performance:** ${avgROI >= 250 ? '🟢 Excellent' : avgROI >= 200 ? '🟡 Good' : '🔴 Needs Attention'}\n\n` +
      `**Key Metrics:**\n` +
      `• Total Campaigns: ${campaigns.length} (${activeCampaigns.length} active)\n` +
      `• Total Spend: $${totalSpent.toLocaleString()} / $${totalBudget.toLocaleString()} (${((totalSpent/totalBudget)*100).toFixed(1)}%)\n` +
      `• Total Conversions: ${totalConversions}\n` +
      `• Average ROI: ${avgROI.toFixed(1)}%\n` +
      `• Avg Cost per Conversion: $${calculatedMetrics.costPerConversion}\n\n` +
      `### Campaign Performance Breakdown\n\n` +
      campaigns.map(c =>
        `**${c.name}** ${c.status === 'active' ? '🟢' : '⏸️'}\n` +
        `• ROI: ${c.roi}% | Conversions: ${c.conversions} | CTR: ${c.ctr}%\n` +
        `• Budget Used: ${((c.spent/c.budget)*100).toFixed(0)}% ($${c.spent.toLocaleString()}/$${c.budget.toLocaleString()})\n` +
        `• Status: ${c.roi >= avgROI ? '✅ Above average' : '⚠️ Below average'}\n\n`
      ).join('') +
      `### Top Wins 🏆\n` +
      `1. **${bestCampaign.name}** leading with ${bestCampaign.roi}% ROI\n` +
      `2. **${totalConversions}** total conversions this week\n` +
      `3. **${((totalSpent/totalBudget)*100 < 90 ? 'Budget pacing on track' : 'High budget utilization - monitor closely')}**\n\n` +
      `### Areas for Improvement 🎯\n` +
      campaigns.filter(c => c.roi < avgROI).map(c =>
        `• ${c.name}: Consider ${c.ctr < 3.5 ? 'refreshing ad creative' : 'adjusting targeting'}\n`
      ).join('') +
      `\n### This Week's Action Items\n` +
      `- [ ] Review ${bestCampaign.name} for scaling opportunities\n` +
      `- [ ] Optimize underperforming campaigns\n` +
      `- [ ] Test new audience segments\n` +
      `- [ ] Schedule creative refresh for next week\n\n` +
      `**Next Report:** 7 days | **Recommended Check-in:** 3 days`;
  };

  // Task 6: Conversion Funnel Optimization
  const generateFunnelOptimizationReport = () => {
    const totalImpressions = performanceData.reduce((sum, d) => sum + d.impressions, 0);
    const totalClicks = performanceData.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = performanceData.reduce((sum, d) => sum + d.conversions, 0);

    const ctr = ((totalClicks / totalImpressions) * 100).toFixed(2);
    const clickToConversion = ((totalConversions / totalClicks) * 100).toFixed(2);
    const overallConversionRate = ((totalConversions / totalImpressions) * 100).toFixed(2);

    return `## 🔄 Conversion Funnel Optimization Analysis\n\n` +
      `### Funnel Performance Snapshot\n\n` +
      `**Stage 1: Impressions → Clicks**\n` +
      `• Impressions: ${totalImpressions.toLocaleString()}\n` +
      `• Clicks: ${totalClicks.toLocaleString()}\n` +
      `• CTR: ${ctr}%\n` +
      `• Industry Benchmark: 3.5%\n` +
      `• Status: ${parseFloat(ctr) >= 3.5 ? '✅ Above benchmark' : '⚠️ Below benchmark'}\n\n` +
      `**Stage 2: Clicks → Conversions**\n` +
      `• Clicks: ${totalClicks.toLocaleString()}\n` +
      `• Conversions: ${totalConversions}\n` +
      `• Conversion Rate: ${clickToConversion}%\n` +
      `• Industry Benchmark: 2.5%\n` +
      `• Status: ${parseFloat(clickToConversion) >= 2.5 ? '✅ Above benchmark' : '⚠️ Below benchmark'}\n\n` +
      `### Bottleneck Analysis\n\n` +
      `🔍 **Primary Drop-off Point:**\n` +
      `${parseFloat(ctr) < 3.5 ?
        `**Ad Engagement** - ${(100 - parseFloat(ctr)).toFixed(1)}% of impressions don't convert to clicks\n\n` +
        `**Root Causes:**\n` +
        `• Ad creative may not be compelling enough\n` +
        `• Targeting might be too broad\n` +
        `• Value proposition unclear in ad copy\n\n` +
        `**Recommendations:**\n` +
        `1. Test 3 new ad creative variations this week\n` +
        `2. Refine audience targeting to high-intent users\n` +
        `3. Add clear call-to-action with urgency\n` +
        `4. A/B test different ad formats\n\n` +
        `**Expected Impact:** +${((3.5 - parseFloat(ctr)) / parseFloat(ctr) * totalConversions).toFixed(0)} conversions/week`
        :
        `**Landing Page Conversion** - ${(100 - parseFloat(clickToConversion)).toFixed(1)}% of clicks don't convert\n\n` +
        `**Root Causes:**\n` +
        `• Landing page experience not optimized\n` +
        `• Message match between ad and landing page\n` +
        `• Form friction or unclear next steps\n\n` +
        `**Recommendations:**\n` +
        `1. Reduce form fields by 50%\n` +
        `2. Add social proof and trust signals\n` +
        `3. Improve page load speed (target < 2 seconds)\n` +
        `4. Add exit-intent popup with offer\n\n` +
        `**Expected Impact:** +${((2.5 - parseFloat(clickToConversion)) / parseFloat(clickToConversion) * totalConversions * 1.5).toFixed(0)} conversions/week`
      }\n\n` +
      `### Optimization Roadmap\n\n` +
      `**Week 1: Quick Wins**\n` +
      `• Implement A/B tests on ${parseFloat(ctr) < 3.5 ? 'ad creative' : 'landing pages'}\n` +
      `• Add heat mapping and session recording\n` +
      `• Review and fix any technical issues\n\n` +
      `**Week 2-3: Deep Optimization**\n` +
      `• Roll out winning variants\n` +
      `• Set up retargeting campaigns\n` +
      `• Implement dynamic remarketing\n\n` +
      `**Week 4: Scale**\n` +
      `• Increase budget on optimized funnels\n` +
      `• Expand to similar audiences\n` +
      `• Document learnings for future campaigns\n\n` +
      `**Projected Results:**\n` +
      `• Overall Conversion Rate: ${overallConversionRate}% → ${(parseFloat(overallConversionRate) * 1.4).toFixed(2)}%\n` +
      `• Additional Conversions: +${Math.round(totalConversions * 0.4)}/week\n` +
      `• Revenue Impact: +$${(Math.round(totalConversions * 0.4) * 128).toLocaleString()}/week`;
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

  const insightCards = [
    {
      title: 'Top ROI Campaign',
      value: campaignStats.bestCampaign.name,
      helper: `${campaignStats.bestCampaign.roi}% ROI`,
      icon: TrendingUp,
      accent: 'text-green-400',
      border: 'border-green-500/20'
    },
    {
      title: 'Budget at Risk',
      value: campaignStats.overBudgetCount,
      helper: `${((campaignStats.totalSpent / campaignStats.totalBudget) * 100).toFixed(1)}% utilized`,
      icon: AlertTriangle,
      accent: campaignStats.overBudgetCount > 0 ? 'text-amber-400' : 'text-green-400',
      border: 'border-amber-500/20'
    },
    {
      title: 'Portfolio ROI',
      value: `${campaignStats.avgROI.toFixed(1)}%`,
      helper: `Lowest: ${campaignStats.worstCampaign.name} (${campaignStats.worstCampaign.roi}%)`,
      icon: DollarSign,
      accent: 'text-purple-200',
      border: 'border-purple-500/20'
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
          {isAgentThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-purple-100 border border-purple-500/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-purple-300">Analyzing data...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agentic Task Cards */}
        <div className="px-4 py-3 border-t border-purple-500/20 bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Quick Actions</h4>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Budget Optimizer', icon: '💰', desc: 'Reallocate budget' },
              { name: 'Performance Analysis', icon: '📉', desc: 'Fix underperformers' },
              { name: 'ROI Maximization', icon: '📈', desc: 'Boost returns' },
              { name: 'Audience Insights', icon: '👥', desc: 'Top segments' },
              { name: 'Weekly Report', icon: '📊', desc: 'Full summary' },
              { name: 'Funnel Optimization', icon: '🔄', desc: 'Fix bottlenecks' }
            ].map((task) => (
              <button
                key={task.name}
                onClick={() => executeAgenticTask(task.name)}
                disabled={isAgentThinking}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 hover:from-purple-900/30 hover:to-pink-900/30 border border-purple-500/20 hover:border-purple-400/40 rounded-lg p-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all"></div>
                <div className="relative">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{task.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{task.name}</div>
                      <div className="text-[10px] text-purple-300 truncate">{task.desc}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
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

  // Scenario Planner Modal
  const ScenarioPlanner = ({ campaign, onClose }) => {
    const [budgetAdjustment, setBudgetAdjustment] = useState(0);

    if (!campaign) return null;

    const newBudget = campaign.budget * (1 + budgetAdjustment / 100);
    const predictedConversions = Math.round(campaign.predictedMetrics.endOfMonthConversions * (1 + (budgetAdjustment * 0.7) / 100));
    const predictedROI = Math.round(campaign.predictedMetrics.predictedROI * (1 + (budgetAdjustment * 0.3) / 100));
    const confidence = Math.max(60, campaign.predictedMetrics.confidence - Math.abs(budgetAdjustment) * 0.5);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-semibold text-white">Campaign Scenario Planner</h3>
                <p className="text-xs text-purple-100">{campaign.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Budget Adjustment Slider */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Budget Adjustment: {budgetAdjustment > 0 ? '+' : ''}{budgetAdjustment}%
              </label>
              <input
                type="range"
                min="-50"
                max="100"
                value={budgetAdjustment}
                onChange={(e) => setBudgetAdjustment(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between mt-2 text-xs text-purple-300">
                <span>-50%</span>
                <span>0%</span>
                <span>+100%</span>
              </div>
            </div>

            {/* Scenario Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current Scenario */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
                <h4 className="text-sm font-semibold text-purple-300 mb-3">Current Forecast</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-purple-200">Budget</div>
                    <div className="text-lg font-bold text-white">${campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-200">Expected Conversions</div>
                    <div className="text-lg font-bold text-white">{campaign.predictedMetrics.endOfMonthConversions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-200">Expected ROI</div>
                    <div className="text-lg font-bold text-green-400">{campaign.predictedMetrics.predictedROI}%</div>
                  </div>
                </div>
              </div>

              {/* New Scenario */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-400/30">
                <h4 className="text-sm font-semibold text-purple-300 mb-3">Adjusted Forecast</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-purple-200">New Budget</div>
                    <div className="text-lg font-bold text-white">${Math.round(newBudget).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-200">Predicted Conversions</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      {predictedConversions}
                      {budgetAdjustment !== 0 && (
                        <span className={`text-xs ${budgetAdjustment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({budgetAdjustment > 0 ? '+' : ''}{predictedConversions - campaign.predictedMetrics.endOfMonthConversions})
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-200">Predicted ROI</div>
                    <div className="text-lg font-bold text-green-400 flex items-center gap-2">
                      {predictedROI}%
                      {budgetAdjustment !== 0 && (
                        <span className={`text-xs ${predictedROI > campaign.predictedMetrics.predictedROI ? 'text-green-400' : 'text-red-400'}`}>
                          ({predictedROI > campaign.predictedMetrics.predictedROI ? '+' : ''}{predictedROI - campaign.predictedMetrics.predictedROI}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Prediction Confidence</span>
                <span className="text-sm text-purple-300">{confidence.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${confidence > 80 ? 'bg-green-500' : confidence > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-300 mt-2">
                {confidence > 80 ? 'High confidence - Based on strong historical performance' :
                 confidence > 60 ? 'Moderate confidence - Larger adjustments increase uncertainty' :
                 'Lower confidence - Large budget changes may have unpredictable effects'}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Recommendation
              </h4>
              <p className="text-sm text-purple-200">
                {budgetAdjustment > 0
                  ? `Increasing budget by ${budgetAdjustment}% could generate ${predictedConversions - campaign.predictedMetrics.endOfMonthConversions} additional conversions. This is a good strategy for high-performing campaigns.`
                  : budgetAdjustment < 0
                  ? `Reducing budget by ${Math.abs(budgetAdjustment)}% will likely decrease conversions by ${Math.abs(predictedConversions - campaign.predictedMetrics.endOfMonthConversions)}. Consider this if you need to reallocate funds.`
                  : 'Use the slider above to explore different budget scenarios and their predicted outcomes.'}
              </p>
            </div>
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

            {/* AI-Powered Predictive Analytics */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Predictive Analytics
                </h3>
                <span className="text-xs bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  {campaign.predictedMetrics.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/10">
                  <div className="text-xs text-purple-300 mb-1">End of Month Conversions</div>
                  <div className="text-2xl font-bold text-white">{campaign.predictedMetrics.endOfMonthConversions}</div>
                  <div className="text-xs text-green-400 mt-1">
                    +{campaign.predictedMetrics.endOfMonthConversions - campaign.conversions} predicted
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/10">
                  <div className="text-xs text-purple-300 mb-1">Predicted ROI</div>
                  <div className="text-2xl font-bold text-green-400">{campaign.predictedMetrics.predictedROI}%</div>
                  <div className="text-xs text-green-400 mt-1">
                    +{campaign.predictedMetrics.predictedROI - campaign.roi}% improvement
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/10">
                  <div className="text-xs text-purple-300 mb-1">Projected Spend</div>
                  <div className="text-2xl font-bold text-white">${campaign.predictedMetrics.projectedSpend.toLocaleString()}</div>
                  <div className="text-xs text-purple-300 mt-1">
                    {((campaign.predictedMetrics.projectedSpend / campaign.budget) * 100).toFixed(0)}% of budget
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/10">
                <p className="text-sm text-purple-200">
                  <strong className="text-white">AI Insight:</strong> Based on current trends, this campaign is projected to exceed expectations.
                  The predicted {campaign.predictedMetrics.endOfMonthConversions - campaign.conversions} additional conversions suggest strong momentum.
                </p>
              </div>
            </div>

            {/* Audience Insights & Targeting */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Top Performing Audiences
              </h3>

              <div className="space-y-3">
                {campaign.topAudiences.map((audience, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{audience.segment}</div>
                          <div className="text-xs text-purple-300">Conversion Rate: {audience.conversionRate}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">{audience.performance}/100</div>
                        <div className="text-xs text-purple-300">Performance</div>
                      </div>
                    </div>

                    {/* Performance Bar */}
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          audience.performance >= 90 ? 'bg-green-500' :
                          audience.performance >= 75 ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${audience.performance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-purple-900/20 rounded-lg p-3 border border-purple-500/10">
                <p className="text-sm text-purple-200">
                  <strong className="text-white">Targeting Recommendation:</strong> Focus on {campaign.topAudiences[0].segment} -
                  they show {campaign.topAudiences[0].conversionRate}% conversion rate, significantly above average.
                  Consider creating dedicated creatives for this high-value segment.
                </p>
              </div>
            </div>

            {/* Scenario Planning CTA */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Campaign Scenario Planning</h3>
                  <p className="text-sm text-purple-300">Simulate budget changes and predict their impact</p>
                </div>
                <button
                  onClick={() => setShowScenarioPlanner(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Run Scenarios
                </button>
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

      {/* Scenario Planner Modal */}
      {showScenarioPlanner && drillDownCampaign && (
        <ScenarioPlanner
          campaign={drillDownCampaign}
          onClose={() => setShowScenarioPlanner(false)}
        />
      )}

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

        {/* Portfolio Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {insightCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border ${card.border} p-5 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-purple-300 mb-2">{card.title}</div>
                  <div className="text-xl font-semibold text-white">{card.value}</div>
                  <div className="text-xs text-purple-300 mt-1">{card.helper}</div>
                </div>
                <div className={`p-2 rounded-lg bg-slate-900/60 ${card.accent}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 text-xs text-purple-400">
                {campaignStats.activeCount} active • {campaignStats.pausedCount} paused
              </div>
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
                  className="pl-10 pr-10 py-2 bg-slate-900/50 border border-purple-500/30 text-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    aria-sort={getSortAria('name')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Campaign {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    aria-sort={getSortAria('status')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('budget')}
                    aria-sort={getSortAria('budget')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Budget {sortConfig.key === 'budget' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('spent')}
                    aria-sort={getSortAria('spent')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Spent {sortConfig.key === 'spent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('conversions')}
                    aria-sort={getSortAria('conversions')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    Conversions {sortConfig.key === 'conversions' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('ctr')}
                    aria-sort={getSortAria('ctr')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    CTR {sortConfig.key === 'ctr' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('roi')}
                    aria-sort={getSortAria('roi')}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200 transition-colors select-none"
                  >
                    ROI {sortConfig.key === 'roi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredAndSortedCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-purple-300">
                      No campaigns match your search. Try clearing the filter.
                    </td>
                  </tr>
                ) : filteredAndSortedCampaigns.map((campaign) => {
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
