import React, { useState } from 'react';
import ExamplePhrase from '../../ExamplePhrase';

const ExamSection = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="exam-section">
            <h2 className="text-2xl font-bold mb-6">📋 Экзамены и проверки знаний</h2>

            {/* Tab Navigation */}
            <div className="tab-navigation mb-6">
                <button
                    className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    Общая информация
                </button>
                <button
                    className={`tab-button ${activeTab === 'intern' ? 'active' : ''}`}
                    onClick={() => setActiveTab('intern')}
                >
                    Интерн → Фельдшер
                </button>
                <button
                    className={`tab-button ${activeTab === 'driving' ? 'active' : ''}`}
                    onClick={() => setActiveTab('driving')}
                >
                    Экзамен по вождению
                </button>
                <button
                    className={`tab-button ${activeTab === 'lab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lab')}
                >
                    Лаборант → Врач-стажёр
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'general' && (
                    <>
                        <div className="subsection">
                            <h3>📍 Место проведения</h3>
                            <p>Проверка знаний может проводится в любом месте на усмотрение проводящего.</p>
                        </div>

                        <div className="subsection">
                            <h3>❓ Процедура проведения</h3>
                            <p>На проверке задаются вопросы в виде номеров пункта и откуда взят пункт. С момент отправки вопроса
                                наблюдается скорость и правильность ответа, также навыки по поиску ответов. Использование форумом не
                                запрещено.</p>
                        </div>

                        <div className="subsection">
                            <h3>📚 Документы для проверки знаний</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>ПСГО</strong> - <a
                                    href="https://forum.gtaprovince.ru/topic/203338-pravila-dlya-sotrudnikov-gos-organizaciy/"
                                    className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                                <li><strong>УМЗ</strong> - <a href="https://forum.gtaprovince.ru/topic/1138655-ustav-ministerstva-zdravoohraneniya/"
                                                              className="document-link" target="_blank" rel="noopener noreferrer">Открыть
                                    документ</a></li>
                            </ul>
                        </div>
                    </>
                )}

                {activeTab === 'intern' && (
                    <div className="subsection">
                        <h3>📖 Интерн (1) → Фельдшер (2)</h3>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Вступительная лекция</h4>
                        <ExamplePhrase text="say Приветствую вас, уважаемые интерны, сейчас вам будет проведена вступительная лекция." type="ss" />
                        <ExamplePhrase text="say В данной лекции вы узнаете самое основное и необходимое для работы в нашей организации." type="ss" />
                        <ExamplePhrase text="say Слушаем внимательно! Вопросы сможете задать после лекции." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <ExamplePhrase text="say Вы сейчас находитесь в больнице ОКБ города Мирный." type="ss" />
                        <div className="note">
                            <strong>📌 Примечание:</strong><ExamplePhrase text="b Ваш тег — [ММУ]" type="ss" />
                        </div>
                        <ExamplePhrase text="say Расскажу вам вкратце про ваши обязанности:" type="ss" />
                        <ExamplePhrase text="say 1. Ваша главная задача - лечить пациентов и находиться в здании больницы, .." type="ss" />
                        <ExamplePhrase text="say ..после сдать отчёт для повышения в должности." type="ss" />
                        <ExamplePhrase text="say 2. Запреты для интернов, фельдшеров:" type="ss" />
                        <ExamplePhrase text="say Интерны и фельдшеры не могут выставлять отметки в армию." type="ss" />
                        <div className="note">
                            <strong>📌 Примечание:</strong><ExamplePhrase text="b Выставлять отметки можно с 4 ранга («Врач-стажёр»)." type="ss" />
                            <ExamplePhrase text="b Выдавать медицинские карты можно с 5 ранга («Врач-участковый»)." type="ss" />
                        </div>
                        <ExamplePhrase text="say Интернам запрещено брать РСМП и АСМП." type="ss" />
                        <div className="note">
                            <strong>📌 Примечание:</strong> <ExamplePhrase text="АСМП — Автомобиль Скорой Медицинской Помощи (белый; используется для патрулей, постов и тому подобного)." type="ss" />
                            <ExamplePhrase text="РСМП — автомобиль Реанимационной Скорой Медицинской Помощи (жёлтый; используется для обработки вызовов)." type="ss" />
                        </div>
                        <ExamplePhrase text="say Если же вы ослушаетесь данного правила, то понесёте соответствующее наказание." type="ss" />
                        <ExamplePhrase text="say С должности фельдшер вы можете ездить в качестве напарника, .." type="ss" />
                        <ExamplePhrase text="say ..а самому брать карету СМП можно только с должности «Лаборант»." type="ss" />
                        <ExamplePhrase text="say На этом вступительная лекция окончена." type="ss" />
                        <ExamplePhrase text="say Имеются вопросы?" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-2">Сдача клятвы Гиппократа</h4>
                        <ExamplePhrase text="say Доброго времени суток! Сейчас пройдёт экзамен по знанию клятвы Гиппократа. Вы готовы?" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <div className="note">
                            <strong>📌 Примечание:</strong> Ждём пока расскажет клятву
                        </div>
                        <ExamplePhrase text="say Поздравляю! Экзамен по знанию клятвы Гиппократа сдан!" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-2">Единый Теоретический Экзамен</h4>
                        <ExamplePhrase text="say Здравствуйте! Сейчас пройдёт Единый Теоретический Экзамен. Вы готовы?" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <ExamplePhrase text="say Начнём с Устава Министерства Здравоохранения." type="ss" />
                        <ExamplePhrase text="say Что означает пункт №4.6 УМЗ?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> Запрещено оказывать медицинскую помощь самому себе, находясь в критическом (предсмертном) состоянии.
                        </div>
                        <ExamplePhrase text="say Что означает пункт №4.10 УМЗ?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> Запрещено игнорировать вызовы. Исключение: не позволяющий ранг.
                        </div>
                        <ExamplePhrase text="say Что означает пункт №4.14 УМЗ?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> Запрещено неоднократно вставать или выходить из строя без разрешения.
                        </div>
                        <ExamplePhrase text="say Хорошо. Перейдём к Правилам для Сотрудников Государственных Организаций." type="ss" />
                        <ExamplePhrase text="say Что означает пункт №4.35 ПСГО?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> Запрещено прогуливать смену в рабочее время.
                        </div>
                        <ExamplePhrase text="say Что означает пункт №4.38 ПСГО?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> AFK 5+.
                        </div>
                        <ExamplePhrase text="say Что означает пункт №4.18 ПСГО?" type="ss" />
                        <div className="note">
                            <strong>✅ Ответ:</strong> Запрещено использовать СГУ в личных целях.
                        </div>
                        <ExamplePhrase text="say Поздравляю! Вы успешно сдали Единый Теоретический Экзамен." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                    </div>
                )}

                {activeTab === 'driving' && (
                    <div className="subsection">
                        <h3>🚗 Экзамен по вождению АСМП</h3>
                        <ExamplePhrase text="say Сейчас пройдёт экзамен по вождение АСМП." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <ExamplePhrase text="r [ТЕГ] Выехали на проведение экзамена по вождению. Обучаемый: Имя_Фамилия." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <div className="note">
                            <strong>📌 Примечание:</strong> Через 5 минут
                        </div>
                        <ExamplePhrase text="r [ТЕГ] Продолжаем проведение экзамена по вождению. Обучаемый: Имя_Фамилия." type="ss" />
                        <div className="note">
                            <strong>📌 Примечание:</strong> Через 5 минут
                        </div>
                        <ExamplePhrase text="r [ТЕГ] Вернулись с экзамена по вождение в ОКБ. Обучаемый: Имя_Фамилия." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="b /timestamp + screen (F12)" type="ss" />
                        </div>
                        <ExamplePhrase text="say На этом экзамен по вождение окончен." type="ss" />
                    </div>
                )}

                {activeTab === 'lab' && (
                    <div className="subsection">
                        <h3>📖 Лаборант (3) → Врач-стажёр (4) | Врач-стажёр (4) → Врач-участковый (5)</h3>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Медицинская комиссия в армию</h4>
                        <ExamplePhrase text="say Здравствуйте! Вы готовы мне рассказать, как Вы будете проводить медицинскую комиссию в армию?" type="ss" />
                        <ExamplePhrase text="say Тогда я Вас внимательно слушаю.." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>
                        <div className="note">
                            <strong>📌 Примечание:</strong> Ждём пока расскажет
                        </div>
                        <ExamplePhrase text="say Отлично! Теоритический экзамен по проведению медицинской комиссии сдан!" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-2">Экзамен по навыкам проведения операций</h4>
                        <ExamplePhrase text="say Доброго времени суток. Сейчас пройдёт экзамен по навыкам проведения операций." type="ss" />
                        <ExamplePhrase text="say Итак, Вам необходимо провести операцию по пересадке органов." type="ss" />
                        <ExamplePhrase text="do Маникен лежит на кушетке." />
                        <ExamplePhrase text="say Приступайте!" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>
                        <div className="note">
                            <strong>📌 Примечание:</strong> Ожидаем отыгровок от сотрудника
                        </div>
                        <ExamplePhrase text="say Отлично! Вы сдали экзамен по навыкам проведения операций. Оценка: 5." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>
                        <div className="warning">
                            <strong>⚠️ Если забыл помыть руки или отыгровки:</strong>
                            <p>say Вы не сдали экзамен по проведеннию сложнейших операций. Оценка: 3.</p>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-2">Экзамен по проведению медицинской комиссии и выдачи медицинской карточки</h4>
                        <ExamplePhrase text="say Здравствуйте! Сейчас пройдёт экзамен по проведению медицинской комиссии и выдачи медицинской карточки." type="ss" />
                        <ExamplePhrase text="say Ваша задача: провести мне всё вышесказанное." type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>
                        <div className="note">
                            <strong>📌 Примечание:</strong> Ждём пока расскажет
                        </div>
                        <ExamplePhrase text="say Отлично! Экзамен по проведению медицинской комиссии и выдачи медицинской карточки сдан!" type="ss" />
                        <div className="note">
                            <strong>📸 Примечание:</strong> <ExamplePhrase text="screen (F12) + /timestamp" type="ss" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamSection;
