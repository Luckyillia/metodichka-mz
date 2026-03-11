"use client"

import React, { useState } from "react"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { useActionLog } from "./hooks"
import { ActionLogStats } from "./components/ActionLogStats"
import { ActionLogFilters } from "./components/ActionLogFilters"
import { ActionLogActions } from "./components/ActionLogActions"
import { ActionLogTable } from "./components/ActionLogTable"
import { DetailModal } from "./components/modals/DetailModal"
import { ConfirmModal } from "./components/modals/ConfirmModal"
import type { ActionLog } from "@/lib/auth/types"

const ActionLogSection: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<ActionLog | null>(null)

  const {
    logs,
    total,
    isLoading,
    isStatsLoading,
    error,
    success,
    currentPage,
    totalPages,
    filters,
    stats,
    confirmModal,
    currentUser,
    logsPerPage,
    hasActiveFilters,
    setError,
    setSuccess,
    handleRefresh,
    handleUndoAction,
    canUndo,
    updateFilter,
    resetFilters,
    handlePreviousPage,
    handleNextPage,
    handleGoToPage,
    pageNumbers,
    hideConfirm,
  } = useActionLog()

  const handleExportCSV = () => {
    const headers = ["Дата", "Пользователь", "Тип", "Действие", "Цель", "Отменено"]
    const rows = logs.map((l) => [
      new Date(l.created_at).toLocaleString("ru-RU"),
      l.game_nick,
      l.action_type,
      l.action,
      l.target_name || l.target_type || "",
      l.undone ? "Да" : "Нет",
    ])
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `action-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <ActionLogStats stats={stats} isLoading={isStatsLoading} />

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg text-destructive transition-colors">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-green-600 dark:text-green-400 transition-colors">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions toolbar */}
      <ActionLogActions
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      {/* Filters */}
      <ActionLogFilters
        filters={filters}
        onUpdate={updateFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      <ActionLogTable
        logs={logs}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        logsPerPage={logsPerPage}
        isLoading={isLoading}
        canUndo={canUndo}
        onViewDetails={setSelectedLog}
        onUndo={handleUndoAction}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onGoToPage={handleGoToPage}
        pageNumbers={pageNumbers}
      />

      {/* Modals */}
      {selectedLog && (
        <DetailModal
          log={selectedLog}
          isRootUser={currentUser?.role === "root"}
          onClose={() => setSelectedLog(null)}
        />
      )}

      <ConfirmModal {...confirmModal} onCancel={hideConfirm} />
    </div>
  )
}

export default ActionLogSection