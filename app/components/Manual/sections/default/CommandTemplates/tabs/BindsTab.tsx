import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { BindsSettings, GlobalSettings } from '../types';

interface BindsTabProps {
    settings: BindsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof BindsSettings, value: string) => void;
}

// Генерация биндов для мужского персонажа
const generateMaleBinds = (settings: BindsSettings, globalSettings: GlobalSettings) => {
    const { firstName, lastName, position } = settings;
    const { city, doctorTag } = globalSettings;
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';

    return {
        'Представление': [
            `bind 1 say Здравствуйте, меня зовут ${firstName} ${lastName}, я сотрудник ${hospital} г. ${city}.`,
            `bind 1 do На груди висит бейдж: [${hospital} г. ${city} | ${position} | ${firstName} ${lastName}].`,
            `bind 2 todo Что вас беспокоит?*посмотрев на пациента`
        ],
        'Осмотр пациента': [
            `bind 3 say Сейчас я Вас осмотрю.`,
            `bind 3 me тщательно осматривает пациента и ставит ему диагноз`,
            `bind 3 do Диагноз поставлен.`
        ],
        'Выдача лекарства': [
            `bind 4 do На плече висит медицинская сумка.`,
            `bind 4 me открыв сумку, достал нужный препарат`,
            `bind 5 do Препарат в руке.`,
            `bind 5 me передал нужный препарат пациенту`,
            `bind 6 chatbox helpmed`
        ],
        'Прощание': [
            `bind 7 say Всего доброго, не болейте!)`
        ],
        'Отказ пациента': [
            `bind 8 say Хорошо, тогда лечитесь в стационаре. Всего вам доброго!)`
        ],
        'Самолечение': [
            `bind 0 do Через плечо надета мед. сумка с множеством препаратов.`,
            `bind 0 me открыв сумку, достал из неё необходимое лекарство и употребил его`,
            `bind 0 chatbox helpmed`
        ],
        'АСМП: Принятие вызова': [
            `bind - do Рация висит на поясе.`,
            `bind - me снял рацию с пояса и связался с диспетчером`,
            `bind = do Связь с диспетчером установлена, вызов принят.`,
            `bind = chatbox to`
        ],
        'АСМП: Мегафон': [
            `bind num_1 do Рация от мегафона на панели автомобиля.`,
            `bind num_1 me снял рацию с панели и сказал в неё`,
            `bind num_1 s [Мегафон] Водители! Уступаем дорогу карете скорой помощи!`
        ],
        'АСМП: Лечение в карете': [
            `bind 9 do Слева от сотрудника находится столик с препаратами.`,
            `bind 9 me берет со столика нужный препарат, после чего передает его пациенту`,
            `bind 9 up chatbox heal`
        ],
        'АСМП: Перекладывание на каталку': [
            `bind num_2 me аккуратно взяв пациента, положил его на каталку`,
            `bind num_2 do Пациент лежит на каталке.`
        ],
        'АСМП: Госпитализация (АСМП)': [
            `bind num_3 do На приборной панели АСМП есть небольшая белая кнопка с надписью "Вызов врача".`,
            `bind num_3 me протянувшись рукой к кнопке, нажал на неё, после чего открыл дверь`,
            `bind num_3 up do Через некоторое время к двери подошли сотрудники приёмного отделения.`,
            `bind num_3 up me передал каталку с пострадавшим сотрудникам и закрыл дверь в больницу`
        ],
        'АСМП: Госпитализация (вертолёт)': [
            `bind num_6 do На приборной панели вертолёта есть небольшая белая кнопка с надписью "Вызов врача".`,
            `bind num_6 me протянувшись рукой к кнопке, нажал на неё, после чего открыл дверь`,
            `bind num_6 up do Через некоторое время к двери подошли сотрудники приёмного отделения.`,
            `bind num_6 up me передал каталку с пострадавшим сотрудникам и закрыл дверь в больницу`
        ]
    };
};

