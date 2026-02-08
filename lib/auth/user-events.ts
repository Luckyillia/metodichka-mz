export const USER_UPDATED_EVENT = "mz:user-updated"

export function emitUserUpdated() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT))
}
