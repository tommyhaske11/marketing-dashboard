export const campaigns = [
  { id: 1, name: 'Summer Sale 2025', status: 'active', budget: 15000, spent: 12450, conversions: 342, ctr: 3.8, roi: 285 },
  { id: 2, name: 'Product Launch', status: 'active', budget: 25000, spent: 18900, conversions: 521, ctr: 4.2, roi: 312 },
  { id: 3, name: 'Brand Awareness', status: 'paused', budget: 10000, spent: 8200, conversions: 156, ctr: 2.9, roi: 198 },
  { id: 4, name: 'Holiday Special', status: 'active', budget: 20000, spent: 16780, conversions: 438, ctr: 3.5, roi: 267 }
];

export const allPerformanceData = {
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

export const channelData = [
  { name: 'Google Ads', value: 42, color: '#E4002B' },
  { name: 'Facebook', value: 28, color: '#1A1A2E' },
  { name: 'Instagram', value: 18, color: '#4A90D9' },
  { name: 'LinkedIn', value: 12, color: '#2ECC71' }
];

// Engagement Heatmap Data — intensity values (0–100) for Day x Hour
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const heatmapRaw = [
  // Mon
  [5, 3, 2, 1, 1, 2, 8, 18, 42, 58, 65, 72, 68, 62, 55, 48, 52, 60, 55, 40, 28, 18, 12, 7],
  // Tue
  [4, 2, 2, 1, 1, 3, 10, 22, 48, 62, 70, 78, 74, 68, 60, 52, 56, 64, 58, 42, 30, 20, 14, 8],
  // Wed
  [6, 3, 2, 1, 1, 2, 9, 20, 45, 60, 68, 75, 72, 66, 58, 50, 54, 62, 56, 38, 26, 17, 11, 6],
  // Thu
  [5, 3, 2, 1, 1, 3, 11, 24, 50, 64, 72, 80, 76, 70, 62, 54, 58, 66, 60, 44, 32, 22, 15, 9],
  // Fri
  [6, 4, 3, 2, 1, 3, 10, 20, 44, 58, 64, 70, 66, 60, 54, 46, 50, 58, 52, 36, 24, 16, 10, 6],
  // Sat
  [8, 6, 4, 3, 2, 2, 4, 10, 22, 30, 38, 42, 45, 48, 50, 52, 55, 58, 62, 55, 45, 35, 22, 12],
  // Sun
  [7, 5, 4, 3, 2, 2, 3, 8, 18, 25, 32, 36, 38, 40, 42, 44, 48, 52, 56, 50, 40, 30, 18, 10],
];

export const engagementHeatmapData = [];
days.forEach((day, di) => {
  hours.forEach((hour) => {
    engagementHeatmapData.push({
      day,
      dayIndex: di,
      hour,
      hourLabel: hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`,
      value: heatmapRaw[di][hour],
    });
  });
});

// Device & Platform Analytics
export const deviceStats = {
  devices: [
    { name: 'Mobile', value: 58, color: '#E4002B' },
    { name: 'Desktop', value: 32, color: '#1A1A2E' },
    { name: 'Tablet', value: 10, color: '#4A90D9' },
  ],
  os: [
    { name: 'iOS', value: 38, color: '#E4002B' },
    { name: 'Android', value: 28, color: '#2ECC71' },
    { name: 'Windows', value: 20, color: '#4A90D9' },
    { name: 'macOS', value: 12, color: '#1A1A2E' },
    { name: 'Other', value: 2, color: '#94A3B8' },
  ],
  browser: [
    { name: 'Chrome', value: 48, color: '#E4002B' },
    { name: 'Safari', value: 28, color: '#4A90D9' },
    { name: 'Firefox', value: 12, color: '#F59E0B' },
    { name: 'Edge', value: 8, color: '#2ECC71' },
    { name: 'Other', value: 4, color: '#94A3B8' },
  ],
};

// Smart Insights Feed
export const smartInsights = [
  {
    id: 1,
    type: 'trend_up',
    severity: 'success',
    title: 'Product Launch CTR Surging',
    description: 'CTR on "Product Launch" increased by 12% over the last 7 days, outperforming all other campaigns.',
    metric: '+12%',
    timestamp: '2 hours ago',
    campaign: 'Product Launch',
  },
  {
    id: 2,
    type: 'warning',
    severity: 'warning',
    title: 'Brand Awareness Budget Nearly Depleted',
    description: '"Brand Awareness" has spent 82% of its budget with only 156 conversions. Consider pausing or reallocating.',
    metric: '82% spent',
    timestamp: '4 hours ago',
    campaign: 'Brand Awareness',
  },
  {
    id: 3,
    type: 'anomaly',
    severity: 'error',
    title: 'Conversion Drop Detected',
    description: 'Conversions on "Summer Sale 2025" dropped 8% compared to the previous period. Investigate landing page performance.',
    metric: '-8%',
    timestamp: '6 hours ago',
    campaign: 'Summer Sale 2025',
  },
  {
    id: 4,
    type: 'trend_up',
    severity: 'success',
    title: 'Weekend Engagement Spike',
    description: 'Saturday and Sunday engagement is 35% higher than weekday average. Consider increasing weekend ad spend.',
    metric: '+35%',
    timestamp: '1 day ago',
    campaign: null,
  },
  {
    id: 5,
    type: 'info',
    severity: 'info',
    title: 'Mobile Dominates Traffic',
    description: '58% of all traffic comes from mobile devices. Ensure all landing pages are mobile-optimized.',
    metric: '58%',
    timestamp: '1 day ago',
    campaign: null,
  },
  {
    id: 6,
    type: 'trend_up',
    severity: 'success',
    title: 'Holiday Special ROI Strong',
    description: '"Holiday Special" is delivering 267% ROI, making it the second-best performing campaign.',
    metric: '267% ROI',
    timestamp: '2 days ago',
    campaign: 'Holiday Special',
  },
  {
    id: 7,
    type: 'warning',
    severity: 'warning',
    title: 'Peak Hours Underutilized',
    description: 'Highest engagement occurs 10am-12pm but only 18% of budget is allocated to those hours.',
    metric: '18%',
    timestamp: '2 days ago',
    campaign: null,
  },
];
