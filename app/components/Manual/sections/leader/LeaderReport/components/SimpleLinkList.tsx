import React from 'react';
import { InterviewItem } from '../types';

interface SimpleLinkListProps {
  items: InterviewItem[];
  onChange: (items: InterviewItem[]) => void;
  placeholder?: string;
  addButtonText?: string;
}

export const SimpleLinkList: React.FC<SimpleLinkListProps> = ({ 
  items, 
  onChange, 
  placeholder, 
  addButtonText 
}) => {
  const handleAdd = () => {
    onChange([...items, { link: '' }]);
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].link = value;
    onChange(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item.link}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
          />
          <button
            onClick={() => handleRemove(index)}
            className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
      >
        {addButtonText || '+ Добавить'}
      </button>
    </>
  );
};