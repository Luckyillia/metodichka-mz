"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, FileText, Heading2, Info, Plus, Save, Type, X } from "lucide-react"
import SectionRenderer from "@/app/components/Constructor/SectionRenderer"
import { useAuth } from "@/lib/auth/auth-context"
import type { ConstructorBlock, ConstructorContent } from "@/types/constructor"

const initialContent: ConstructorContent = {
  blocks: [
    { id: "welcome-heading", type: "heading", data: { text: "Новая секция", level: 2 } },
    { id: "welcome-text", type: "text", data: { text: "Добавьте первый блок с помощью панели слева." } },
  ],
}

type BlockType = ConstructorBlock["type"]

const palette: Array<{ type: BlockType; label: string; description: string; icon: typeof Type }> = [
  { type: "heading", label: "Заголовок", description: "Название или подзаголовок", icon: Heading2 },
  { type: "text", label: "Текст", description: "Обычный текст с абзацами", icon: Type },
  { type: "note", label: "Заметка", description: "Важно, подсказка или предупреждение", icon: Info },
]

function newBlock(type: BlockType): ConstructorBlock {
  const id = crypto.randomUUID()
  if (type === "heading") return { id, type, data: { text: "Новый заголовок", level: 2 } }
  if (type === "text") return { id, type, data: { text: "Введите текст блока." } }
  return { id, type, data: { title: "Обратите внимание", text: "Текст заметки.", tone: "info" } }
}

export default function ConstructorPage() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<ConstructorContent>(initialContent)
  const [selectedId, setSelectedId] = useState(initialContent.blocks[0].id)
  const [preview, setPreview] = useState(false)

  const selected = useMemo(
    () => content.blocks.find((block) => block.id === selectedId),
    [content.blocks, selectedId],
  )

  const canEdit = user?.role === "root" || user?.role === "admin"

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const addBlock = (type: BlockType) => {
    const block = newBlock(type)
    setContent((current) => ({ blocks: [...current.blocks, block] }))
    setSelectedId(block.id)
    setPreview(false)
  }

  const updateSelected = (block: ConstructorBlock) => {
    setContent((current) => ({
      blocks: current.blocks.map((item) => item.id === block.id ? block : item),
    }))
  }

  const removeSelected = () => {
    if (!selected) return
    setContent((current) => ({ blocks: current.blocks.filter((block) => block.id !== selected.id) }))
    setSelectedId(content.blocks.find((block) => block.id !== selected.id)?.id ?? "")
  }

  // The user session is stored in browser storage, so the server cannot know
  // the role during its initial render. Keep that render identical on both sides.
  if (!mounted || isLoading) {
    return <main className="min-h-screen bg-background" aria-busy="true" />
  }

  if (!canEdit) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-6 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Конструктор доступен администраторам</h1>
        <p className="mt-2 text-muted-foreground">Войдите под учётной записью с ролью admin или root.</p>
        <Link href="/" className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground">Вернуться к методичке</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <header className="mx-auto mb-6 flex max-w-screen-2xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title="Вернуться к методичке">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Конструктор секций</h1>
            <p className="text-sm text-muted-foreground">Тестовый черновик: изменения пока не сохраняются.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreview((value) => !value)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
            {preview ? "Вернуться к редактированию" : "Предпросмотр"}
          </button>
          <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-primary/50 px-3 py-2 text-sm text-primary-foreground" title="Сохранение добавим после подключения базы данных">
            <Save className="h-4 w-4" /> Сохранить
          </button>
        </div>
      </header>

      <div className={`mx-auto grid max-w-screen-2xl gap-4 ${preview ? "grid-cols-1" : "lg:grid-cols-[240px_minmax(0,1fr)_300px]"}`}>
        {!preview && (
          <aside className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Блоки</h2>
            <div className="space-y-2">
              {palette.map(({ type, label, description, icon: Icon }) => (
                <button key={type} onClick={() => addBlock(type)} className="flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-muted">
                  <Icon className="mt-0.5 h-4 w-4 text-primary" />
                  <span><span className="block text-sm font-medium">{label}</span><span className="block text-xs text-muted-foreground">{description}</span></span>
                  <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </aside>
        )}

        <section className="min-h-[520px] rounded-xl border border-border bg-card p-5 md:p-8">
          {!preview && <p className="mb-5 text-xs text-muted-foreground">Нажмите на блок, чтобы изменить его настройки справа.</p>}
          <div className="space-y-3">
            {content.blocks.map((block) => (
              <div
                key={block.id}
                role={preview ? undefined : "button"}
                tabIndex={preview ? undefined : 0}
                onClick={() => !preview && setSelectedId(block.id)}
                onKeyDown={(event) => {
                  if (!preview && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault()
                    setSelectedId(block.id)
                  }
                }}
                className={`block w-full rounded-lg p-3 text-left transition ${!preview && selectedId === block.id ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""} ${preview ? "cursor-default p-0" : "cursor-pointer hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"}`}
              >
                <SectionRenderer content={{ blocks: [block] }} />
              </div>
            ))}
          </div>
          {content.blocks.length === 0 && <p className="py-20 text-center text-muted-foreground">Добавьте блок из палитры.</p>}
        </section>

        {!preview && <SettingsPanel block={selected} onChange={updateSelected} onDelete={removeSelected} />}
      </div>
    </main>
  )
}

function SettingsPanel({ block, onChange, onDelete }: { block?: ConstructorBlock; onChange: (block: ConstructorBlock) => void; onDelete: () => void }) {
  if (!block) return <aside className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Выберите блок на холсте.</aside>

  const inputClass = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Настройки</h2><button onClick={onDelete} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Удалить блок"><X className="h-4 w-4" /></button></div>
      {block.type === "heading" && <label className="text-sm">Текст<input className={inputClass} value={block.data.text} onChange={(event) => onChange({ ...block, data: { ...block.data, text: event.target.value } })} /></label>}
      {block.type === "text" && <label className="text-sm">Текст<textarea className={`${inputClass} min-h-32 resize-y`} value={block.data.text} onChange={(event) => onChange({ ...block, data: { text: event.target.value } })} /></label>}
      {block.type === "note" && <div className="space-y-3"><label className="block text-sm">Заголовок<input className={inputClass} value={block.data.title ?? ""} onChange={(event) => onChange({ ...block, data: { ...block.data, title: event.target.value } })} /></label><label className="block text-sm">Текст<textarea className={`${inputClass} min-h-28 resize-y`} value={block.data.text} onChange={(event) => onChange({ ...block, data: { ...block.data, text: event.target.value } })} /></label><label className="block text-sm">Стиль<select className={inputClass} value={block.data.tone} onChange={(event) => onChange({ ...block, data: { ...block.data, tone: event.target.value as "info" | "warning" | "success" } })}><option value="info">Информация</option><option value="warning">Предупреждение</option><option value="success">Успех</option></select></label></div>}
    </aside>
  )
}
