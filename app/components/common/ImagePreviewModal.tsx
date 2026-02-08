import React from "react"
import { X } from "lucide-react"

interface ImagePreviewModalProps {
  isOpen: boolean
  src: string | null
  title?: string
  onClose: () => void
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  src,
  title = "",
  onClose,
}) => {
  if (!isOpen || !src) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-popover border-2 border-border rounded-xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="text-sm font-medium text-popover-foreground truncate">{title}</div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title || "image"}
            className="max-h-[75vh] w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
