import React from 'react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, highlight }) => (
  <div className={`modern-card p-6 ${highlight ? 'border-2 border-green-500/30' : ''}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);