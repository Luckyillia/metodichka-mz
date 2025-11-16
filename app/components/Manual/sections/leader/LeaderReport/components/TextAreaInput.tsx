import React from 'react';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4 
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-input rounded-md bg-background"
    />
  </div>
);