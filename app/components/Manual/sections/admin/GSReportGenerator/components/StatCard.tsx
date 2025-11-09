import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
    return (
        <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
            <div className="text-xs text-purple-300">{label}</div>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
    );
};