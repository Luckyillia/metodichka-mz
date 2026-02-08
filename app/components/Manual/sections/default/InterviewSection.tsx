import ExamplePhrase from "../../ExamplePhrase"
import { useAuth } from "@/lib/auth/auth-context"
import { useState } from "react"

const InterviewSection = () => {
  const { canAccessSection } = useAuth()
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Проверяем, относится ли пользователь к старшему составу
  const isSeniorStaff = canAccessSection('exam-section') || canAccessSection('goss-wave') || canAccessSection('announcements')

  // Функция адаптации текста под пол
  const adaptText = (text: string): string => {
    if (gender === 'female') {
      return text
        .replace(/взял/g, 'взяла')
        .replace(/открыв/g, 'открыв')
        .replace(/начал/g, 'начала')
        .replace(/вернул/g, 'вернула')
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
        <h3>📋 Этапы собеседования (2 этапа)</h3>

          <h4><strong>Собеседование</strong></h4>
          
          <ExamplePhrase text="say Здравствуйте! Вы на собеседование?" />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждем ответа
          </div>

          <ExamplePhrase text="say Ваше ФИО, возраст и образование?" />
          <div className="note">
            <strong>📌 Примечание:</strong> 18+, Ждём ответа
          </div>

          <ExamplePhrase text="say Хорошо! Ваш паспорт?" />
          <div className="note">
            <strong>📌 Примечание:</strong> 2-3 отыгровки минимум. Ждём отыгровок
          </div>

          <div className="mt-4">
            <ExamplePhrase text={adaptText("me взял паспорт")} />
            <ExamplePhrase text="do Паспорт в руке." />
            <ExamplePhrase text={adaptText("me открыв паспорт, начал изучать данные")} />
            <ExamplePhrase text="do Паспорт изучен." />
            <ExamplePhrase text={adaptText("me вернул паспорт")} />
            <ExamplePhrase text="say Можете забрать" />
          </div>

          <div className="mt-6" />

          <ExamplePhrase text="say Ваш диплом?" />
          <div className="note">
            <strong>📌 Примечание:</strong> чисто отыгровки, его нет. Ждём отыгровок
          </div>

          <div className="mt-4">
            <ExamplePhrase text={adaptText("me взял диплом и начал его изучать")} />
            <ExamplePhrase text="do Диплом изучен." />
            <ExamplePhrase text={adaptText("me вернул диплом")} />
            <ExamplePhrase text="say Можете забрать" />
          </div>

          <div className="mt-6" />

          <ExamplePhrase text="say Хорошо! Ваша трудовая книжка?" />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём отыгровок
          </div>

          <div className="mt-4">
            <ExamplePhrase text={adaptText("me взял трудовую книжку")} />
            <ExamplePhrase text="do Трудовая книжка в руке." />
            <ExamplePhrase text={adaptText("me открыв трудовую книжку, начал изучать данные")} />
            <ExamplePhrase text="do Трудовая книжка изучена." />
            <ExamplePhrase text={adaptText("me вернул трудовую книжку")} />
            <ExamplePhrase text="say Можете забрать" />
          </div>

          <div className="mt-6" />

          <ExamplePhrase text="say Хорошо! Ваше водительское удостоверение?" />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём отыгровок
          </div>

          <div className="mt-4">
            <ExamplePhrase text={adaptText("me взял Водительское удостоверение")} />
            <ExamplePhrase text="do Водительское удостоверение в руке." />
            <ExamplePhrase text={adaptText("me открыв Водительское удостоверение, начал изучать данные")} />
            <ExamplePhrase text="do Водительское удостоверение изучено." />
            <ExamplePhrase text={adaptText("me вернул Водительское удостоверение")} />
            <ExamplePhrase text="say Можете забрать" />
          </div>

          <div className="mt-6" />

          <ExamplePhrase text="say Хорошо! Ваша Медицинская карта?" />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём отыгровок
          </div>

          <div className="mt-4">
            <ExamplePhrase text={adaptText("me взял Медицинскую карту")} />
            <ExamplePhrase text="do Медицинская карта в руке." />
            <ExamplePhrase text={adaptText("me открыв Медицинскую карту, начал изучать данные")} />
            <ExamplePhrase text="do Медицинская карта изучена." />
            <ExamplePhrase text={adaptText("me вернул Медицинскую карту")} />
            <ExamplePhrase text="say Можете забрать" />
          </div>

          <div className="mt-8" />

          <ExamplePhrase text="say Хорошо! Поздравляю Вас, вы прошли 1 этап собеседования!" />
          
          <ExamplePhrase text="say Приступим ко 2-ому этапу!" />
          <ExamplePhrase text="say Присядьте." />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём когда проходящий присядет, если будет отыгрывать это ошибка
          </div>
          <ExamplePhrase text="b Вставайте." />
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём 10 секунд, если встаёт то это ошибка
          </div>

          <div className="mt-6" />

          <ExamplePhrase text="say Вставайте." />
          <ExamplePhrase text="say Что у меня над головой?" />
          <ExamplePhrase text="say Что такое МГ, ДБ, СК, ТК?" />
          
          <div className="note">
            <strong>📌 Примечание:</strong> Ждём ответа, может это быть всё что угодно, но не термины, если термины засчитываем ошибку
          </div>

          <ExamplePhrase text="b Что такое МГ, ДБ, СК, ТК?" />

          <div className="note mt-4">
            <p><strong>📖 Расшифровка РП понятий:</strong></p>
            <div className="text-sm mt-2 space-y-1">
              <p><strong>ДМ</strong> - Убийство без причины.</p>
              <p><strong>ДБ</strong> - Убийство с машины (машиной).</p>
              <p><strong>СК</strong> - Спавн килл, т.е. убийство при появлении.</p>
              <p><strong>ТК</strong> - &quot;Team Kill&quot; - Убийство своих.</p>
              <p><strong>РП</strong> - &quot;Role Play&quot; - Игра по ролям где каждый должен соблюдать свою роль.</p>
              <p><strong>МГ</strong> - &quot;Meta Gaming&quot; - Использование информации из реального мира в игровой чат (сокращенно: ООС в ИС).</p>
              <p><strong>ГМ</strong> - &quot;God Mood&quot; - Бог мод - т.е. режим бога.</p>
              <p><strong>ПГ</strong> - &quot;Power Gaming&quot; - Изображение из себя героя, например когда у тебя нет оружия и ты идешь на человека у которого оно есть, или например драка 5 против одного.</p>
              <p><strong>РК</strong> - Возвращение на место где тебя убили.</p>
              <p><strong>БХ</strong> - &quot;Бани Хоп&quot; - нонРП бег с прыжками (shift+space).</p>
            </div>
          </div>

          <ExamplePhrase text="say Мои поздравления, вы прошли собеседование!" />

          {!isSeniorStaff && (
            <div className="note mt-6">
              <p><strong>📌 Примечание:</strong> Направте человека который прошле к проводящему собеседование.</p>
            </div>
          )}

          {isSeniorStaff && (
            <>
              <div className="note mt-6">
                <h4><strong>📝 Форма для заполнения в ВК:</strong></h4>
                <div className="mt-4 bg-muted/50 p-4 rounded-lg border-2 border-border">
                  <p>Форма</p>
                  <p>1. Ник:</p>
                  <p>2. Номер паспорта:</p>
                  <p>3. Банк счёт:</p>
                  <p>4. Пароль ЖА:</p>
                  <p>5. До какого Мед. карта:</p>
                  <p>6. Ссылка на ВК:</p>
                  <p>7. Дискорд ID(Не тєг):</p>
                  <p className="mt-2">А также в чате &quot;выдача-роли&quot; запросите роль в официальном дискорд сервере: https://discord.gg/4Gdsch6s</p>
                </div>
              </div>
            </>
          )}
      </div>
    </>
  )
}

export default InterviewSection
