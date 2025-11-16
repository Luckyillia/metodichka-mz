import React from 'react';
import { WarningItem } from '../types';

interface WarningListProps {
  items: WarningItem[];
  onChange: (items: WarningItem[]) => void;
}

export const WarningList: React.FC<WarningListProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    onChange([...items, { nickname: '', reason: '' }]);
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (index: number, field: 'nickname' | 'reason', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onChange(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={item.nickname}
            onChange={(e) => handleChange(index, 'nickname', e.target.value)}
            placeholder="Nick_Name"
            className="px-3 py-2 border border-input rounded-md bg-background"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.reason}
              onChange={(e) => handleChange(index, 'reason', e.target.value)}
              placeholder="Причина выговора"
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
            />
            <button
              onClick={() => handleRemove(index)}
              className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
      >
        + Добавить выговор
      </button>
    </>
  );
};