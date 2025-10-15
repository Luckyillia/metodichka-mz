import ExamplePhrase from "../../ExamplePhrase"

const MedicalCommissionSection = () => {
  return (
    <>
      <div className="subsection">
        <h3>🏥 Мед.комиссия для срочной службы</h3>
        
        <ExamplePhrase text="say Здравствуйте, Вы хотите пройти мед. комиссию?" />
        
        <ExamplePhrase text="say Хорошо, представьтесь и предоставьте Ваши паспорт и справку о прохождении врачей." />
        
        <div className="note">
          <strong>📌 Примечание:</strong> просто отыгрываем справку от врачей, это НЕ мед.карта
        </div>

        <ExamplePhrase text="me взял паспорт и справку о прохождении врачей в руки" />
        <ExamplePhrase text="me начал изучать справку" />
        <ExamplePhrase text="do Справка изучена." />
        <ExamplePhrase text="me открыв паспорт на нужной странице, изучает данные гражданина" />
        <ExamplePhrase text="do Данные изучены." />
        <ExamplePhrase text="me вернул паспорт и справку о прохождении врачей человеку напротив" />
        <ExamplePhrase text="say Теперь мне нужна Ваша медицинская книжка." />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет отыгровки.
        </div>
        <ExamplePhrase text="me взял медкнижку в руки" />
        <ExamplePhrase text="me положил медкнижку на стол, затем открыл нужную страницу" />
        <ExamplePhrase text="do Около кушетки стоят весы." />
        <ExamplePhrase text="say Вставайте на весы." />
        <ExamplePhrase text="do У *Имя Фамилия* какой вес?" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём пока напишет в ДУ "do 80 кг.".
        </div>
        <ExamplePhrase text="do В углу стоит стол." />
        <ExamplePhrase text="say Хорошо..." />
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text="me взял ручку, затем внес изменения в медкнижку" />
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
        <ExamplePhrase text="me взял указку в правую руку" />
        <ExamplePhrase text="say Закройте левый глаз!" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждем пока напишет отыгровки.
        </div>
        <ExamplePhrase text='me указала на букву "М"' />
        <ExamplePhrase text='me указала на букву "З"' />
        <ExamplePhrase text='me указала на букву "П"' />
        <ExamplePhrase text="me положил указку на стол" />

        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="say Открывайте глаз." />

        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="do На столе ручка." />
        <ExamplePhrase text="me взял ручку, затем внес изменения в медкнижку" />
        <ExamplePhrase text="do Изменения внесены." />
        <ExamplePhrase text="me поставил подпись в медкнижку" />
        <ExamplePhrase text="me положил ручку на стол" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text='do На столе стоит печать "Министерство Здравоохранения".' />
        <ExamplePhrase text="me взял печать в руку" />
        <ExamplePhrase text="me поставил печать на подпись" />
        <div className="note">
            <strong>📌 Примечание:</strong> Ждём несколько секунд.
        </div>
        <ExamplePhrase text="me взял со стола в руки медкнижку" />
        <ExamplePhrase text="do Медкнижка в руке." />
        <ExamplePhrase text="me передала медкнижку человеку напротив" />

        <ExamplePhrase text="say Желаю Вам удачной службы. Не болейте. Всего доброго!" />

        <div className="note mt-6">
          <h4><strong>📝 Примеры объявлений:</strong></h4>
          <div className="mt-4">
            <p><strong>Годен:</strong></p>
            <p className="text-sm mt-2">[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]</p>
            <p className="text-sm">Гражданин Kirill_Shooters (193) прошел военно-медицинскую комиссию и получил отметку "Годен".</p>
          </div>
          <div className="mt-4">
            <p><strong>Не Годен:</strong></p>
            <p className="text-sm mt-2">[Главный Заместитель Главного Врача по Областной Клинической Больницы города Мирный | Полтер Сокировский]</p>
            <p className="text-sm">Гражданин Ernesto_Hayashi(319) прошел военно-медицинскую комиссию и получил отметку "Не Годен".</p>
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
