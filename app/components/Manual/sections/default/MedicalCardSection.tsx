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
        
        <ExamplePhrase text="say Здравствуйте, Вы хотите пройти мед. комиссию?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет ответ.
        </div>
        <ExamplePhrase text="say Хорошо, представьтесь и предоставьте Ваш паспорт" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text={adaptText("me взял паспорт в руки")} />
        <ExamplePhrase text={adaptText("me открыв паспорт на нужной странице, изучил данные гражданина")} />
        <ExamplePhrase text={adaptText("me передал паспорт человеку напротив")} />
        <ExamplePhrase text="say Вот держите Ваш паспорт." />

        <ExamplePhrase text="do Около кушетки весы." />
        <ExamplePhrase text="say Вставайте туда!" />
        <ExamplePhrase text={adaptText("me указал пальцем на весы")} />
        <ExamplePhrase text="do У *Имя Фамилия* какой вес?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет в ДУ "do 80 кг.".
        </div>
        <ExamplePhrase text="do На стене измеритель роста." />
        <ExamplePhrase text="say Встаньте сюда!" />
        <ExamplePhrase text={adaptText("me указал пальцем на измеритель роста")} />
        <ExamplePhrase text="do У *Имя Фамилия* какой рост?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет в ДУ "do 180 см.".
        </div>
        <ExamplePhrase text="do В углу стоит стол." />
        <ExamplePhrase text="say Хорошо..." />
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкарту")} />
        <ExamplePhrase text="do Изменения внесены." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="say Перейдем к осмотру зрения..." />
        <ExamplePhrase text="do На стене висит таблица Сивцева." />
        <ExamplePhrase text="say Сейчас я Вам буду показывать буквы, а вы будете их называть." />
        <ExamplePhrase text="do Указка лежит на столе." />
        <ExamplePhrase text={adaptText("me взял указку в левую руку")} />
        <ExamplePhrase text="say Закройте правый глаз!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Б"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Повторяем это 3 раза меняя буквы.
        </div>
        <ExamplePhrase text="say Хорошо, откройте правый глаз и закройте левый!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text={adaptText('me указал указкой на букву "Ф"')} />
        <div className="note">
            <strong>📌 Примечание:</strong> Повторяем это 3 раза меняя буквы.
        </div>
        <ExamplePhrase text={adaptText("me положил указку на стол")} />
        <ExamplePhrase text="say Открывайте глаза." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкарту")} />
        <ExamplePhrase text="do Изменения внесены." />

        <ExamplePhrase text="say За медосмотр Вам необходимо заплатить госпошлину в размере 2249 рублей." />

        <ExamplePhrase text={adaptText("me поставил подпись в медкарту")} />
        <ExamplePhrase text="do Подпись поставлена." />
        <ExamplePhrase text={adaptText("me положил ручку на стол")} />

        <ExamplePhrase text='do На столе стоит печать "Министерства Здравоохранения".' />
        <ExamplePhrase text={adaptText("me взял печать")} />
        <ExamplePhrase text={adaptText("me поставил печать на подпись")} />

        <ExamplePhrase text={adaptText("me передал медкарту человеку напротив")} />

        <div className="note mt-6">
          <p><strong>💰 Стоимость:</strong> 2249 рублей</p>
        </div>
      </div>
    </>
  )
}

export default MedicalCardSection
