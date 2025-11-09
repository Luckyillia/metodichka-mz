import React from 'react';
import { ItemType } from '../types';
import { INPUT_CLASSES, BUTTON_CLASSES } from '../constants';

interface ListItemEditorProps {
    items: any[];
    onAdd: (cityIndex: number, field: string, template: any) => void;
    onRemove: (cityIndex: number, field: string, itemIndex: number) => void;
    onChange: (cityIndex: number, field: string, itemIndex: number, itemField: string, value: string) => void;
    itemType: ItemType;
    cityIndex: number;
    field: string;
}

export const ListItemEditor: React.FC<ListItemEditorProps> = ({
    items,
    onAdd,
    onRemove,
    onChange,
    itemType,
    cityIndex,
    field
}) => {
    const getTemplate = () => {
        switch (itemType) {
            case 'link':
                return { link: '' };
            case 'nameLink':
                return { name: '', link: '' };
            case 'warning':
                return { nickname: '', reason: '' };
        }
    };

    return (
        <div>
            {items.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            {itemType === 'link' && (
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                    placeholder="https://..."
                                    className={INPUT_CLASSES.listItem}
                                />
                            )}
                            {itemType === 'nameLink' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'name', e.target.value)}
                                        placeholder="Название"
                                        className={INPUT_CLASSES.listItem}
                                    />
                                    <input
                                        type="text"
                                        value={item.link}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                        placeholder="https://..."
                                        className={INPUT_CLASSES.listItem}
                                    />
                                </>
                            )}
                            {itemType === 'warning' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.nickname}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'nickname', e.target.value)}
                                        placeholder="Nick_Name"
                                        className={INPUT_CLASSES.listItem}
                                    />
                                    <input
                                        type="text"
                                        value={item.reason}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'reason', e.target.value)}
                                        placeholder="Причина"
                                        className={INPUT_CLASSES.listItem}
                                    />
                                </>
                            )}
                            <button
                                onClick={() => onRemove(cityIndex, field, idx)}
                                className="px-2 py-2 bg-gray-800/70 text-gray-200 rounded-lg hover:bg-gray-700/70 transition-colors text-xs border border-gray-600/50 flex-shrink-0 hover:border-gray-500/50"
                                title="Удалить"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 py-2">Нет данных</p>
            )}
            <button
                onClick={() => onAdd(cityIndex, field, getTemplate())}
                className={BUTTON_CLASSES.add}
            >
                + Добавить
            </button>
        </div>
    );
};