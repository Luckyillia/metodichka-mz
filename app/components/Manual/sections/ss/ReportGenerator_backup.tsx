import React, { useState, useEffect } from 'react';
import ExamplePhrase from '../../ExamplePhrase';
import ProtectedSection from "../../ProtectedSection";
import "@/app/styles/reportGenerator.css";

// Define the position type for medical faction
type Position =
    | 'Заведующий отделением'
    | 'Заведующий отделением | Командир ОВМ ГВ-МУ'
    | 'Заведующий отделением | Заместитель Начальника СА'
    | 'Заместитель главного врача'
    | 'Заместитель главного врача | Начальник ИМУ'
    | 'Заместитель главного врача | Заместитель Начальника ГВ-МУ'
    | 'Заместитель главного врача | Начальник СА'
    | 'Главный Заместитель главного врача';

const ReportGenerator = () => {
    const [position, setPosition] = useState<Position>('Заведующий отделением');
    const [fullName, setFullName] = useState('');
    const [branch, setBranch] = useState<'ЦГБ-П' | 'ОКБ-М' | 'ЦГБ-Н'>('ЦГБ-П');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Данные для различных должностей
    const [interviews, setInterviews] = useState([{ link: '' }]);
    const [lecturesMZ, setLecturesMZ] = useState([{ link: '' }]);
    const [lecturesMO, setLecturesMO] = useState([{ link: '' }]);
    const [trainings, setTrainings] = useState([{ link: '' }]);
    const [eventsWithOrg, setEventsWithOrg] = useState([{ link: '' }]);
    const [eventsWithoutPost, setEventsWithoutPost] = useState([{ link: '' }]);
    const [interviewsAttendance, setInterviewsAttendance] = useState([{ link: '' }]);
    const [patrolCity, setPatrolCity] = useState([{ minutes: 0, link: '' }]);
    const [patrolAir, setPatrolAir] = useState([{ minutes: 0, link: '' }]);
    const [postAny, setPostAny] = useState([{ minutes: 0, link: '' }]);
    const [postGVMU, setPostGVMU] = useState([{ minutes: 0, link: '' }]);

    // Видимые разделы и требования в зависимости от должности
    const positionRequirements: Record<Position, {
        interviews?: number;
        lecturesMZ?: number;
        lecturesMO?: number;
        trainings?: number;
        eventsWithOrg?: number;
        eventsWithoutPost?: number;
        interviewsAttendance?: number;
        patrolCity?: number;
        patrolAir?: number;
        postAny?: number;
        postGVMU?: number;
    }> = {
        'Заведующий отделением': {
            lecturesMZ: 8,
            trainings: 6,
            eventsWithOrg: 1,
            eventsWithoutPost: 3,
            interviewsAttendance: 2,
            patrolCity: 60,
            postAny: 60
        },
        'Заведующий отделением | Командир ОВМ ГВ-МУ': {
            lecturesMZ: 3,
            lecturesMO: 3,
            trainings: 5,
            eventsWithOrg: 1,
            eventsWithoutPost: 2,
            interviewsAttendance: 1,
            postGVMU: 60
        },
        'Заведующий отделением | Заместитель Начальника СА': {
            lecturesMZ: 6,
            trainings: 4,
            eventsWithOrg: 1,
            eventsWithoutPost: 2,
            interviewsAttendance: 1,
            patrolAir: 60 // 2x30 minutes
        },
        'Заместитель главного врача': {
            interviews: 1,
            lecturesMZ: 8,
            trainings: 4,
            eventsWithOrg: 1,
            eventsWithoutPost: 4,
            patrolCity: 60
        },
        'Заместитель главного врача | Начальник ИМУ': {
            interviews: 1,
            lecturesMZ: 9,
            trainings: 5,
            eventsWithOrg: 1,
            eventsWithoutPost: 2,
            patrolCity: 30,
            postAny: 30
        },
        'Заместитель главного врача | Заместитель Начальника ГВ-МУ': {
            interviews: 1,
            lecturesMZ: 3,
            lecturesMO: 3,
            trainings: 5,
            eventsWithOrg: 1,
            eventsWithoutPost: 2,
            postGVMU: 30
        },
        'Заместитель главного врача | Начальник СА': {
            interviews: 1,
            lecturesMZ: 5,
            trainings: 3,
            eventsWithOrg: 1,
            eventsWithoutPost: 2,
            patrolAir: 30
        },
        'Главный Заместитель главного врача': {
            interviews: 2,
            lecturesMZ: 9,
            eventsWithOrg: 1,
            eventsWithoutPost: 3,
            patrolCity: 30
        }
    };

    // Helper function to check if a section is visible for current position
    const isSectionVisible = ({sectionName}: { sectionName: any }) => {
        return visibleSections[position]?.includes(sectionName) || false;
    };

    // Генерация дат по умолчанию (текущая неделя)
    useEffect(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Воскресенье предыдущей недели
        const end = new Date(today);
        end.setDate(today.getDate() + (6 - today.getDay())); // Суббота текущей недели

        setStartDate(formatDate({date: start}));
        setEndDate(formatDate({date: end}));
    }, []);

    const formatDate = ({date}: { date: any }) => {
        return date.toLocaleDateString('ru-RU');
    };

    const handleAddItem = ({setter, currentItems, template}: { setter: any, currentItems: any, template: any }) => {
        setter([...currentItems, template]);
    };

    const handleRemoveItem = ({setter, currentItems, index}: { setter: any, currentItems: any, index: any }) => {
        if (currentItems.length === 1) return;
        const newItems = [...currentItems];
        newItems.splice(index, 1);
        setter(newItems);
    };

    const handleItemChange = ({setter, currentItems, index, field, value}: {
        setter: any,
        currentItems: any,
        index: any,
        field: any,
        value: any
    }) => {
        const newItems = [...currentItems];
        newItems[index][field] = value;
        setter(newItems);
    };

    const generateReport = () => {
        const vrioPrefix = isVrio ? 'ВрИО ' : '';
        let report = `Маршалу Республики Провинция\n`;
        report += `Начальнику Генерального Штаба\n`;
        report += `Гуду К.И.\n`;
        report += `От "${vrioPrefix}${position}" "${fullName}"\n\n`;

        report += `Я, "${vrioPrefix}${position}", "${fullName}", докладываю о состоянии несения службы и выполненной мной работе за промежуток времени с ${startDate} по ${endDate}. За данный промежуток времени мною был выполнен следующий объём работ:\n\n`;

        report += `Отработано часов в онлайн: ${onlineHours}\n\n`;

        // Собеседования
        if (interviews.length > 0 && interviews[0].date) {
            report += `Собеседования:\n`;
            interviews.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, тип: ${item.type || 'не указано'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Мероприятия
        if (events.length > 0 && events[0].date) {
            report += `Мероприятия:\n`;
            events.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, количество: 1 - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Лекции
        if (lectures.length > 0 && lectures[0].date) {
            report += `Лекции:\n`;
            lectures.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, количество: 1 - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Дополнительные поля в зависимости от должности
        if (position === 'Начальник Гарнизона') {
            report += `Количество военнослужащих контрактной службы:\n`;
            report += `Прибыло: ${contractStats.arrived}, уволилось: ${contractStats.left}\n`;
            report += `Текущее количество: ${contractStats.current}\n\n`;
        }

        if (position === 'Начальник по Военной Профессиональной Подготовке') {
            report += `Количество военнослужащих срочной службы: ${conscriptStats.current}\n\n`;
        }

        if (position === 'Начальник Штаба') {
            report += `Выданные наказания:\n`;
            report += `Контрактная служба: ${penalties.contract}\n`;
            report += `Срочная служба: ${penalties.conscript}\n\n`;
        }

        if (position.includes('Командир') || position.includes('Заместитель')) {
            report += `Статистика подразделения:\n`;
            report += `Ушло: ${divisionStats.left}, прибыло: ${divisionStats.arrived}, текущее количество: ${divisionStats.current}\n\n`;
        }

        // Строевая подготовка
        if (drills.length > 0 && drills[0].date) {
            report += `Строевая подготовка:\n`;
            drills.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Учения
        if (exercises.length > 0 && exercises[0].date) {
            report += `Учения:\n`;
            exercises.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Учебные стрельбы
        if (shootings.length > 0 && shootings[0].date) {
            report += `Учебные стрельбы:\n`;
            shootings.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Тренировки
        if (trainings.length > 0 && trainings[0].date) {
            report += `Тренировки:\n`;
            trainings.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Посещение мероприятий (теперь объединено: или у лидера, или на ГРП)
        if (attendances.length > 0 && attendances[0].link) {
            attendances.forEach(item => {
                if (item.link) {
                    if (item.type === 'leader') {
                        report += `Присутствие на качественном мероприятии от лидера: ${item.link}\n`;
                    } else if (item.type === 'grp') {
                        report += `Присутствие на ГРП: ${item.link}\n`;
                    }
                }
            });
            report += `\n`;
        }

        report += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n`;
        report += `Подпись: ${signature || fullName}\n`;

        return report;
    };

    const renderPositionSpecificFields = () => {
        switch(position) {
            case 'Начальник Гарнизона':
                return (
                    <div className="subsection">
                        <h3>Статистика контрактной службы</h3>
                        <div className="input-group">
                            <label>Прибыло военнослужащих:</label>
                            <input
                                type="number"
                                value={contractStats.arrived}
                                onChange={(e) => setContractStats({...contractStats, arrived: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Уволилось военнослужащих:</label>
                            <input
                                type="number"
                                value={contractStats.left}
                                onChange={(e) => setContractStats({...contractStats, left: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={contractStats.current}
                                onChange={(e) => setContractStats({...contractStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Начальник Штаба':
                return (
                    <div className="subsection">
                        <h3>Выданные наказания</h3>
                        <div className="input-group">
                            <label>Контрактная служба:</label>
                            <input
                                type="number"
                                value={penalties.contract}
                                onChange={(e) => setPenalties({...penalties, contract: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Срочная служба:</label>
                            <input
                                type="number"
                                value={penalties.conscript}
                                onChange={(e) => setPenalties({...penalties, conscript: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Начальник по Военной Профессиональной Подготовке':
                return (
                    <div className="subsection">
                        <h3>Статистика срочной службы</h3>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={conscriptStats.current}
                                onChange={(e) => setConscriptStats({...conscriptStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Командир Подразделения':
            case 'Заместитель Командира Подразделения':
                return (
                    <div className="subsection">
                        <h3>Статистика подразделения</h3>
                        <div className="input-group">
                            <label>Ушло (ОЧС, ПСЖ, Перевод):</label>
                            <input
                                type="number"
                                value={divisionStats.left}
                                onChange={(e) => setDivisionStats({...divisionStats, left: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Пришло:</label>
                            <input
                                type="number"
                                value={divisionStats.arrived}
                                onChange={(e) => setDivisionStats({...divisionStats, arrived: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={divisionStats.current}
                                onChange={(e) => setDivisionStats({...divisionStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="subsection">
                <h3>Основная информация</h3>
                <div className="input-group">
                    <label>Должность:</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                        <option value="Начальник Гарнизона">Начальник Гарнизона</option>
                        <option value="Начальник Штаба">Начальник Штаба</option>
                        <option value="Начальник Штаба Гражданской Обороны">Начальник Штаба Гражданской Обороны
                        </option>
                        <option value="Начальник по Военной Профессиональной Подготовке">Начальник по Военной
                            Профессиональной Подготовке
                        </option>
                        <option value="Командир Подразделения">Командир Подразделения</option>
                        <option value="Заместитель Командира Подразделения">Заместитель Командира Подразделения
                        </option>
                    </select>
                </div>
                <div className="input-group">
                <label>ФИО:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Введите ваше ФИО"
                    />
                </div>
                <div className="input-group">
                    <label>ВрИО:</label>
                    <input
                        type="checkbox"
                        checked={isVrio}
                        onChange={(e) => setIsVrio(e.target.checked)}
                    />
                </div>
                <div className="input-group">
                    <label>Подпись:</label>
                    <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Введите подпись (по умолчанию ФИО)"
                    />
                </div>
                <div className="input-group">
                    <label>Период с:</label>
                    <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="дд.мм.гггг"
                    />
                </div>
                <div className="input-group">
                    <label>Период по:</label>
                    <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="дд.мм.гггг"
                    />
                </div>
                <div className="input-group">
                    <label>Отработанные часы:</label>
                    <input
                        type="number"
                        value={onlineHours}
                        onChange={(e) => setOnlineHours(parseInt(e.target.value) || 0)}
                        min="21"
                    />
                </div>
            </div>

            {renderPositionSpecificFields()}

            {isSectionVisible({sectionName: 'interviews'}) && (
                <div className="subsection">
                    <h3>Собеседования</h3>
                    {interviews.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setInterviews,
                                    currentItems: interviews,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.type}
                                onChange={(e) => handleItemChange({
                                    setter: setInterviews,
                                    currentItems: interviews,
                                    index: index,
                                    field: 'type',
                                    value: e.target.value
                                })}
                                placeholder="Контракт или Срочка"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setInterviews,
                                    currentItems: interviews,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setInterviews,
                                    currentItems: interviews,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setInterviews,
                            currentItems: interviews,
                            template: {date: '', type: '', link: ''}
                        })}
                    >
                        Добавить собеседование
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'events'}) && (
                <div className="subsection">
                    <h3>Мероприятия</h3>
                    {events.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setEvents,
                                    currentItems: events,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setEvents,
                                    currentItems: events,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название мероприятия"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setEvents,
                                    currentItems: events,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setEvents,
                                    currentItems: events,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setEvents,
                            currentItems: events,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить мероприятие
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'lectures'}) && (
                <div className="subsection">
                    <h3>Лекции</h3>
                    {lectures.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setLectures,
                                    currentItems: lectures,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setLectures,
                                    currentItems: lectures,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название лекции"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setLectures,
                                    currentItems: lectures,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setLectures,
                                    currentItems: lectures,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setLectures,
                            currentItems: lectures,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить лекцию
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'drills'}) && (
                <div className="subsection">
                    <h3>Строевая подготовка</h3>
                    {drills.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setDrills,
                                    currentItems: drills,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setDrills,
                                    currentItems: drills,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setDrills,
                                    currentItems: drills,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setDrills,
                                    currentItems: drills,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setDrills,
                            currentItems: drills,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить строевую подготовку
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'exercises'}) && (
                <div className="subsection">
                    <h3>Учения</h3>
                    {exercises.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setExercises,
                                    currentItems: exercises,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setExercises,
                                    currentItems: exercises,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setExercises,
                                    currentItems: exercises,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setExercises,
                                    currentItems: exercises,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setExercises,
                            currentItems: exercises,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить учение
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'shootings'}) && (
                <div className="subsection">
                    <h3>Учебные стрельбы</h3>
                    {shootings.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setShootings,
                                    currentItems: shootings,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setShootings,
                                    currentItems: shootings,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setShootings,
                                    currentItems: shootings,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setShootings,
                                    currentItems: shootings,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setShootings,
                            currentItems: shootings,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить учебные стрельбы
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'trainings'}) && (
                <div className="subsection">
                    <h3>Тренировки</h3>
                    {trainings.map((item, index) => (
                        <div key={index} className="item-row">
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemChange({
                                    setter: setTrainings,
                                    currentItems: trainings,
                                    index: index,
                                    field: 'date',
                                    value: e.target.value
                                })}
                                placeholder="Дата (дд.мм.гггг)"
                            />
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange({
                                    setter: setTrainings,
                                    currentItems: trainings,
                                    index: index,
                                    field: 'name',
                                    value: e.target.value
                                })}
                                placeholder="Название"
                            />
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setTrainings,
                                    currentItems: trainings,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setTrainings,
                                    currentItems: trainings,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setTrainings,
                            currentItems: trainings,
                            template: {date: '', name: '', link: ''}
                        })}
                    >
                        Добавить тренировку
                    </button>
                </div>
            )}

            {isSectionVisible({sectionName: 'attendance'}) && (
                <div className="subsection">
                    <h3>Посещение мероприятий</h3>
                    {attendances.map((item, index) => (
                        <div key={index} className="item-row">
                            <select
                                value={item.type}
                                onChange={(e) => handleItemChange({
                                    setter: setAttendances,
                                    currentItems: attendances,
                                    index: index,
                                    field: 'type',
                                    value: e.target.value
                                })}
                            >
                                <option value="leader">Качественное мероприятие от лидера</option>
                                <option value="grp">ГРП</option>
                            </select>
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange({
                                    setter: setAttendances,
                                    currentItems: attendances,
                                    index: index,
                                    field: 'link',
                                    value: e.target.value
                                })}
                                placeholder="Ссылка на доказательство"
                            />
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveItem({
                                    setter: setAttendances,
                                    currentItems: attendances,
                                    index: index
                                })}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-btn"
                        onClick={() => handleAddItem({
                            setter: setAttendances,
                            currentItems: attendances,
                            template: { type: 'leader', link: '' }
                        })}
                    >
                        Добавить посещение мероприятия
                    </button>
                </div>
            )}

            <div className="subsection">
                <h3>Сгенерированный отчет</h3>
                <ExamplePhrase
                    text={generateReport()}
                    type="ss"
                    messageType="multiline"
                />
            </div>
        </>
    );
};

export default ReportGenerator;
