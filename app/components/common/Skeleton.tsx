"use client"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular" | "rounded"
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className = "", 
  variant = "rounded",
  width,
  height 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted"
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg"
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Preset skeleton layouts
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton variant="rounded" height={120} className="w-full" />
      <Skeleton variant="text" height={20} className="w-3/4" />
      <Skeleton variant="text" height={16} className="w-1/2" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          height={16} 
          className={i === lines - 1 ? "w-2/3" : "w-full"} 
        />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-3 pb-3 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height={20} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-3 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              variant="text" 
              height={16} 
              className="flex-1" 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />
}
