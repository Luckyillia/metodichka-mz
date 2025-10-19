import React, { useState } from 'react';
import ExamplePhrase from '../../ExamplePhrase';
import "@/app/styles/reportGenerator.css";

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
    const [customPosition, setCustomPosition] = useState('');

    const [interviews, setInterviews] = useState([{ link: '' }]);
    const [lecturesMZ, setLecturesMZ] = useState([{ name: '', link: '' }]);
    const [lecturesMO, setLecturesMO] = useState([{ name: '', link: '' }]);
    const [trainings, setTrainings] = useState([{ name: '', link: '' }]);
    const [eventsWithOrg, setEventsWithOrg] = useState([{ name: '', link: '' }]);
    const [eventsWithoutPost, setEventsWithoutPost] = useState([{ name: '', link: '' }]);
    const [interviewsAttendance, setInterviewsAttendance] = useState([{ link: '' }]);
    const [patrolCity, setPatrolCity] = useState([{ minutes: 0, link: '' }]);
    const [patrolAir, setPatrolAir] = useState([{ minutes: 0, link: '' }]);
    const [postAny, setPostAny] = useState([{ minutes: 0, link: '' }]);
    const [postGVMU, setPostGVMU] = useState([{ minutes: 0, link: '' }]);

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
            patrolAir: 60
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

    const currentRequirements = positionRequirements[position];

    const handleAddItem = (setter: Function, currentItems: any[], template: any) => {
        setter([...currentItems, template]);
    };

    const handleRemoveItem = (setter: Function, currentItems: any[], index: number) => {
        if (currentItems.length === 1) return;
        const newItems = [...currentItems];
        newItems.splice(index, 1);
        setter(newItems);
    };

    const handleItemChange = (setter: Function, currentItems: any[], index: number, field: string, value: any) => {
        const newItems = [...currentItems];
        newItems[index][field] = value;
        setter(newItems);
    };

    const generateReport = () => {
        const displayPosition = customPosition || position;
        let report = `${branch}\nВаш никнейм: ${fullName}\nДолжность: ${displayPosition}\n\n`;
        let sectionNumber = 1;

        if (currentRequirements.interviews && interviews.some(item => item.link)) {
            report += `${sectionNumber}. Проведение собеседования.\n`;
            interviews.forEach((item, idx) => {
                if (item.link) report += `${sectionNumber}.${idx + 1} ${item.link}\n`;
            });
            report += `\n`;
            sectionNumber++;
        }

        if (currentRequirements.lecturesMZ && lecturesMZ.some(item => item.link)) {
            const label = currentRequirements.lecturesMO 
                ? `${sectionNumber}. Проведение ${currentRequirements.lecturesMZ} лекций сотрудникам МЗ.`
                : `${sectionNumber}. Проведение ${currentRequirements.lecturesMZ} лекций.`;
            report += `${label}\n`;
            lecturesMZ.forEach((item, idx) => {
                if (item.link) {
                    const namePrefix = item.name ? `Лекция "${item.name}" - ` : '';
                    report += `${sectionNumber}.${idx + 1} ${namePrefix}${item.link}\n`;
                }
            });
            report += `\n`;
            sectionNumber++;
        }

        if (currentRequirements.lecturesMO && lecturesMO.some(item => item.link)) {
            report += `${sectionNumber}. Проведение ${currentRequirements.lecturesMO} лекций сотрудникам МО.\n`;
            lecturesMO.forEach((item, idx) => {
                if (item.link) {
                    const namePrefix = item.name ? `Лекция "${item.name}" - ` : '';
                    report += `${sectionNumber}.${idx + 1} ${namePrefix}${item.link}\n`;
                }
            });
            report += `\n`;
            sectionNumber++;
        }

        if (currentRequirements.trainings && trainings.some(item => item.link)) {
            report += `${sectionNumber}. Проведение ${currentRequirements.trainings} тренировок.\n`;
            trainings.forEach((item, idx) => {
                if (item.link) {
                    const namePrefix = item.name ? `Тренировка "${item.name}" - ` : '';
                    report += `${sectionNumber}.${idx + 1} ${namePrefix}${item.link}\n`;
                }
            });
            report += `\n`;
            sectionNumber++;
        }

        const hasEvents = (currentRequirements.eventsWithOrg && eventsWithOrg.some(item => item.link)) ||
                          (currentRequirements.eventsWithoutPost && eventsWithoutPost.some(item => item.link));
        
        if (hasEvents) {
            report += `${sectionNumber}. Проведение мероприятий.\n`;
            let eventIdx = 1;
            
            if (currentRequirements.eventsWithOrg && eventsWithOrg.some(item => item.link)) {
                eventsWithOrg.forEach((item) => {
                    if (item.link) {
                        const namePrefix = item.name ? `Мероприятие "${item.name}" - ` : 'Мероприятие с другой организацией - ';
                        report += `${sectionNumber}.${eventIdx} ${namePrefix}${item.link}\n`;
                        eventIdx++;
                    }
                });
            }
            
            if (currentRequirements.eventsWithoutPost && eventsWithoutPost.some(item => item.link)) {
                eventsWithoutPost.forEach((item) => {
                    if (item.link) {
                        const namePrefix = item.name ? `Мероприятие "${item.name}" - ` : '';
                        report += `${sectionNumber}.${eventIdx} ${namePrefix}${item.link}\n`;
                        eventIdx++;
                    }
                });
            }
            report += `\n`;
            sectionNumber++;
        }

        if (currentRequirements.interviewsAttendance && interviewsAttendance.some(item => item.link)) {
            report += `${sectionNumber}. Присутствие на ${currentRequirements.interviewsAttendance} собеседованиях филиалов МЗ.\n`;
            interviewsAttendance.forEach((item, idx) => {
                if (item.link) report += `${sectionNumber}.${idx + 1} ${item.link}\n`;
            });
            report += `\n`;
            sectionNumber++;
        }

        if (currentRequirements.patrolCity) {
            const totalMinutes = patrolCity.reduce((sum, item) => sum + (item.minutes || 0), 0);
            if (totalMinutes > 0) {
                report += `${sectionNumber}. Междугородний патруль.\n`;
                patrolCity.forEach((item, idx) => {
                    if (item.link) report += `${sectionNumber}.${idx + 1} ${item.minutes} минут - ${item.link}\n`;
                });
                report += `\n`;
                sectionNumber++;
            }
        }

        if (currentRequirements.patrolAir) {
            const totalMinutes = patrolAir.reduce((sum, item) => sum + (item.minutes || 0), 0);
            if (totalMinutes > 0) {
                report += `${sectionNumber}. Междугородний воздушный патруль.\n`;
                patrolAir.forEach((item, idx) => {
                    if (item.link) report += `${sectionNumber}.${idx + 1} ${item.minutes} минут - ${item.link}\n`;
                });
                report += `\n`;
                sectionNumber++;
            }
        }

        if (currentRequirements.postAny) {
            const totalMinutes = postAny.reduce((sum, item) => sum + (item.minutes || 0), 0);
            if (totalMinutes > 0) {
                report += `${sectionNumber}. Любой пост.\n`;
                postAny.forEach((item, idx) => {
                    if (item.link) report += `${sectionNumber}.${idx + 1} ${item.minutes} минут - ${item.link}\n`;
                });
                report += `\n`;
                sectionNumber++;
            }
        }

        if (currentRequirements.postGVMU) {
            const totalMinutes = postGVMU.reduce((sum, item) => sum + (item.minutes || 0), 0);
            if (totalMinutes > 0) {
                report += `${sectionNumber}. Любой дежурный пост ГВ-МУ.\n`;
                postGVMU.forEach((item, idx) => {
                    if (item.link) report += `${sectionNumber}.${idx + 1} ${item.minutes} минут - ${item.link}\n`;
                });
                report += `\n`;
                sectionNumber++;
            }
        }

        return report.trim();
    };

    const renderSection = (
        title: string,
        required: number | undefined,
        items: any[],
        setter: Function,
        template: any,
        hasMinutes: boolean = false,
        hasName: boolean = false
    ) => {
        if (!required) return null;

        // Для патрулей и постов считаем минуты, для остальных - количество элементов
        const filledCount = hasMinutes 
            ? items.reduce((sum, item) => sum + (item.link ? (item.minutes || 0) : 0), 0)
            : items.filter(item => item.link).length;
        const remaining = required - filledCount;
        const displayTitle = hasMinutes ? title : `${title} (требуется: ${required})`;
        
        const getCounterColor = () => {
            if (remaining === 0) return '#28a745';
            if (remaining < 0) return '#ffc107';
            return '#dc3545';
        };

        return (
            <div className="subsection" style={{ marginTop: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>{displayTitle}</h3>
                    <span style={{ 
                        fontSize: '0.9em', 
                        fontWeight: 'bold', 
                        color: getCounterColor(),
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: `${getCounterColor()}15`
                    }}>
                        {filledCount} / {required} {hasMinutes ? 'мин' : ''} {remaining > 0 ? `(осталось: ${remaining}${hasMinutes ? ' мин' : ''})` : remaining === 0 ? '✓' : `(+${Math.abs(remaining)}${hasMinutes ? ' мин' : ''})`}
                    </span>
                </div>
                {hasMinutes && (
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0', marginBottom: '12px' }}>
                        💡 Укажите количество минут для каждого патруля/поста
                    </p>
                )}
                <div style={{ marginTop: '12px' }}>
                    {items.map((item, index) => (
                        <div key={index} className="item-row" style={{ marginBottom: '10px' }}>
                            {hasMinutes && (
                                <input
                                    type="number"
                                    value={item.minutes}
                                    onChange={(e) => handleItemChange(setter, items, index, 'minutes', parseInt(e.target.value) || 0)}
                                    placeholder="Минуты"
                                    style={{ width: '100px' }}
                                />
                            )}
                            {hasName && (
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setter, items, index, 'name', e.target.value)}
                                    placeholder="Название (опционально)"
                                    style={{ flex: '0 0 250px' }}
                                />
                            )}
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange(setter, items, index, 'link', e.target.value)}
                                placeholder="Ссылка на доказательство"
                            />
                            <button className="remove-btn" onClick={() => handleRemoveItem(setter, items, index)}>
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
                <button className="add-btn" onClick={() => handleAddItem(setter, items, template)} style={{ marginTop: '10px' }}>
                    Добавить
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="subsection">
                <h3>Основная информация</h3>
                <div className="input-group">
                    <label>Филиал:</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value as any)}>
                        <option value="ЦГБ-П">ЦГБ-П</option>
                        <option value="ОКБ-М">ОКБ-М</option>
                        <option value="ЦГБ-Н">ЦГБ-Н</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Ваш никнейм:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Введите ваш никнейм"
                    />
                </div>
                <div className="input-group">
                    <label>Должность:</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                        <option value="Заведующий отделением">Заведующий отделением (8 ранг)</option>
                        <option value="Заведующий отделением | Командир ОВМ ГВ-МУ">Заведующий отделением | Командир ОВМ ГВ-МУ (8 ранг)</option>
                        <option value="Заведующий отделением | Заместитель Начальника СА">Заведующий отделением | Заместитель Начальника СА (8 ранг)</option>
                        <option value="Заместитель главного врача">Заместитель главного врача (9 ранг)</option>
                        <option value="Заместитель главного врача | Начальник ИМУ">Заместитель главного врача | Начальник ИМУ (9 ранг)</option>
                        <option value="Заместитель главного врача | Заместитель Начальника ГВ-МУ">Заместитель главного врача | Заместитель Начальника ГВ-МУ (9 ранг)</option>
                        <option value="Заместитель главного врача | Начальник СА">Заместитель главного врача | Начальник СА (9 ранг)</option>
                        <option value="Главный Заместитель главного врача">Главный Заместитель главного врача (9 ранг)</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Название должности в отчете (опционально):</label>
                    <input
                        type="text"
                        value={customPosition}
                        onChange={(e) => setCustomPosition(e.target.value)}
                        placeholder="Например: Заместитель Начальника Санитарной Авиации"
                    />
                    <small style={{ color: '#666', fontSize: '0.85em', marginTop: '5px', display: 'block' }}>
                        Если не заполнено, будет использовано название из выпадающего списка
                    </small>
                </div>
            </div>

            {renderSection('Проведение собеседования', currentRequirements.interviews, interviews, setInterviews, { link: '' }, false, false)}
            {renderSection(
                currentRequirements.lecturesMO ? 'Проведение лекций сотрудникам МЗ' : 'Проведение лекций',
                currentRequirements.lecturesMZ,
                lecturesMZ,
                setLecturesMZ,
                { name: '', link: '' },
                false,
                true
            )}
            {renderSection('Проведение лекций сотрудникам МО', currentRequirements.lecturesMO, lecturesMO, setLecturesMO, { name: '', link: '' }, false, true)}
            {renderSection('Проведение тренировок', currentRequirements.trainings, trainings, setTrainings, { name: '', link: '' }, false, true)}
            {renderSection('Качественное мероприятие с другой организацией без поста', currentRequirements.eventsWithOrg, eventsWithOrg, setEventsWithOrg, { name: '', link: '' }, false, true)}
            {renderSection('Качественные мероприятия без поста', currentRequirements.eventsWithoutPost, eventsWithoutPost, setEventsWithoutPost, { name: '', link: '' }, false, true)}
            {renderSection('Присутствие на собеседованиях филиалов МЗ', currentRequirements.interviewsAttendance, interviewsAttendance, setInterviewsAttendance, { link: '' }, false, false)}
            {renderSection(`Междугородний патруль (требуется: ${currentRequirements.patrolCity} минут)`, currentRequirements.patrolCity, patrolCity, setPatrolCity, { minutes: 0, link: '' }, true)}
            {renderSection(`Воздушный междугородний патруль (требуется: ${currentRequirements.patrolAir} минут)`, currentRequirements.patrolAir, patrolAir, setPatrolAir, { minutes: 0, link: '' }, true)}
            {renderSection(`Любой пост (требуется: ${currentRequirements.postAny} минут)`, currentRequirements.postAny, postAny, setPostAny, { minutes: 0, link: '' }, true)}
            {renderSection(`Любой дежурный пост ГВ-МУ (требуется: ${currentRequirements.postGVMU} минут)`, currentRequirements.postGVMU, postGVMU, setPostGVMU, { minutes: 0, link: '' }, true)}

            <div className="subsection">
                <h3>Сгенерированный отчет</h3>
                <ExamplePhrase text={generateReport()} type="ss" messageType="multiline" />
            </div>

            <div className="warning">
                <h3 style={{ color: '#856404', marginTop: 0 }}>⚠️ Важная информация</h3>
                <p style={{ margin: '10px 0', lineHeight: '1.6' }}>
                    <strong>День сдачи еженедельного отчёта сотрудника СС — суббота.</strong> В случае, если сотрудник по каким-то причинам не смог сдать отчет в субботу, то он должен сдать в воскресенье, предварительно предупредив лидера о задержке своего отчёта.
                </p>
                <p style={{ margin: '10px 0', lineHeight: '1.6' }}>
                    Требования должны быть выполнены <strong>с понедельника до субботы</strong>, воскресенье не входит (можно и заранее, если имеется неактив, предварительно предупредив лидера).
                </p>
                <p style={{ margin: '10px 0', lineHeight: '1.6' }}>
                    Если сотрудник отсутствует на неделю по уважительным причинам, тогда отчёт можно не сдавать.
                </p>
                <p style={{ margin: '10px 0', lineHeight: '1.6', color: '#d9534f' }}>
                    <strong>⚠️ Не сдача отчёта (или неполный отчёт) карается дисциплинарным взысканием по пункту 2.12 ПСГО.</strong>
                </p>
            </div>
        </>
    );
};

export default ReportGenerator;
