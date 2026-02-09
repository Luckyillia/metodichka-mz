import React from 'react'
import type { DisciplinaryBuilder, DisciplinaryPerson } from '../../types'

interface DisciplinaryFormProps {
  disciplinary: DisciplinaryBuilder
  onPenaltyChange: (penalty: string) => void
  onAddPerson: () => void
  onUpdatePerson: (index: number, updates: Partial<DisciplinaryPerson>) => void
  onRemovePerson: (index: number) => void
}

export const DisciplinaryForm: React.FC<DisciplinaryFormProps> = ({
  disciplinary,
  onPenaltyChange,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
}) => {
  return (
    <div className="p-4 rounded-lg border-2 border-border bg-background/50">
      <h5 className="text-sm font-semibold mb-3 text-foreground">Взыскания</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Вид взыскания:</label>
          <input
            type="text"
            value={disciplinary.penalty}
            onChange={(e) => onPenaltyChange(e.target.value)}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="pt-2 border-t-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">Сотрудники:</label>
            <button
              onClick={onAddPerson}
              className="px-3 py-1 rounded-lg text-sm font-semibold bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
              type="button"
            >
              + Добавить
            </button>
          </div>

          <div className="space-y-4">
            {disciplinary.people.map((person, idx) => (
              <div key={idx} className="p-3 rounded-lg border-2 border-border bg-background/50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => onUpdatePerson(idx, { name: e.target.value })}
                    placeholder="Имя_Фамилия"
                    className="md:col-span-2 w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="text"
                    value={person.position}
                    onChange={(e) => onUpdatePerson(idx, { position: e.target.value })}
                    placeholder="должность"
                    className="md:col-span-2 w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={() => onRemovePerson(idx)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
                    type="button"
                  >
                    Удалить
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Пункт:</label>
                    <input
                      type="text"
                      value={person.article}
                      onChange={(e) => onUpdatePerson(idx, { article: e.target.value })}
                      placeholder="например: 3.12 ПСГО"
                      className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Описание пункта (опционально):</label>
                    <input
                      type="text"
                      value={person.articleDescription}
                      onChange={(e) => onUpdatePerson(idx, { articleDescription: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2 text-foreground">Ссылка на жалобу (опционально):</label>
                  <input
                    type="text"
                    value={person.complaintUrl}
                    onChange={(e) => onUpdatePerson(idx, { complaintUrl: e.target.value })}
                    placeholder="https://forum..."
                    className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mt-3 pt-3 border-t-2 border-border">
                  <h6 className="text-sm font-semibold mb-2 text-foreground">📊 Состояние (для этого сотрудника)</h6>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">УП (0-5):</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={person.up}
                        onChange={(e) => {
                          const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                          onUpdatePerson(idx, { up: val.toString() })
                        }}
                        className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">П (0-5):</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={person.p}
                        onChange={(e) => {
                          const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                          onUpdatePerson(idx, { p: val.toString() })
                        }}
                        className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">В (0-3):</label>
                      <input
                        type="number"
                        min="0"
                        max="3"
                        value={person.v}
                        onChange={(e) => {
                          const val = Math.min(3, Math.max(0, parseInt(e.target.value) || 0))
                          onUpdatePerson(idx, { v: val.toString() })
                        }}
                        className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}