// Генерация биндов для женского персонажа
const generateFemaleBinds = (settings: BindsSettings, globalSettings: GlobalSettings) => {
    const { firstName, lastName, position } = settings;
    const { city, doctorTag } = globalSettings;
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';

    return {
        'Представление': [
            `bind 1 say Здравствуйте, меня зовут ${firstName} ${lastName}, я сотрудница ${hospital} г. ${city}.`,
            `bind 1 do На груди висит бейдж: [${hospital} г. ${city} | ${position} | ${firstName} ${lastName}].`,
            `bind 2 todo Что вас беспокоит?*посмотрев на пациента`
        ],
        'Осмотр пациента': [
            `bind 3 say Сейчас я Вас осмотрю.`,
            `bind 3 me тщательно осматривает пациента и ставит ему диагноз`,
            `bind 3 do Диагноз поставлен.`
        ],
        'Выдача лекарства': [
            `bind 4 do На плече висит медицинская сумка.`,
            `bind 4 me открыв сумку, достала нужный препарат`,
            `bind 5 do Препарат в руке.`,
            `bind 5 me передала нужный препарат пациенту`,
            `bind 6 chatbox helpmed`
        ],
        'Прощание': [
            `bind 7 say Всего доброго, не болейте!)`
        ],
        'Отказ пациента': [
            `bind 8 say Хорошо, тогда лечитесь в стационаре. Всего вам доброго!)`
        ],
        'Самолечение': [
            `bind 0 do Через плечо надета мед. сумка с множеством препаратов.`,
            `bind 0 me открыв сумку, достала из неё необходимое лекарство и употребила его`,
            `bind 0 chatbox helpmed`
        ],
        'АСМП: Принятие вызова': [
            `bind - do Рация висит на поясе.`,
            `bind - me сняла рацию с пояса и связалась с диспетчером`,
            `bind = do Связь с диспетчером установлена, вызов принят.`,
            `bind = chatbox to`
        ],
        'АСМП: Мегафон': [
            `bind num_1 do Рация от мегафона на панели автомобиля.`,
            `bind num_1 me сняла рацию с панели и сказала в неё`,
            `bind num_1 s [Мегафон] Водители! Уступаем дорогу карете скорой помощи!`
        ],
        'АСМП: Лечение в карете': [
            `bind 9 do Слева от сотрудника находится столик с препаратами.`,
            `bind 9 me берёт со столика нужный препарат, после чего передаёт его пациенту`,
            `bind 9 up chatbox heal`
        ],
        'АСМП: Перекладывание на каталку': [
            `bind num_2 me аккуратно взяв пациента, положила его на каталку`,
            `bind num_2 do Пациент лежит на каталке.`
        ],
        'АСМП: Госпитализация (АСМП)': [
            `bind num_3 do На приборной панели АСМП есть небольшая белая кнопка с надписью "Вызов врача".`,
            `bind num_3 me протянувшись рукой к кнопке, нажала на неё, после чего открыла дверь`,
            `bind num_3 up do Через некоторое время к двери подошли сотрудники приёмного отделения.`,
            `bind num_3 up me передала каталку с пострадавшим сотрудникам и закрыла дверь в больницу`
        ],
        'АСМП: Госпитализация (вертолёт)': [
            `bind num_6 do На приборной панели вертолёта есть небольшая белая кнопка с надписью "Вызов врача".`,
            `bind num_6 me протянувшись рукой к кнопке, нажала на неё, после чего открыла дверь`,
            `bind num_6 up do Через некоторое время к двери подошли сотрудники приёмного отделения.`,
            `bind num_6 up me передала каталку с пострадавшим сотрудникам и закрыла дверь в больницу`
        ]
    };
};

const BindsTab: React.FC<BindsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = settings.gender === 'male'
        ? generateMaleBinds(settings, globalSettings)
        : generateFemaleBinds(settings, globalSettings);

    return (
        <>
            <div className="mb-4">
                <h3>🎯 Основные бинды</h3>

                {/* Локальные настройки для биндов */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium mb-2">Гендер:</label>
                        <select
                            value={settings.gender}
                            onChange={(e) => onSettingChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Имя:</label>
                        <input
                            type="text"
                            value={settings.firstName}
                            onChange={(e) => onSettingChange('firstName', e.target.value)}
                            placeholder="Имя"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Фамилия:</label>
                        <input
                            type="text"
                            value={settings.lastName}
                            onChange={(e) => onSettingChange('lastName', e.target.value)}
                            placeholder="Фамилия"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Должность:</label>
                        <input
                            type="text"
                            value={settings.position}
                            onChange={(e) => onSettingChange('position', e.target.value)}
                            placeholder="Должность"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Стационарное лечение */}
            <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">🏥 Стационарное лечение пациента</h4>
                <div className="space-y-4">
                    {Object.entries(commands).map(([bindName, bindLines]) => (
                        <div key={bindName} className="p-4 border border-border rounded-lg">
                            <h5 className="font-medium mb-3 text-sm text-muted-foreground">{bindName}</h5>
                            <div className="space-y-2">
                                {bindLines.map((line: string, index: number) => (
                                    <ExamplePhrase
                                        key={`${bindName}-${index}`}
                                        text={line}
                                        messageType={"single"}
                                        type={"ms"}
                                        maxLength={200}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BindsTab;
