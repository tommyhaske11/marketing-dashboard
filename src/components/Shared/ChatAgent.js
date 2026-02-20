import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Sparkles, Send, ExternalLink, BarChart3, Download, Eye, Lightbulb, AlertTriangle } from 'lucide-react';

// ─── Sparkline Sub-Component ────────────────────────────────────────────────
const Sparkline = ({ data, color = '#E4002B', width = 200, height = 40 }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="mt-2 mb-1">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx={parseFloat(points.split(' ').pop().split(',')[0])} cy={parseFloat(points.split(' ').pop().split(',')[1])} r="3" fill={color} />
        </svg>
    );
};

// ─── Typing Message Sub-Component ───────────────────────────────────────────
const TypingMessage = ({ message, onComplete, renderMessage }) => {
    const [displayedLength, setDisplayedLength] = useState(0);
    const fullText = message.content || '';
    const intervalRef = useRef(null);

    useEffect(() => {
        setDisplayedLength(0);
        const speed = Math.max(8, Math.min(20, 2000 / fullText.length));
        intervalRef.current = setInterval(() => {
            setDisplayedLength(prev => {
                if (prev >= fullText.length) {
                    clearInterval(intervalRef.current);
                    onComplete?.();
                    return prev;
                }
                return prev + 1;
            });
        }, speed);
        return () => clearInterval(intervalRef.current);
    }, [fullText, onComplete]);

    const visibleText = fullText.slice(0, displayedLength);
    const isComplete = displayedLength >= fullText.length;

    return (
        <div>
            {renderMessage({ ...message, content: visibleText }, isComplete)}
            {!isComplete && <span className="inline-block w-0.5 h-4 bg-ps-red ml-0.5 animate-pulse" />}
        </div>
    );
};

