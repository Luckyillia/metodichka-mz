import React from 'react';
import '@/app/styles/protocolCard.css'


interface ProtocolCardProps {
    title: string;
    steps: string[];
    level: 'high' | 'critical';
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ title, steps, level }) => {
    const getIcon = (level: string) => {
        return level === 'high' ? '⚠️' : '🔥';
    };

    const getPriorityClass = (level: string) => {
        return level === 'high' ? 'high-priority' : 'critical-priority';
    };

    return (
        <div className={`protocol-card ${getPriorityClass(level)}`}>
            <div className="protocol-header">
                <span className="protocol-icon">{getIcon(level)}</span>
                <h4 className="protocol-title">{title}</h4>
            </div>
            <ol className="protocol-steps">
                {steps.map((step, index) => (
                    <li key={index} className="protocol-step">
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ProtocolCard;
