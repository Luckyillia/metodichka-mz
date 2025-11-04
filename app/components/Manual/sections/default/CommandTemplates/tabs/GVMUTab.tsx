import React from 'react';
import { GlobalSettings, GVMUSettings } from '../types';
import ExamplePhrase from '@/app/components/Manual/ExamplePhrase';

// ГВМУ - Главное военно-медицинское управление. 
// Отвечает за организацию медицинского обеспечения вооруженных сил, 
// включая медицинское снабжение, эвакуацию раненых и больных, 
// а также организацию работы военных госпиталей и медицинских пунктов.

interface GVMUTabProps {
    settings: GVMUSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof GVMUSettings, value: string) => void;
}

const GVMUTab: React.FC<GVMUTabProps> = ({ settings, onSettingChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onSettingChange(name as keyof GVMUSettings, value);
    };

    // Должности ГВМУ
    const gvmuPositions = [
        { value: 'Начальник ГВМУ', tag: 'Нач. ГВМУ', rank: 'Генерал-майор медицинской службы' },
        { value: 'Заместитель начальника ГВМУ', tag: 'Зам. нач. ГВМУ', rank: 'Полковник медицинской службы' },
        { value: 'Командир ОВМ', tag: 'Ком. ОВМ', rank: 'Майор медицинской службы' },
        { value: 'Военный врач-хирург', tag: 'ВВХ-ОВМ', rank: 'Капитан медицинской службы' },
        { value: 'Военный врач-терапевт', tag: 'ВВТ-ОВМ', rank: 'Капитан медицинской службы' },
        { value: 'Военный фельдшер', tag: 'ВФ-ОВМ', rank: 'Ст. Лейтенант медицинской службы' },
        { value: 'Военный санитар', tag: 'ВС-ОВМ', rank: 'Лейтенант медицинской службы' }
    ];

    // Генерация представления должности
    const generatePositionInfo = () => {
        const position = gvmuPositions.find(p => p.value === settings.position) || gvmuPositions[0];
        return (
            <div className="p-4 border rounded-lg bg-card mb-6">
                <h4 className="font-medium mb-2">Текущая должность:</h4>
                <p className="text-sm mb-1"><span className="font-medium">Должность:</span> {position.value}</p>
                <p className="text-sm mb-1"><span className="font-medium">ТЭГ:</span> [{position.tag}]</p>
                <p className="text-sm"><span className="font-medium">Звание:</span> {position.rank}</p>
            </div>
        );
    };

    // Генерация биндов
    const generateBinds = () => {
        const position = gvmuPositions.find(p => p.value === settings.position) || gvmuPositions[0];
        const nameParts = settings.fullName.split(' ');
        const lastName = nameParts[0] || 'Фамилия';
        const firstName = nameParts[1]?.[0] || 'И';
        const middleName = nameParts[2]?.[0] || 'О';
        
        const greetingBind = `bind 1 say Здравия желаю, ${position.value}, ${position.rank} ${lastName}.`;
        const uniformBind = `bind 1 do На форме погоны [${position.rank}] и шеврон [${lastName} ${firstName}.${middleName}.] [ВМ-${position.tag}].`;
        
        return (
            <div className="space-y-4">
                <h4 className="font-medium">Бинды:</h4>
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-card">
                        <p className="text-sm text-muted-foreground mb-2">1. Приветствие:</p>
                        <ExamplePhrase text={greetingBind} type="ms" messageType="single" />
                        <ExamplePhrase text={uniformBind} type="ms" messageType="single" />
                        <p className="text-xs text-muted-foreground mt-2">ПОМЕТКА!!! Данный бинд используется только для приветствия военнослужащих.</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-card">
                        <p className="text-sm text-muted-foreground mb-2">2. Пропуск на КПП:</p>
                        <div className="space-y-2">
                            <ExamplePhrase text="bind 2 do В нагрудном кармане лежит пропуск на КПП." type="ms" messageType="single" />
                            <ExamplePhrase text="bind 2 me достав пропуск из кармана, показал его сотруднику" type="ms" messageType="single" />
                            <ExamplePhrase text="bind 3 me убрал пропуск обратно в нагрудный карман" type="ms" messageType="single" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Генерация докладов о транспортировке медикаментов
    const generateMedicineTransportReports = () => {
        const position = gvmuPositions.find(p => p.value === settings.position) || gvmuPositions[0];
        const nameParts = settings.fullName.split(' ');
        const lastName = nameParts[0] || 'Фамилия';
        const firstName = nameParts[1]?.[0] || 'И';
        const middleName = nameParts[2]?.[0] || 'О';
        
        const reports = [
            `r [${position.tag}] Прибыл на загрузку медикаментов. Место загрузки: больница. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Приступил к загрузке медикаментов. Место загрузки: больница. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Выехал с места загрузки. Направляюсь в сторону КПП. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Транспортировка груза проходит успешно. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Подъезжаю к КПП. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Подъехал к месту разгрузки — Военный госпиталь. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Приступил к разгрузке медикаментов. Место разгрузки: Военный госпиталь. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`,
            `r [${position.tag}] Транспортировка медикаментов в Военный госпиталь прошла успешно. Докладывает ${position.rank} ${lastName} ${firstName}.${middleName}.`
        ];

        const militaryHospitalReports = [
            `r [${position.tag}] Выехал на пост Военный госпиталь.`,
            `r [${position.tag}] Заступил на пост Военный госпиталь.`,
            `r [${position.tag}] Продолжаю стоять на посту Военный госпиталь. Вылечено военных: 0.`,
            `r [${position.tag}] Покидаю пост Военный госпиталь.`,
            `r [${position.tag}] Вернулся с поста Военный госпиталь.`
        ];

        const kppReports = [
            `r [${position.tag}] Выехал на пост КПП.`,
            `r [${position.tag}] Заступил на пост КПП.`,
            `r [${position.tag}] Продолжаю стоять на посту КПП. Вылечено военных: 0.`,
            `r [${position.tag}] Покидаю пост КПП.`,
            `r [${position.tag}] Вернулся с поста КПП.`
        ];

        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="font-medium">Поставка медикаментов</h4>
                    <div className="p-4 border rounded-lg bg-card">
                        <p className="text-sm text-muted-foreground">1. Доклады в рацию при транспортировке груза:</p>
                        <div className="space-y-3 mt-2">
                            {reports.map((report, index) => (
                                <ExamplePhrase key={`transport-${index}`} text={report} type="ms" messageType="single" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium">Доклады на постах</h4>
                    <div className="p-4 border rounded-lg bg-card">
                        <p className="text-sm text-muted-foreground">1. Доклады на посту «Военный госпиталь»:</p>
                        <div className="space-y-3 mt-2">
                            {militaryHospitalReports.map((report, index) => (
                                <ExamplePhrase key={`hospital-${index}`} text={report} type="ms" messageType="single" />
                            ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-4">2. Доклады на посту «КПП»:</p>
                        <div className="space-y-3 mt-2">
                            {kppReports.map((report, index) => (
                                <ExamplePhrase key={`kpp-${index}`} text={report} type="ms" messageType="single" />
                            ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3">ПОМЕТКА!!! Доклады в рацию с момента заступления на пост делаются каждые 10 минут.</p>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Должность:</label>
                    <select
                        name="position"
                        value={settings.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                        {gvmuPositions.map((pos) => (
                            <option key={pos.value} value={pos.value}>
                                {pos.value}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">ФИО:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={settings.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="Иванов Иван Иванович"
                    />
                </div>
            </div>

            {generatePositionInfo()}
            
            <div className="space-y-8">
                {generateBinds()}
                {generateMedicineTransportReports()}
            </div>
            <div className="subsection">
                <h3>📂 Материалы для ГВМУ</h3>
                <p>Материалы для ГВМУ были взяты с официального сайта ГВМУ: <a
                    href="https://forum.gtaprovince.ru/topic/999958-glavnoe-voenno-medicinskoe-upravlenie-ministerstva-oborony-respubliki-provinciya/"
                    className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
                <div className="warning mt-4">
                    <strong>⚠️ Важно:</strong> Если найдете ошибку прошу собщить лидеру.
                </div>
            </div>
        </div>
    );
};

export default GVMUTab;
