import type { ConstructorBlock, ConstructorContent } from "@/types/constructor"

const noteClasses = {
  info: "border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
} as const

function BlockRenderer({ block }: { block: ConstructorBlock }) {
  switch (block.type) {
    case "heading": {
      const Heading = `h${block.data.level}` as "h2" | "h3" | "h4"
      const className = {
        2: "text-2xl font-bold text-foreground",
        3: "text-xl font-semibold text-foreground",
        4: "text-lg font-semibold text-foreground",
      }[block.data.level]

      return <Heading className={className}>{block.data.text}</Heading>
    }

    case "text":
      return <p className="whitespace-pre-wrap leading-7 text-foreground/90">{block.data.text}</p>

    case "note":
      return (
        <aside className={`rounded-xl border p-4 ${noteClasses[block.data.tone]}`}>
          {block.data.title && <h3 className="mb-1 font-semibold">{block.data.title}</h3>}
          <p className="whitespace-pre-wrap leading-6">{block.data.text}</p>
        </aside>
      )
  }
}

interface SectionRendererProps {
  content: ConstructorContent
  className?: string
}

/** Renders the same saved content in the future editor preview and on the manual page. */
export default function SectionRenderer({ content, className = "" }: SectionRendererProps) {
  return (
    <section className={`space-y-5 ${className}`}>
      {content.blocks.map((block) => <BlockRenderer key={block.id} block={block} />)}
    </section>
  )
}
