import React from 'react';
import { StaffEvaluation } from '../types';

interface EvaluationListProps {
  items: StaffEvaluation[];
  onChange: (items: StaffEvaluation[]) => void;
}

export const EvaluationList: React.FC<EvaluationListProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    onChange([...items, { nickname: '', rating: '', comment: '' }]);
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (index: number, field: keyof StaffEvaluation, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onChange(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            value={item.nickname}
            onChange={(e) => handleChange(index, 'nickname', e.target.value)}
            placeholder="Nick_Name"
            className="px-3 py-2 border border-input rounded-md bg-background"
          />
          <input
            type="text"
            value={item.rating}
            onChange={(e) => handleChange(index, 'rating', e.target.value)}
            placeholder="8/10"
            className="px-3 py-2 border border-input rounded-md bg-background"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.comment}
              onChange={(e) => handleChange(index, 'comment', e.target.value)}
              placeholder="Комментарий"
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
        + Добавить оценку
      </button>
    </>
  );
};