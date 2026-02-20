import React from 'react';
import EngagementHeatmap from './EngagementHeatmap';
import DeviceChart from './DeviceChart';
import InsightsPanel from './InsightsPanel';

const InsightsView = ({ heatmapData, deviceData, insights }) => {
    return (
        <>
            {/* Heatmap — full width */}
            <div className="mb-8">
                <EngagementHeatmap data={heatmapData} />
            </div>

            {/* Device Analytics + Smart Insights — side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DeviceChart data={deviceData} />
                <InsightsPanel insights={insights} />
            </div>
        </>
    );
};

export default InsightsView;
