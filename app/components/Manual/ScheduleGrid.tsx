import React, { ReactNode } from 'react';

interface ScheduleGridProps {
    children: ReactNode;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ children }) => {
    return (
        <div className="schedule-grid">
            {children}
        </div>
    );
};

export default ScheduleGrid;
