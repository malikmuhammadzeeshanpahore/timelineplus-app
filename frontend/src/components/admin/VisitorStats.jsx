import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiActivity, FiClock, FiCalendar, FiUsers, FiEye } from 'react-icons/fi';

const VisitorStats = ({ stats, loading }) => {
    if (loading || !stats) return <div className="text-center p-5">Loading analytics...</div>;

    const cards = [
        { title: 'Active (5m)', value: stats.active, icon: <FiActivity />, color: '#10b981' }, // Green
        { title: 'Last 1 Min', value: stats.last1Min, icon: <FiClock />, color: '#3b82f6' },   // Blue
        { title: 'Last 60 Min', value: stats.last60Min, icon: <FiClock />, color: '#8b5cf6' },  // Purple
        { title: 'Today Visits', value: stats.today, icon: <FiCalendar />, color: '#f59e0b' },   // Orange
        { title: 'Daily (24h)', value: stats.daily, icon: <FiClock />, color: '#ea580c' },      // Dark Orange
        { title: 'Weekly Visits', value: stats.weekly, icon: <FiCalendar />, color: '#ec4899' }, // Pink
        { title: 'Monthly Visits', value: stats.monthly, icon: <FiCalendar />, color: '#6366f1' }, // Indigo
        { title: 'Unique Visitors', value: stats.unique, icon: <FiUsers />, color: '#06b6d4' },    // Cyan
        { title: 'Returning Visitors', value: stats.returning, icon: <FiUsers />, color: '#8b5cf6' }, // Violet
        { title: 'Total All Time', value: stats.total, icon: <FiEye />, color: '#18181b' },      // Black
    ];

    // Format graph data defaults if empty
    const graphData = stats.graphData && stats.graphData.length > 0
        ? stats.graphData
        : [{ date: 'No Data', count: 0 }];

    return (
        <div className="space-y-6">
            <h2 className="heading mb-4 text-xl flex items-center gap-2"><FiActivity /> Visitor Analytics</h2>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                {cards.map((card, i) => (
                    <div key={i} className="glass-card" style={{ padding: '15px', borderTop: `3px solid ${card.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px' }}>{card.title}</p>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
                                    {card.value?.toLocaleString()}
                                </h3>
                            </div>
                            <div style={{ color: card.color, fontSize: '1.2rem', opacity: 0.8 }}>{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graph Section */}
            <div className="glass-card" style={{ padding: '20px', minHeight: '300px' }}>
                <h3 className="text-lg font-bold mb-4 text-main">Traffic Overview (Last 7 Days)</h3>
                <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff6600" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ff6600" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#666" style={{ fontSize: '0.8rem' }} />
                            <YAxis stroke="#666" style={{ fontSize: '0.8rem' }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <Tooltip
                                contentStyle={{ background: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#ff6600', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#ff6600" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VisitorStats;
