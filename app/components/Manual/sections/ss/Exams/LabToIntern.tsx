import React from 'react';
import ExamplePhrase from '../../../ExamplePhrase';

const LabToIntern = () => {
    return (
        <div className="space-y-8">
            {/* Медицинская комиссия в армию */}
            <div className="exam-block bg-card p-6 rounded-lg border-2 border-border">
                <h3 className="text-xl font-semibold mb-4 pb-3 border-b-2 border-border">
                    🎖️ Медицинская комиссия в армию
                </h3>
                
                <div className="space-y-3">
                    <ExamplePhrase text="say Здравствуйте! Вы готовы мне рассказать, как Вы будете проводить медицинскую комиссию в армию?" type="ss" />
                    <ExamplePhrase text="say Тогда я Вас внимательно слушаю.." type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>

                    <div className="note bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg my-4 border-2 border-amber-200 dark:border-amber-800">
                        <strong className="text-amber-700 dark:text-amber-300">⏳ Примечание:</strong>
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Ждём пока расскажет</p>
                    </div>

                    <ExamplePhrase text="say Отлично! Теоретический экзамен по проведению медицинской комиссии сдан!" type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>
                </div>
            </div>

            {/* Экзамен по навыкам проведения операций */}
            <div className="exam-block bg-card p-6 rounded-lg border-2 border-border">
                <h3 className="text-xl font-semibold mb-4 pb-3 border-b-2 border-border">
                    🔬 Экзамен по навыкам проведения операций
                </h3>
                
                <div className="space-y-3">
                    <ExamplePhrase text="say Доброго времени суток. Сейчас пройдёт экзамен по навыкам проведения операций." type="ss" />
                    <ExamplePhrase text="say Итак, Вам необходимо провести операцию по пересадке органов." type="ss" />
                    <ExamplePhrase text="do Манекен лежит на кушетке." type="ss" />
                    <ExamplePhrase text="say Приступайте!" type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>

                    <div className="note bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg my-4 border-2 border-amber-200 dark:border-amber-800">
                        <strong className="text-amber-700 dark:text-amber-300">⏳ Примечание:</strong>
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Ожидаем отыгровок от сотрудника</p>
                    </div>

                    <ExamplePhrase text="say Отлично! Вы сдали экзамен по навыкам проведения операций. Оценка: 5." type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>

                    <div className="warning bg-red-50 dark:bg-red-950/30 p-4 rounded-lg my-4 border-l-4 border-red-500">
                        <strong className="text-red-700 dark:text-red-300">⚠️ Если забыл помыть руки или отыгровки:</strong>
                        <ExamplePhrase text="say Вы не сдали экзамен по проведению сложнейших операций. Оценка: 3." type="ss" />
                    </div>
                </div>
            </div>

            {/* Экзамен по проведению медицинской комиссии и выдачи медкарты */}
            <div className="exam-block bg-card p-6 rounded-lg border-2 border-border">
                <h3 className="text-xl font-semibold mb-4 pb-3 border-b-2 border-border">
                    📋 Экзамен по проведению медкомиссии и выдачи медкарты
                </h3>
                
                <div className="space-y-3">
                    <ExamplePhrase text="say Здравствуйте! Сейчас пройдёт экзамен по проведению медицинской комиссии и выдачи медицинской карточки." type="ss" />
                    <ExamplePhrase text="say Ваша задача: провести мне всё вышесказанное." type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>

                    <div className="note bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg my-4 border-2 border-amber-200 dark:border-amber-800">
                        <strong className="text-amber-700 dark:text-amber-300">⏳ Примечание:</strong>
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Ждём пока расскажет</p>
                    </div>

                    <ExamplePhrase text="say Отлично! Экзамен по проведению медицинской комиссии и выдачи медицинской карточки сдан!" type="ss" />
                    
                    <div className="note bg-muted/50 p-4 rounded-lg my-4">
                        <strong className="text-primary">📸 Примечание:</strong>
                        <ExamplePhrase text="b screen (F12) + /timestamp" type="ss" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabToIntern;