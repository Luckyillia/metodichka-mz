import React from 'react';
import '@/app/styles/careerPath.css'

interface CareerPathProps {
    rank: string;
    requirements: string[];
    step: number;
    status?: 'completed' | 'in-progress' | 'locked' | 'default';
    isLastStep?: boolean;
}

const CareerPath: React.FC<CareerPathProps> = ({
                                                   rank,
                                                   requirements,
                                                   step,
                                                   status = 'default',
                                                   isLastStep = false
                                               }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'in-progress':
                return '⏳';
            case 'locked':
                return '🔒';
            default:
                return '📋';
        }
    };

    return (
        <div className={`career-path ${status}`}>
            <div className="career-path-timeline">
                <div className="career-path-step">
                    {step}
                </div>
                {!isLastStep && (
                    <div className="career-path-connector"></div>
                )}
            </div>

            <div className="career-path-content">
                <h4 className="career-path-rank">{rank}</h4>
                <ul className="career-path-requirements">
                    {requirements.map((req, index) => (
                        <li key={index} className="career-path-requirement">
                            <span className="career-path-requirement-icon">
                                {getStatusIcon(status)}
                            </span>
                            <span className="career-path-requirement-text">{req}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CareerPath;
