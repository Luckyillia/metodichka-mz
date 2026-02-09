import React from 'react'

interface OrderPreviewProps {
  text: string
}

export const OrderPreview: React.FC<OrderPreviewProps> = ({ text }) => {
  return (
    <div className="pt-2 border-t-2 border-border">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-foreground">👀 Предпросмотр</h5>
      </div>
      <div className="mt-3">
        <div className="p-4 rounded-lg border-2 border-border bg-background/50">
          <pre className="text-sm whitespace-pre-wrap text-foreground font-mono">
            {text || "Заполните поля для предпросмотра приказа"}
          </pre>
        </div>
      </div>
    </div>
  )
}