// ─── Comparison Card Sub-Component ──────────────────────────────────────────
const ComparisonCard = ({ comparison }) => {
    if (!comparison || comparison.length !== 2) return null;
    const [a, b] = comparison;
    const metrics = ['budget', 'spent', 'conversions', 'ctr', 'roi'];
    const labels = { budget: 'Budget', spent: 'Spent', conversions: 'Conversions', ctr: 'CTR', roi: 'ROI' };
    const fmt = (key, val) => {
        if (key === 'budget' || key === 'spent') return `$${val.toLocaleString()}`;
        if (key === 'ctr' || key === 'roi') return `${val}%`;
        return val.toLocaleString();
    };

    return (
        <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
            <div className="font-semibold text-gray-900 truncate text-center">{a.name}</div>
            <div className="text-gray-400 text-center">vs</div>
            <div className="font-semibold text-gray-900 truncate text-center">{b.name}</div>
            {metrics.map(m => {
                const aWins = a[m] > b[m];
                const bWins = b[m] > a[m];
                return (
                    <React.Fragment key={m}>
                        <div className={`text-center py-1 rounded ${aWins ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600'}`}>{fmt(m, a[m])}</div>
                        <div className="text-center py-1 text-gray-400">{labels[m]}</div>
                        <div className={`text-center py-1 rounded ${bWins ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600'}`}>{fmt(m, b[m])}</div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ─── Main ChatAgent Component ───────────────────────────────────────────────
const ChatAgent = ({
    campaigns,
    calculatedMetrics,
    performanceData,
    engagementHeatmapData,
    deviceStats,
    smartInsights,
    setActiveTab,
    openDrillDown,
    handleExport,
}) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const lastMentionedCampaign = useRef(null);
    const messagesEndRef = useRef(null);
    const hasShownAnomalies = useRef(false);

    // ── Scroll to bottom on new messages ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    // ── Anomaly detection on open ──
    const checkAnomalies = useCallback(() => {
        if (hasShownAnomalies.current || !campaigns?.length) return;
        hasShownAnomalies.current = true;

        const avgROI = campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length;
        const outliers = campaigns.filter(c => c.roi < avgROI * 0.5);
        const overBudget = campaigns.filter(c => (c.spent / c.budget) >= 0.9);

        const alerts = [];
        outliers.forEach(c => alerts.push(`⚠️ **${c.name}** has an ROI of ${c.roi}%, which is less than half the average (${avgROI.toFixed(0)}%).`));
        overBudget.forEach(c => {
            if (!outliers.find(o => o.id === c.id)) {
                alerts.push(`🔴 **${c.name}** has used ${((c.spent / c.budget) * 100).toFixed(0)}% of its budget.`);
            }
        });

        if (alerts.length > 0) {
            return {
                role: 'assistant',
                content: `I found ${alerts.length} item(s) that may need your attention:\n\n${alerts.join('\n')}\n\nWould you like recommendations on any of these?`,
            };
        }
        return null;
    }, [campaigns]);

    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            const welcome = {
                role: 'assistant',
                content: "Hi! I'm your Campaign Performance Assistant. Ask me anything — compare campaigns, check trends, review device analytics, or get recommendations. What would you like to know?",
            };
            const anomaly = checkAnomalies();
            setChatMessages(anomaly ? [welcome, anomaly] : [welcome]);
        }
    }, [isChatOpen, chatMessages.length, checkAnomalies]);

    // ── NLU helpers ──
    const matchAny = (q, words) => words.some(w => q.includes(w));
    const findCampaignByName = (q) => {
        const lower = q.toLowerCase();
        return campaigns.find(c => lower.includes(c.name.toLowerCase()));
    };

    // ── Resolve pronouns / context ──
    const resolveCampaign = (q) => {
        const explicit = findCampaignByName(q);
        if (explicit) {
            lastMentionedCampaign.current = explicit;
            return explicit;
        }
        const lowerQ = q.toLowerCase();
        if (matchAny(lowerQ, ['that campaign', 'that one', 'about it', 'more about', 'tell me more', 'this one', 'same one'])) {
            return lastMentionedCampaign.current;
        }
        return null;
    };

    // ── Main Analysis Engine ──
    const analyzeQuery = (question) => {
        const lowerQ = question.toLowerCase();

        // Computed data
        const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
        const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
        const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
        const avgROI = campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length;
        const bestCampaign = [...campaigns].sort((a, b) => b.roi - a.roi)[0];
        const worstCampaign = [...campaigns].sort((a, b) => a.roi - b.roi)[0];
        const overBudgetCampaigns = campaigns.filter(c => (c.spent / c.budget) >= 0.85);

        // ─── 1. Campaign Comparison ──
        const compareMatch = lowerQ.match(/compare\s+(.+?)\s+(?:vs|versus|with|and|to)\s+(.+)/i);
        if (compareMatch) {
            const nameA = compareMatch[1].trim();
            const nameB = compareMatch[2].trim();
            const campA = campaigns.find(c => c.name.toLowerCase().includes(nameA.toLowerCase()));
            const campB = campaigns.find(c => c.name.toLowerCase().includes(nameB.toLowerCase()));
            if (campA && campB) {
                lastMentionedCampaign.current = campA;
                const winner = campA.roi > campB.roi ? campA : campB;
                return {
                    content: `Here's a side-by-side comparison of **${campA.name}** vs **${campB.name}**. Overall, **${winner.name}** is performing better with a ${winner.roi}% ROI.`,
                    comparison: [campA, campB],
                    actions: [
                        { label: `View ${campA.name}`, icon: 'eye', handler: () => openDrillDown?.(campA) },
                        { label: `View ${campB.name}`, icon: 'eye', handler: () => openDrillDown?.(campB) },
                    ],
                };
            }
            return { content: `I couldn't find both campaigns. Available: ${campaigns.map(c => `**${c.name}**`).join(', ')}.` };
        }

        // ─── 2. Insights — Engagement Timing ──
        if (matchAny(lowerQ, ['when should', 'best time', 'peak hour', 'peak time', 'engagement time', 'when to run', 'when to post', 'schedule', 'timing'])) {
            if (engagementHeatmapData?.length) {
                const sorted = [...engagementHeatmapData].sort((a, b) => b.value - a.value);
                const top5 = sorted.slice(0, 5);
                const peakDay = top5[0].day;
                const peakHour = top5[0].hourLabel || `${top5[0].hour}:00`;
                const dayFreq = {};
                top5.forEach(t => { dayFreq[t.day] = (dayFreq[t.day] || 0) + 1; });
                const bestDay = Object.entries(dayFreq).sort((a, b) => b[1] - a[1])[0][0];

                return {
                    content: `Based on your engagement heatmap, the absolute peak is **${peakDay} at ${peakHour}** (${top5[0].value}% engagement).\n\n` +
                        `The top 5 engagement slots are:\n${top5.map((t, i) => `${i + 1}. **${t.day} ${t.hourLabel || t.hour + ':00'}** — ${t.value}%`).join('\n')}\n\n` +
                        `**${bestDay}** appears most frequently in peak slots. Consider scheduling your ads during these windows.`,
                    actions: [
                        { label: 'View Heatmap', icon: 'chart', handler: () => setActiveTab?.('insights') },
                    ],
                };
            }
            return { content: "I don't have engagement timing data available right now." };
        }

        // ─── 2. Insights — Device/Platform ──
        if (matchAny(lowerQ, ['device', 'mobile', 'desktop', 'tablet', 'browser', 'chrome', 'safari', 'os', 'platform', 'iphone', 'android', 'windows'])) {
            if (deviceStats) {
                const topDevice = deviceStats.devices?.[0];
                const topBrowser = deviceStats.browser?.[0];
                const topOS = deviceStats.os?.[0];
                return {
                    content: `Here's your device breakdown:\n\n` +
                        `📱 **Device**: ${deviceStats.devices.map(d => `${d.name} ${d.value}%`).join(' · ')}\n` +
                        `💻 **OS**: ${deviceStats.os.map(d => `${d.name} ${d.value}%`).join(' · ')}\n` +
                        `🌐 **Browser**: ${deviceStats.browser.map(d => `${d.name} ${d.value}%`).join(' · ')}\n\n` +
                        `**${topDevice?.name}** dominates at ${topDevice?.value}%, with **${topOS?.name}** as the top OS and **${topBrowser?.name}** the most common browser. Ensure your landing pages are optimized for this combo.`,
                    actions: [
                        { label: 'View Device Analytics', icon: 'chart', handler: () => setActiveTab?.('insights') },
                    ],
                };
            }
            return { content: "No device data available." };
        }

        // ─── 3. Trend Analysis ──
        if (matchAny(lowerQ, ['trend', 'trending', 'going up', 'going down', 'direction', 'trajectory', 'getting better', 'getting worse', 'improving'])) {
            if (performanceData?.length >= 3) {
                const convData = performanceData.map(d => d.conversions);
                const spendData = performanceData.map(d => d.spend);
                const first = convData.slice(0, Math.ceil(convData.length / 2));
                const second = convData.slice(Math.ceil(convData.length / 2));
                const firstAvg = first.reduce((s, v) => s + v, 0) / first.length;
                const secondAvg = second.reduce((s, v) => s + v, 0) / second.length;
                const changePct = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);
                const direction = secondAvg > firstAvg * 1.05 ? '📈 **Rising**' : secondAvg < firstAvg * 0.95 ? '📉 **Declining**' : '➡️ **Stable**';

                return {
                    content: `**Conversion Trend**: ${direction} (${changePct > 0 ? '+' : ''}${changePct}% shift)\n\n` +
                        `First half avg: ${firstAvg.toFixed(0)} conversions/day\nSecond half avg: ${secondAvg.toFixed(0)} conversions/day\n\n` +
                        `At this rate, ${secondAvg > firstAvg ? 'momentum is building — consider increasing spend to capitalize.' : secondAvg < firstAvg ? 'performance is softening — review recent creative or targeting changes.' : 'things are steady. Experiment with new creative to push growth.'}`,
                    sparklineData: convData,
                };
            }
            return { content: "Not enough data points to analyze trends yet." };
        }

        // ─── 4. Budget Forecasting ──
        if (matchAny(lowerQ, ['forecast', 'run out', 'how long', 'budget last', 'days left', 'remaining', 'burn rate', 'deplete'])) {
            if (performanceData?.length) {
                const forecasts = campaigns.map(c => {
                    const campData = performanceData.filter(d => d.campaign === c.name);
                    const totalSpend = campData.reduce((s, d) => s + d.spend, 0);
                    const daysOfData = campData.length || 1;
                    const dailyRate = totalSpend / daysOfData;
                    const remaining = c.budget - c.spent;
                    const daysLeft = dailyRate > 0 ? Math.ceil(remaining / dailyRate) : Infinity;
                    return { ...c, dailyRate, daysLeft, remaining };
                });

                const urgent = forecasts.filter(f => f.daysLeft < 7 && f.daysLeft !== Infinity);
                const sorted = forecasts.filter(f => f.daysLeft !== Infinity).sort((a, b) => a.daysLeft - b.daysLeft);

                let response = `**Budget Forecast:**\n\n`;
                sorted.forEach(f => {
                    const emoji = f.daysLeft < 3 ? '🔴' : f.daysLeft < 7 ? '🟡' : '🟢';
                    response += `${emoji} **${f.name}**: ~${f.daysLeft} days remaining ($${f.dailyRate.toFixed(0)}/day burn rate)\n`;
                });

                if (urgent.length > 0) {
                    response += `\n⚠️ **${urgent.length}** campaign(s) may exhaust budget within a week.`;
                }

                return { content: response };
            }
            return { content: "Need performance data to forecast budgets." };
        }

        // ─── 1. Comparison shortcut: "compare campaigns" ──
        if (matchAny(lowerQ, ['compare'])) {
            return {
                content: `Which two campaigns would you like to compare? Try: "Compare **${campaigns[0]?.name}** vs **${campaigns[1]?.name}**"\n\nAvailable: ${campaigns.map(c => `**${c.name}**`).join(', ')}`,
            };
        }

        // ─── Context-aware single campaign ──
        const resolvedCampaign = resolveCampaign(question);
        if (resolvedCampaign && matchAny(lowerQ, ['detail', 'more', 'drill', 'show me', 'about it', 'tell me', 'how is', 'how\u0027s'])) {
            const c = resolvedCampaign;
            return {
                content: `**${c.name}** (${c.status}):\n\n` +
                    `💰 Budget: $${c.budget.toLocaleString()} | Spent: $${c.spent.toLocaleString()} (${((c.spent / c.budget) * 100).toFixed(0)}%)\n` +
                    `🎯 Conversions: ${c.conversions} | CTR: ${c.ctr}%\n` +
                    `📊 ROI: ${c.roi}%\n\n` +
                    `${c.roi >= avgROI ? '✅ Performing above average.' : '⚠️ Performing below average — consider reviewing.'}`,
                actions: [
                    { label: `View Details`, icon: 'eye', handler: () => openDrillDown?.(c) },
                ],
            };
        }

        // ─── Smart Insights ──
        if (matchAny(lowerQ, ['insight', 'finding', 'discovered', 'alert', 'notification', 'anomal'])) {
            if (smartInsights?.length) {
                const top3 = smartInsights.slice(0, 3);
                return {
                    content: `Here are the top automated insights:\n\n${top3.map((ins, i) => `${i + 1}. **${ins.title}** — ${ins.description} (${ins.metric})`).join('\n\n')}`,
                    actions: [
                        { label: 'View All Insights', icon: 'lightbulb', handler: () => setActiveTab?.('insights') },
                    ],
                };
            }
            return { content: "No automated insights available right now." };
        }

        // ─── Existing analysis (enhanced NLU) ──
        if (matchAny(lowerQ, ['best', 'top', 'highest', 'winner', 'strongest', 'leading', '#1', 'number one'])) {
            lastMentionedCampaign.current = bestCampaign;
            return {
                content: `The best performing campaign is **${bestCampaign.name}** with an ROI of ${bestCampaign.roi}% and ${bestCampaign.conversions} conversions. It has a CTR of ${bestCampaign.ctr}% and has spent $${bestCampaign.spent.toLocaleString()} of its $${bestCampaign.budget.toLocaleString()} budget.`,
                actions: [
                    { label: `View ${bestCampaign.name}`, icon: 'eye', handler: () => openDrillDown?.(bestCampaign) },
                ],
            };
        }

        if (matchAny(lowerQ, ['worst', 'lowest', 'underperforming', 'weakest', 'struggling', 'poor', 'bad', 'failing'])) {
            lastMentionedCampaign.current = worstCampaign;
            return {
                content: `The campaign with the lowest ROI is **${worstCampaign.name}** at ${worstCampaign.roi}%. It has ${worstCampaign.conversions} conversions with a ${worstCampaign.ctr}% CTR. Consider reviewing its targeting, creative, or budget allocation.`,
                actions: [
                    { label: `View ${worstCampaign.name}`, icon: 'eye', handler: () => openDrillDown?.(worstCampaign) },
                ],
            };
        }

        if (matchAny(lowerQ, ['budget', 'spending', 'spent', 'money', 'cost', 'expense', 'burn'])) {
            const utilizationRate = ((totalSpent / totalBudget) * 100).toFixed(1);
            let response = `Overall budget utilization is at ${utilizationRate}%. You've spent $${totalSpent.toLocaleString()} out of $${totalBudget.toLocaleString()}.`;
            if (overBudgetCampaigns.length > 0) {
                response += `\n\n⚠️ **Alert**: ${overBudgetCampaigns.length} campaign(s) nearing budget: ${overBudgetCampaigns.map(c => `**${c.name}**`).join(', ')}.`;
            }
            return {
                content: response,
                actions: [
                    { label: 'Export Report', icon: 'download', handler: () => handleExport?.() },
                ],
            };
        }

        if (matchAny(lowerQ, ['conversion', 'converting', 'convert'])) {
            const avgConversions = (totalConversions / campaigns.length).toFixed(0);
            const convData = performanceData?.map(d => d.conversions);
            return {
                content: `You have ${totalConversions} total conversions across all campaigns, averaging ${avgConversions} per campaign. **${bestCampaign.name}** leads with ${bestCampaign.conversions}. Cost per conversion: $${calculatedMetrics.costPerConversion}.`,
                sparklineData: convData?.length >= 3 ? convData : undefined,
            };
        }

        if (matchAny(lowerQ, ['roi', 'return', 'profit', 'margin'])) {
            return {
                content: `Average ROI: **${avgROI.toFixed(1)}%**\n\n🏆 Best: **${bestCampaign.name}** (${bestCampaign.roi}%)\n📉 Lowest: **${worstCampaign.name}** (${worstCampaign.roi}%)\n\nFocus more budget on ${bestCampaign.name} for better returns.`,
            };
        }

        if (matchAny(lowerQ, ['ctr', 'click', 'click-through', 'clickthrough'])) {
            const avgCTR = (campaigns.reduce((s, c) => s + c.ctr, 0) / campaigns.length).toFixed(2);
            const bestCTR = [...campaigns].sort((a, b) => b.ctr - a.ctr)[0];
            lastMentionedCampaign.current = bestCTR;
            return {
                content: `Average CTR: ${avgCTR}%. **${bestCTR.name}** leads at ${bestCTR.ctr}% (${(bestCTR.ctr - avgCTR).toFixed(2)}% above avg). Analyze its ad creative for insights to apply elsewhere.`,
            };
        }

        if (matchAny(lowerQ, ['recommend', 'suggest', 'advice', 'improve', 'optimize', 'help me', 'what should', 'tips'])) {
            let recs = `Based on your data, here are my recommendations:\n\n`;
            recs += `1. **Increase budget** for ${bestCampaign.name} (ROI: ${bestCampaign.roi}%) — it's your best performer\n`;
            recs += `2. **Optimize or pause** ${worstCampaign.name} (ROI: ${worstCampaign.roi}%) to reduce wasted spend\n`;
            if (overBudgetCampaigns.length > 0) {
                recs += `3. **Review budget allocation** — ${overBudgetCampaigns.length} campaign(s) at 85%+ usage\n`;
            }
            recs += `4. **A/B test** creative from ${bestCampaign.name} in underperforming campaigns`;
            return {
                content: recs,
                actions: [
                    { label: `View ${bestCampaign.name}`, icon: 'eye', handler: () => openDrillDown?.(bestCampaign) },
                    { label: `View ${worstCampaign.name}`, icon: 'eye', handler: () => openDrillDown?.(worstCampaign) },
                ],
            };
        }

        if (matchAny(lowerQ, ['summary', 'overview', 'status', 'dashboard', 'report', 'everything', 'all', 'show me'])) {
            return {
                content: `**Campaign Overview:**\n\n` +
                    `📊 **Total Campaigns**: ${campaigns.length} (${campaigns.filter(c => c.status === 'active').length} active)\n` +
                    `💰 **Total Budget**: $${totalBudget.toLocaleString()}\n` +
                    `📈 **Total Spent**: $${totalSpent.toLocaleString()} (${((totalSpent / totalBudget) * 100).toFixed(1)}%)\n` +
                    `🎯 **Total Conversions**: ${totalConversions}\n` +
                    `📊 **Average ROI**: ${avgROI.toFixed(1)}%\n` +
                    `🏆 **Top Performer**: ${bestCampaign.name}\n` +
                    `⚠️ **Needs Attention**: ${worstCampaign.name}`,
                actions: [
                    { label: 'Export Report', icon: 'download', handler: () => handleExport?.() },
                    { label: 'View Insights', icon: 'lightbulb', handler: () => setActiveTab?.('insights') },
                ],
            };
        }

        // ─── Fallback with enhanced help ──
        return {
            content: `I can help you with:\n\n` +
                `📊 **"Compare Summer Sale vs Product Launch"**\n` +
                `⏰ **"When should I run ads?"**\n` +
                `📱 **"What devices do users use?"**\n` +
                `📈 **"How are conversions trending?"**\n` +
                `💰 **"When will budgets run out?"**\n` +
                `🏆 **"Which campaign is best?"**\n` +
                `💡 **"Give me recommendations"**\n` +
                `📋 **"Campaign summary"**\n\n` +
                `Just ask anything about your campaigns!`,
        };
    };

    // ── Send message handler ──
    const handleSendMessage = useCallback(() => {
        if (!userInput.trim() || isTyping) return;
        const userMessage = { role: 'user', content: userInput };
        setChatMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsTyping(true);

        setTimeout(() => {
            const result = analyzeQuery(userInput);
            const aiResponse = {
                role: 'assistant',
                content: result.content || result,
                actions: result.actions,
                sparklineData: result.sparklineData,
                comparison: result.comparison,
                isNew: true,
            };
            setChatMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 400);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInput, isTyping, campaigns, performanceData, engagementHeatmapData, deviceStats]);

    // ── Action button icon lookup ──
    const getActionIcon = (iconName) => {
        const icons = { eye: Eye, chart: BarChart3, download: Download, lightbulb: Lightbulb, external: ExternalLink };
        return icons[iconName] || ExternalLink;
    };

    // ── Render message content ──
    const renderMessageContent = (message, showExtras = true) => {
        const parts = (message.content || '').split('**');
        return (
            <>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {parts.map((part, i) =>
                        i % 2 === 0 ? part : (
                            <strong key={i} className={`font-semibold ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>{part}</strong>
                        )
                    )}
                </div>
                {showExtras && message.sparklineData && <Sparkline data={message.sparklineData} />}
                {showExtras && message.comparison && <ComparisonCard comparison={message.comparison} />}
                {showExtras && message.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {message.actions.map((action, i) => {
                            const Icon = getActionIcon(action.icon);
                            return (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); action.handler?.(); }}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs rounded-full hover:bg-ps-red hover:text-white hover:border-ps-red transition-all shadow-sm"
                                >
                                    <Icon className="w-3 h-3" />
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </>
        );
    };

    // ── Quick suggestions ──
    const suggestions = ['Best campaign?', 'Compare campaigns', 'Trends', 'Budget forecast', 'Recommendations', 'Peak hours?'];

    // ── Closed state: FAB ──
    if (!isChatOpen) {
        return (
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-ps-red rounded-full border-2 border-white animate-pulse" />
            </button>
        );
    }

    // ── Open state: Chat Panel ──
    return (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-900 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <div>
                        <h3 className="font-semibold text-white text-sm">Campaign Assistant</h3>
                        <p className="text-[10px] text-gray-400">AI-Powered Analytics</p>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((message, idx) => (
                    <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${message.role === 'user'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'}`}
                        >
                            {message.role === 'assistant' && message.isNew && idx === chatMessages.length - 1 ? (
                                <TypingMessage
                                    message={message}
                                    onComplete={() => {
                                        setChatMessages(prev => prev.map((m, i) => i === idx ? { ...m, isNew: false } : m));
                                    }}
                                    renderMessage={(m, isComplete) => renderMessageContent(m, isComplete)}
                                />
                            ) : (
                                renderMessageContent(message)
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-3 py-2 border-t border-gray-100 flex gap-1.5 overflow-x-auto custom-scrollbar">
                {suggestions.map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            if (isTyping) return;
                            setUserInput(s);
                            setTimeout(() => {
                                const userMessage = { role: 'user', content: s };
                                setChatMessages(prev => [...prev, userMessage]);
                                setIsTyping(true);
                                setTimeout(() => {
                                    const result = analyzeQuery(s);
                                    const aiResponse = { role: 'assistant', content: result.content || result, actions: result.actions, sparklineData: result.sparklineData, comparison: result.comparison, isNew: true };
                                    setChatMessages(prev => [...prev, aiResponse]);
                                    setIsTyping(false);
                                }, 400);
                                setUserInput('');
                            }, 50);
                        }}
                        className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] rounded-full hover:bg-ps-red hover:text-white transition-colors whitespace-nowrap border border-gray-200"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about your campaigns..."
                        disabled={isTyping}
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ps-red placeholder-gray-400 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || isTyping}
                        className="p-2 bg-ps-red text-white rounded-full hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAgent;
