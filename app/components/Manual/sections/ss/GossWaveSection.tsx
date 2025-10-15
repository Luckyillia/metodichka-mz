import React, { useState } from 'react';
import ExamplePhrase from '../../ExamplePhrase';
import ProtectedSection from "@/app/components/Manual/ProtectedSection";
import "@/app/styles/gossWave.css";

const GossWaveSection = () => {
    // Состояния для выбора параметров
    const [selectedCity, setSelectedCity] = useState('Мирный');
    const [selectedHour, setSelectedHour] = useState('23');
    const [selectedMinute, setSelectedMinute] = useState('00');

    // Функция для получения названия больницы в зависимости от города
    const getHospitalName = (city: string) => {
        switch (city) {
            case 'Мирный':
                return 'Областной Клинической Больнице';
            case 'Невский':
                return 'Центральной Городской Больнице';
            case 'Приволжск':
                return 'Центральной Городской Больнице';
            default:
                return 'Областной Клинической Больнице';
        }
    };

    // Функция для получения аббревиатуры больницы
    const getHospitalAbbr = (city: string) => {
        switch (city) {
            case 'Мирный':
                return 'ОКБ';
            case 'Невский':
                return 'ЦГБ-Н';
            case 'Приволжск':
                return 'ЦГБ-П';
            default:
                return 'ОКБ';
        }
    };

    // Функция для получения названия города в винительном падеже (куда? во что?)
    const getCityAdjective = (city: string) => {
        switch (city) {
            case 'Мирный':
                return 'Мирный';
            case 'Невский':
                return 'Невский';
            case 'Приволжск':
                return 'Приволжский';
            default:
                return city;
        }
    };

    // Генерация фраз с учетом выбранных параметров
    const generateInterviewPhrases = () => {
        const hospitalName = getHospitalName(selectedCity);
        const hospitalAbbr = getHospitalAbbr(selectedCity);
        const cityAdjective = getCityAdjective(selectedCity);
        
        return [
            `gov Уважаемые жители Республики Провинция! Хотите помогать людям? Хотите спасать жизни?`,
            `gov Тогда ровно в ${selectedHour}:${selectedMinute} именно Вас мы будем ждать на первом этаже в ${hospitalName} города ${selectedCity}.`,
            `gov Требования: 5 лет проживания в республике, опрятный вид одежды, паспорт, медицинский диплом, действующая медкарта.`,

            `gov У вас есть медицинское образование, но вы не можете найти себе работу?`,
            `gov Поспешите, собеседование в ${cityAdjective} Медицинский Университет при ${hospitalName} города ${selectedCity} началось!`,
            `gov Ждём всех желающих на первом этаже больницы!`,

            `gov Уважаемые жители Республики, поспешите, собеседование в ${hospitalAbbr} города ${selectedCity} продолжается! Ждём опоздавших..`,
            `gov Требования: 5 лет проживания в республике, опрятный вид одежды, паспорт, медицинский диплом, действующая медкарта.`,
            `gov Именно в нашей больнице лучшее оборудование, а также дружный коллектив. Ждём вас на первом этаже больницы!`,

            `gov К сожалению, собеседование в ${cityAdjective} Медицинский Университет при ${hospitalName} города ${selectedCity} подошло к концу!`,
            `gov Если вы не успели попасть на собеседование, вы можете подать электронное заявление на портале Республики.`,
            `gov Наша больница ждёт именно Вас. Не болейте, берегите себя и своих близких!`,

            `gov Технические неполадки.`
        ];
    };

    const generateStreetInterviewPhrases = () => {
        const hospitalName = getHospitalName(selectedCity);
        const hospitalAbbr = getHospitalAbbr(selectedCity);
        const cityAdjective = getCityAdjective(selectedCity);
        
        return [
            `gov Уважаемые жители Республики Провинция! Хотите помогать людям? Хотите спасать жизни?`,
            `gov Тогда ровно в ${selectedHour}:${selectedMinute} именно Вас мы будем ждать на парковке ${hospitalName} города ${selectedCity}.`,
            `gov Требования: 5 лет проживания в республике, опрятный вид одежды, паспорт, медицинский диплом, действующая медкарта.`,

            `gov У вас есть медицинское образование, но вы не можете найти себе работу?`,
            `gov Поспешите, собеседование в ${cityAdjective} Медицинский Университет при ${hospitalName} города ${selectedCity} началось!`,
            `gov Ждём всех желающих на парковке больницы!`,

            `gov Уважаемые жители Республики, поспешите, собеседование в ${hospitalAbbr} города ${selectedCity} продолжается! Ждём опоздавших..`,
            `gov Требования: 5 лет проживания в республике, опрятный вид одежды, паспорт, медицинский диплом, действующая медкарта.`,
            `gov Именно в нашей больнице лучшее оборудование, а также дружный коллектив. Ждём Вас на парковке больницы!`,

            `gov К сожалению, собеседование в ${cityAdjective} Медицинский Университет при ${hospitalName} города ${selectedCity} подошло к концу!`,
            `gov Если Вы не успели попасть на собеседование, Вы можете подать электронное заявление на портале Республики.`,
            `gov Наша больница ждёт именно Вас. Не болейте, берегите себя и своих близких!`,

            `gov Технические неполадки.`
        ];
    };

    return (
        <>
            {/* Панель выбора параметров */}
            <div className="controls-panel">
                <h3 className="controls-panel__title">Настройки объявлений</h3>
                <div className="controls-grid">
                    <div className="control-group control-group--highlight">
                        <label className="control-label">
                            Город проведения
                        </label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="control-select"
                        >
                            <option value="Невский">Невский</option>
                            <option value="Мирный">Мирный</option>
                            <option value="Приволжск">Приволжск</option>
                        </select>
                    </div>
                    <div className="control-group control-group--highlight">
                        <label className="control-label">
                            Часы
                        </label>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="control-select"
                        >
                            {Array.from({length: 24}, (_, i) =>
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                </option>
                            )}
                        </select>
                    </div>
                    <div className="control-group control-group--highlight">
                        <label className="control-label">
                            Минуты
                        </label>
                        <select
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            className="control-select"
                        >
                            <option value="00">00</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                </div>
                <div className="controls-info">
                    <p className="controls-info__text">
                        Выбранные параметры: {selectedCity} в {selectedHour}:{selectedMinute}
                    </p>
                </div>
            </div>

            <div className="warning mb-4">
                <strong>⚠️ Важно:</strong> Перед отправкой сообщения проверьте время и место проведения
            </div>

            <div className="subsection mb-8">
                <h3 className="text-xl font-semibold mb-4">👤 Собеседование (в помещении)</h3>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-medium mb-2">Уведомление (3 раза):</h4>
                        {generateInterviewPhrases().slice(0, 3).map((text: string, index: number) => (
                            <ExamplePhrase key={`interview-pre-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Начало (1 раз):</h4>
                        {generateInterviewPhrases().slice(3, 6).map((text: string, index: number) => (
                            <ExamplePhrase key={`interview-start-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Продолжение (2 раза):</h4>
                        {generateInterviewPhrases().slice(6, 9).map((text: string, index: number) => (
                            <ExamplePhrase key={`interview-continue-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Конец (1 раз):</h4>
                        {generateInterviewPhrases().slice(9, 12).map((text: string, index: number) => (
                            <ExamplePhrase key={`interview-end-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">В случае ошибки:</h4>
                        {generateInterviewPhrases().slice(12).map((text: string, index: number) => (
                            <ExamplePhrase key={`interview-error-${index}`} text={text} type="ss" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="subsection">
                <h3 className="text-xl font-semibold mb-4">👤 Собеседование на улице (на парковке)</h3>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-medium mb-2">Уведомление (3 раза):</h4>
                        {generateStreetInterviewPhrases().slice(0, 3).map((text: string, index: number) => (
                            <ExamplePhrase key={`street-pre-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Начало (1 раз):</h4>
                        {generateStreetInterviewPhrases().slice(3, 6).map((text: string, index: number) => (
                            <ExamplePhrase key={`street-start-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Продолжение (2 раза):</h4>
                        {generateStreetInterviewPhrases().slice(6, 9).map((text: string, index: number) => (
                            <ExamplePhrase key={`street-continue-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Конец (1 раз):</h4>
                        {generateStreetInterviewPhrases().slice(9, 12).map((text: string, index: number) => (
                            <ExamplePhrase key={`street-end-${index}`} text={text} type="ss" />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">В случае ошибки:</h4>
                        {generateStreetInterviewPhrases().slice(12).map((text: string, index: number) => (
                            <ExamplePhrase key={`street-error-${index}`} text={text} type="ss" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GossWaveSection;
