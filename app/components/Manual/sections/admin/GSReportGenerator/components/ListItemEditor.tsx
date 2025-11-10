import React from 'react';
import { ItemType } from '../types';

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
    const getTemplate = (): any => {
        switch (itemType) {
            case 'link':
                return { link: '' };
            case 'nameLink':
                return { name: '', link: '' };
            case 'warning':
                return { nickname: '', reason: '' };
            default:
                return {};
        }
    };

    return (
        <div>
            {items.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            {itemType === 'link' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.link}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => onRemove(cityIndex, field, idx)}
                                        className="px-2 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs border border-red-500/30 flex-shrink-0"
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                            {itemType === 'nameLink' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'name', e.target.value)}
                                        placeholder="Название"
                                        className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="text"
                                        value={item.link}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => onRemove(cityIndex, field, idx)}
                                        className="px-2 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs border border-red-500/30 flex-shrink-0"
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                            {itemType === 'warning' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.nickname}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'nickname', e.target.value)}
                                        placeholder="Никнейм"
                                        className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="text"
                                        value={item.reason}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'reason', e.target.value)}
                                        placeholder="Причина"
                                        className="flex-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => onRemove(cityIndex, field, idx)}
                                        className="px-2 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs border border-red-500/30 flex-shrink-0"
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground py-2">Нет данных</p>
            )}
            <button
                onClick={() => onAdd(cityIndex, field, getTemplate())}
                className="mt-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-xs border border-green-500/30 font-medium flex items-center gap-1"
            >
                + Добавить
            </button>
        </div>
    );
};

export default ListItemEditor;