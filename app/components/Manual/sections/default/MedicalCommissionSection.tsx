import ExamplePhrase from "../../ExamplePhrase"
import { useState } from "react"

const MedicalCommissionSection = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Функция адаптации текста под пол
  const adaptText = (text: string): string => {
    if (gender === 'female') {
      return text
        .replace(/взял/g, 'взяла')
        .replace(/начал/g, 'начала')
        .replace(/изучает/g, 'изучает')
        .replace(/вернул/g, 'вернула')
        .replace(/положил/g, 'положила')
        .replace(/внес/g, 'внесла')
        .replace(/указал/g, 'указала')
        .replace(/поставил/g, 'поставила')
        .replace(/передала/g, 'передала')
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
        <h3>🏥 Мед.комиссия для срочной службы</h3>
        
        <ExamplePhrase text="say Здравствуйте, Вы хотите пройти мед. комиссию?" />
        
        <ExamplePhrase text="say Хорошо, представьтесь и предоставьте Ваши паспорт и справку о прохождении врачей." />
        
        <div className="note">
          <strong>📌 Примечание:</strong> просто отыгрываем справку от врачей, это НЕ мед.карта
        </div>

        <ExamplePhrase text={adaptText("me взял паспорт и справку о прохождении врачей в руки")} />
        <ExamplePhrase text={adaptText("me начал изучать справку")} />
        <ExamplePhrase text="do Справка изучена." />
        <ExamplePhrase text={adaptText("me открыв паспорт на нужной странице, изучает данные гражданина")} />
        <ExamplePhrase text="do Данные изучены." />
        <ExamplePhrase text={adaptText("me вернул паспорт и справку о прохождении врачей человеку напротив")} />
        <ExamplePhrase text="say Теперь мне нужна Ваша медицинская книжка." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text={adaptText("me взял медкнижку в руки")} />
        <ExamplePhrase text={adaptText("me положил медкнижку на стол, затем открыл нужную страницу")} />
        <ExamplePhrase text="do Около кушетки стоят весы." />
        <ExamplePhrase text="say Вставайте на весы." />
        <ExamplePhrase text="do У *Имя Фамилия* какой вес?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет в ДУ "do 80 кг.".
        </div>
        <ExamplePhrase text="do В углу стоит стол." />
        <ExamplePhrase text="say Хорошо..." />
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкнижку")} />
        <ExamplePhrase text="do Изменения внесены." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="say Перейдем к проверке Вашего зрения." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="do На стене висит таблица Сивцева." />
        <ExamplePhrase text="say Сейчас я Вам буду показывать буквы, а Вы будете их называть." />
        <ExamplePhrase text="do Указка лежит на столе." />
        <ExamplePhrase text={adaptText("me взял указку в правую руку")} />
        <ExamplePhrase text="say Закройте левый глаз!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждем пока напишет отыгровки.
        </div>
        <ExamplePhrase text={adaptText('me указал на букву "М"')} />
        <ExamplePhrase text={adaptText('me указал на букву "З"')} />
        <ExamplePhrase text={adaptText('me указал на букву "П"')} />
        <ExamplePhrase text={adaptText("me положил указку на стол")} />

        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="say Открывайте глаз." />

        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text={adaptText("me взял ручку, затем внес изменения в медкнижку")} />
        <ExamplePhrase text="do Изменения внесены." />
        <ExamplePhrase text={adaptText("me поставил подпись в медкнижку")} />
        <ExamplePhrase text={adaptText("me положил ручку на стол")} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text='do На столе стоит печать "Министерство Здравоохранения".' />
        <ExamplePhrase text={adaptText("me взял печать в руку")} />
        <ExamplePhrase text={adaptText("me поставил печать на подпись")} />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text={adaptText("me взял со стола в руки медкнижку")} />
        <ExamplePhrase text="do Медкнижка в руке." />
        <ExamplePhrase text={adaptText("me передала медкнижку человеку напротив")} />

        <ExamplePhrase text="say Желаю Вам удачной службы. Не болейте. Всего доброго!" />

        <div className="warning mt-6">
          <h4><strong>📝 Примеры объявлений:</strong></h4>
          <div className="mt-4">
            <p><strong>Годен:</strong></p>
            <div className="mt-2 p-3 bg-muted/50 rounded-lg border-2 border-border">
              <ExamplePhrase
                text={`[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

                Гражданин Kirill_Shooters (193) прошел военно-медицинскую комиссию и получил отметку "Годен".`}
                messageType="multiline"
              />
            </div>
          </div>
          <div className="mt-4">
            <p><strong>Не Годен:</strong></p>
            <div className="mt-2 p-3 bg-muted/50 rounded-lg border-2 border-border">
              <ExamplePhrase
                text={`[Главный Заместитель Главного Врача по Областной Клинической Больницы города Мирный | Полтер Сокировский]

                      Гражданин Ernesto_Hayashi(319) прошел военно-медицинскую комиссию и получил отметку "Не Годен".`}
                messageType="multiline"
              />
            </div>
          </div>
          <div className="note">
            <strong>📌 Примечание:</strong> Не забываем прикрепить фотографию.
          </div>
        </div>
      </div>
    </>
  )
}

export default MedicalCommissionSection
