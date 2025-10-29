import ExamplePhrase from "../../ExamplePhrase"
import { useState } from "react"

const MedicalCardSection = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Функция адаптации текста под пол
  const adaptText = (text: string): string => {
    if (gender === 'female') {
      return text
        .replace(/взял/g, 'взяла')
        .replace(/открыв/g, 'открыв')
        .replace(/изучил/g, 'изучила')
        .replace(/передал/g, 'передала')
        .replace(/указал/g, 'указала')
        .replace(/положил/g, 'положила')
        .replace(/внес/g, 'внесла')
        .replace(/поставил/g, 'поставила')
        .replace(/достал/g, 'достала')
        .replace(/открыл/g, 'открыла')
        .replace(/нажал/g, 'нажала')
        .replace(/закрыл/g, 'закрыла')
        .replace(/снял/g, 'сняла')
        .replace(/связался/g, 'связалась')
        .replace(/сказал/g, 'сказала')
        .replace(/употребил/g, 'употребила')
        .replace(/протянувшись/g, 'протянувшись')
        .replace(/берет/g, 'берёт')
        .replace(/передает/g, 'передаёт')
    }
    return text
  }

  return (
    <>
      {/* Gender Selector */}
      <div className="subsection">
        <h3>👤 Пол сотрудника</h3>
        <p className="text-sm text-muted-foreground mb-3">Выберите пол сотрудника для адаптации отыгровок</p>
        <div className="flex gap-3">
          <button
            onClick={() => setGender('male')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
              gender === 'male'
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-secondary border-border text-foreground hover:border-blue-500/50'
            }`}
          >
            <span className="text-2xl mr-2">👨</span>
            Мужчина
          </button>
          <button
            onClick={() => setGender('female')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
              gender === 'female'
                ? 'bg-pink-500 border-pink-500 text-white'
                : 'bg-secondary border-border text-foreground hover:border-pink-500/50'
            }`}
          >
            <span className="text-2xl mr-2">👩</span>
            Женщина
          </button>
        </div>
      </div>

      <div className="subsection">
        <h3>📋 Получение медицинской карты</h3>
        
        <div className="note">
          <p><strong>📌 Важно:</strong> Врач-участковый, либо более старший по рангу, должен проводить гражданина в кабинет, где проводится собеседования (ЦГБ - 4-й этаж, ОКБ - Кабинеты для проведения медкомиссии).</p>
        </div>

        <h4 className="mt-6"><strong>1. Приветствие и проверка документов</strong></h4>
        
        <ExamplePhrase text="say Здравствуйте, Вы хотите пройти мед. комиссию?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответа от гражданина, в случае положительного ответа следуете далее, в противном случае выгоняете его из помещения, при необходимости вызываете наряд полиции.
        </div>
        <ExamplePhrase text="say Хорошо, представьтесь и предоставьте Ваш паспорт" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете отыгровок гражданина.
        </div>
        <ExamplePhrase text={adaptText("me взял паспорт в руки")} />
        <ExamplePhrase text={adaptText("me открыв паспорт на нужной странице, изучил данные гражданина")} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете отыгровок гражданина.
        </div>
        <ExamplePhrase text={adaptText("me передал паспорт человеку напротив")} />

        <h4 className="mt-6"><strong>2. Проверка веса и роста</strong></h4>
        
        <div className="note">
            <strong>📌 Примечание:</strong> Далее подходите к весам и измерителю роста, которые расположены рядом с кушеткой.
        </div>

        <ExamplePhrase text="do Около кушетки весы." />
        <ExamplePhrase text="say Вставайте туда!" />
        <ExamplePhrase text={adaptText("me указал пальцем на весы")} />
        <div className="note">
            <strong>📌 Примечание:</strong> После того, как гражданин встал на весы:
        </div>
        <ExamplePhrase text="do У *Имя Фамилия* какой вес?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответа игрока командой /do и после идёте к стене.
        </div>
        <ExamplePhrase text="do На стене измеритель роста." />
        <ExamplePhrase text="say Встаньте сюда!" />
        <ExamplePhrase text={adaptText("me указал пальцем на измеритель роста")} />
        <ExamplePhrase text="do У *Имя Фамилия* какой рост?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответа игрока командой /do и после идёте к столу.
        </div>
        <ExamplePhrase text="do В углу стоит стол." />
        <ExamplePhrase text="say Хорошо..." />
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкарту")} />
        <div className="warning mt-4">
            <strong>⚠️ Важно:</strong> После проверки роста и веса, в случае если не было достигнуто максимального количества ошибок в отыгровках (3 ошибки), вы идете к третьему пункту. В противном случае, вы говорите гражданину, что он не годен и возвращаете все его документы.
        </div>
        <h4 className="mt-6"><strong>3. Проверка зрения</strong></h4>
        
        <div className="note">
            <strong>📌 Примечание:</strong> Далее подходите к стене и начинаете проверку зрения.
        </div>

        <ExamplePhrase text="say Перейдем к осмотру зрения..." />
        <ExamplePhrase text="do На стене висит таблица Сивцева." />
        <ExamplePhrase text="say Сейчас я Вам буду показывать буквы, а вы будете их называть." />
        <ExamplePhrase text="do Указка лежит на столе." />
        <ExamplePhrase text={adaptText("me взял указку в левую руку")} />
        <ExamplePhrase text="say Закройте правый глаз!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете отыгровки игрока, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Б"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Н"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Ш"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text="say Хорошо, закройте левый глаз!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете отыгровки игрока, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Ы"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "П"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "К"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ожидаете ответ, далее:
        </div>
        <ExamplePhrase text={adaptText("me положил указку на стол")} />
        <ExamplePhrase text="say Открывайте глаза." />
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкарту")} />
        <div className="warning mt-4">
            <strong>⚠️ Важно:</strong> После проверки на зрение, в случае если не было достигнуто максимального количества ошибок в отыгровках (3 ошибки), вы идете к четвёртому пункту. В противном случае, вы говорите гражданину, что он не годен и возвращаете все его документы.
        </div>

        <h4 className="mt-6"><strong>4. Заключение и выдача медкарты</strong></h4>
        
        <div className="note">
            <strong>📌 Примечание:</strong> Далее проходите к столу для заключения.
        </div>

        <ExamplePhrase text="say За медосмотр Вам необходимо заплатить госпошлину в размере 2249 рублей." />

        <ExamplePhrase text={adaptText("me поставил подпись в медкарту")} />
        <ExamplePhrase text="do Подпись поставлена." />
        <ExamplePhrase text={adaptText("me положил ручку на стол")} />

        <ExamplePhrase text='do На столе стоит печать "Министерства Здравоохранения".' />
        <ExamplePhrase text={adaptText("me взял печать")} />
        <ExamplePhrase text={adaptText("me поставил печать на подпись")} />

        <div className="note mt-4">
            <strong>📌 Примечание:</strong> Выдача медкарты осуществляется через радиальное меню.
        </div>

        <ExamplePhrase text={adaptText("me передал медкарту человеку напротив")} />
        <ExamplePhrase text="say Всего доброго!" />

        <div className="note mt-6">
          <p><strong>💰 Стоимость:</strong> 2249 рублей</p>
        </div>
      </div>

    </>
  )
}

export default MedicalCardSection
