import React from 'react';
import ExamplePhrase from '../../ExamplePhrase';
import ProtectedSection from '../../ProtectedSection';

const ForumResponsesSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>✅ Критерии проверки рапортов</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Рапорт должен быть оформлен также как и в форме
                        (Допускаются <strong>небольшие</strong> орфографические ошибки)
                    </li>
                    <li>ФИО должно быть написано в родительном падеже (<strong>Пример:</strong> от Гуткова Данила
                        Анатольевича)
                    </li>
                    <li>Должность должна быть расшифрована полностью</li>
                    <li>Ограничения на 24 часовой лимит в случаи отказа распространяется только на отдел кадров.
                        В случае если вам отказали по той или иной причине.
                    </li>
                    <li>В случае массовой подачи однотипных рапортов устанавливается временной лимит в 24 часа на их
                        рассмотрения. Сотрудник, допустивший спам рапортов, при наличии трех и более подлежит
                        дисциплинарному взысканию согласно правилам форума.
                    </li>
                    <li>Проверяем интервалы в подразделениях</li>
                </ul>
            </div>
            <div className="subsection">
                <h3>👤 Принятие во фракцию</h3>
                <ExamplePhrase text={`
Одобрено! Свяжусь с вами.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"} />
            </div>

            <div className="subsection">
                <h3>❌ Увольнение из фракции</h3>
                <ExamplePhrase text={`
Одобрено! Будете уволены.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
            </div>

            <div className="subsection">
                <h3>🔄 Восстановление во фракцию</h3>
                <ExamplePhrase text={`
Одобрено! Свяжусь с вами.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
            </div>

            <div className="subsection">
                <h3>🏖️ Отпуск во фракции</h3>
                <ExamplePhrase text={`
Одобрено! Будете отправлены в отпуск.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
                <div className="note">
                    <strong>📝 Примечание:</strong> Укажите даты отпуска при необходимости.
                </div>
            </div>

            <div className="subsection">
                <h3>🅿️ Выдача парковочного места</h3>
                <ExamplePhrase text={`
Одобрено! Вам будет выдано место №*номер места*
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
                <div className="note">
                    <strong>📝 Примечание:</strong> Замените *номер места* на соответствующий номер парковочного места.
                </div>
            </div>

            <div className="subsection">
                <h3>🎫 Выдача пропуска на въезд ВЧ</h3>
                <ExamplePhrase text={`
Одобрено! Пропуск будет выдан.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
            </div>

            <div className="subsection">
                <h3>🎓 Повышение в ЦПОС</h3>
                <ExamplePhrase text={`
Одобрено! Будете переведены.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>
            </div>

            <div className="subsection">
                <h3>🚫 Отказ по рапорту</h3>
                <ExamplePhrase text={`
Отказано! *Причина отказа*
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                               messageType={"multiline"} type={"ss"}/>

                <div className="note">
                    <h4><strong>📋 Пример отказа:</strong></h4>
                    <ExamplePhrase text={`
Отказано! ФИО указано не в родительном падеже.
С уважением, Главный Врач по ЦГБ г. Приволжск, Манарский Аверардо Данилович.`}
                                   messageType={"multiline"} type={"ss"}/>
                </div>
            </div>

            <div className="warning">
                <strong>⚠️ Важно:</strong> Все ответы на форуме должны быть подписаны полным ФИО и должностью в
                соответствии с вашим рангом в организации.
            </div>
        </>
    );
}

export default ForumResponsesSection;
