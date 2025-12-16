import React from 'react';

const GeneralInfo = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Место проведения</h3>
                <p>Проверка знаний может проводиться в любом месте на усмотрение проводящего.</p>
            </div>

            <div className="subsection">
                <h3>❓ Процедура проведения</h3>
                <p>На проверке задаются вопросы в виде номеров пункта и откуда взят пункт. С момента отправки вопроса
                    наблюдается скорость и правильность ответа, также навыки по поиску ответов. Использование форума не
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
    );
};

export default GeneralInfo;
