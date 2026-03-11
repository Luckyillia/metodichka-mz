"use client"

import React from "react"
import { useBiographyValidator } from "./hooks"
import { ValidatorForm, ValidationResults } from "./components"

export default function BiographyValidator() {
  const {
    form,
    updateField,

    chars,
    charsOk,
    parsedWrittenDate,
    writtenDateNotFuture,
    titleCheck,
    formNameCheck,
    structureCheck,
    titleMatchesForm,
    ageMismatch,
    canSubmit,

    loading,
    error,
    result,
    usedDate,

    handleValidate,
    handleValidateBoth,
    handleCopyJSON,
  } = useBiographyValidator()

  return (
    <div className="w-full">
      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <ValidatorForm
        form={form}
        chars={chars}
        charsOk={charsOk}
        parsedWrittenDate={parsedWrittenDate}
        writtenDateNotFuture={writtenDateNotFuture}
        titleCheck={titleCheck}
        formNameCheck={formNameCheck}
        structureCheck={structureCheck}
        titleMatchesForm={titleMatchesForm}
        canSubmit={canSubmit}
        loading={loading}
        onUpdate={updateField}
        onValidate={handleValidate}
        onValidateBoth={handleValidateBoth}
      />

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
          <div className="font-semibold">Ошибка</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {result && (
        <ValidationResults
          result={result}
          model={form.model}
          biographyTitle={form.biographyTitle}
          writtenDate={form.writtenDate}
          parsedWrittenDate={parsedWrittenDate}
          usedDate={usedDate}
          ageMismatch={ageMismatch}
          onCopyJSON={handleCopyJSON}
        />
      )}
    </div>
  )
}