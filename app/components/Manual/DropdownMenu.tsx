"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import ExamplePhrase from "./ExamplePhrase"
import "@/app/styles/dropdownMenu.css"

interface DropdownMenuProps {
  title: string
  items: string[] | DropdownMenuProps[]
  icon?: string
  text?: string
  type?: "0" | "1"
  who?: "ms" | "ss"
  isOpen?: boolean
  onToggle?: () => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  items,
  icon = "📚",
  text = "",
  type = "0",
  who = "ms",
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalIsOpen(!internalIsOpen)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (onToggle && isOpen) {
          onToggle()
        } else if (internalIsOpen) {
          setInternalIsOpen(false)
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (onToggle && isOpen) {
          onToggle()
        } else if (internalIsOpen) {
          setInternalIsOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, internalIsOpen, onToggle])

  return (
    <div className="dropdown-menu" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={handleToggle}>
        <span className="dropdown-toggle-content">
          <span className="dropdown-toggle-icon">{icon}</span>
          <span>{title}</span>
        </span>

        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      <div className={`dropdown-content ${isOpen ? "open" : "closed"}`}>
        <div className="dropdown-content-container">
          {text && (
            <div className="note">
              <strong>Примечание:</strong> {text}
            </div>
          )}

          <ul className="dropdown-list">
            {items.map((item, index) => {
              if (type === "1") {
                const nestedProps = item as DropdownMenuProps
                return (
                  <li key={index} className="dropdown-item full-width">
                    <div className="dropdown-item-container">
                      <DropdownMenu {...nestedProps} />
                    </div>
                    {index < items.length - 1 && <div className="dropdown-separator"></div>}
                  </li>
                )
              }

              return (
                <li key={index} className="dropdown-item">
                  <div className="dropdown-item-container">
                    <ExamplePhrase text={item as string} type={who} />
                  </div>
                  {index < items.length - 1 && <div className="dropdown-separator"></div>}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu
