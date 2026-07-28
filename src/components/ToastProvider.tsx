import { useCallback, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastAction, type ToastKind } from './toastContext'

interface Toast {
  id: string
  message: string
  kind: ToastKind
  action?: ToastAction
}

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'info', action?: ToastAction) => {
      const toastId = String(nextId.current++)
      setToasts((current) => [...current, { id: toastId, message, kind, action }])
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== toastId))
      }, AUTO_DISMISS_MS)
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + var(--space-4))',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          zIndex: 100,
          width: 'min(90vw, 420px)',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              background:
                toast.kind === 'error'
                  ? 'var(--color-urgent-bg)'
                  : toast.kind === 'success'
                    ? 'var(--color-success-bg)'
                    : 'var(--color-surface-raised)',
              color: toast.kind === 'error' ? 'var(--color-urgent)' : 'inherit',
            }}
          >
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  toast.action?.onClick()
                  setToasts((current) => current.filter((t) => t.id !== toast.id))
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
