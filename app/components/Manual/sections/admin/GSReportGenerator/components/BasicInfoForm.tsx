import React from 'react';
import { INPUT_CLASSES } from '../constants';

interface BasicInfoFormProps {
    gsNickname: string;
    organization: string;
    dateFrom: string;
    dateTo: string;
    onGsNicknameChange: (value: string) => void;
    onOrganizationChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
    gsNickname,
    organization,
    dateFrom,
    dateTo,
    onGsNicknameChange,
    onOrganizationChange,
    onDateFromChange,
    onDateToChange
}) => {
    return (
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600/40 pb-2">
                Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Никнейм ГС</label>
                    <input
                        type="text"
                        value={gsNickname}
                        onChange={(e) => onGsNicknameChange(e.target.value)}
                        placeholder="Polter_Sokirovskiy"
                        className={INPUT_CLASSES.base}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Организация</label>
                    <input
                        type="text"
                        value={organization}
                        onChange={(e) => onOrganizationChange(e.target.value)}
                        placeholder="МЗ"
                        className={INPUT_CLASSES.base}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Период с</label>
                    <input
                        type="text"
                        value={dateFrom}
                        onChange={(e) => onDateFromChange(e.target.value)}
                        placeholder="25.09.25"
                        className={INPUT_CLASSES.base}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Период по</label>
                    <input
                        type="text"
                        value={dateTo}
                        onChange={(e) => onDateToChange(e.target.value)}
                        placeholder="25.10.25"
                        className={INPUT_CLASSES.base}
                    />
                </div>
            </div>
        </div>
    );
};