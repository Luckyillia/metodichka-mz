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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-popover border-2 border-border rounded-xl w-full max-w-6xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="text-base font-medium text-popover-foreground truncate">{title}</div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title || "image"}
            className="max-h-[85vh] w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
