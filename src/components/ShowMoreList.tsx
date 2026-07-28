import { useState, type ReactNode } from 'react'

interface Props<T> {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  initialCount?: number
}

/**
 * Renders only the first `initialCount` items (assumed newest-first) plus a
 * "Show all" button, so a history that grows for years doesn't mount
 * thousands of interactive cards at once.
 */
export function ShowMoreList<T>({
  items,
  getKey,
  renderItem,
  initialCount = 25,
}: Props<T>) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? items : items.slice(0, initialCount)

  return (
    <div className="stack">
      {visible.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
      {!showAll && items.length > initialCount && (
        <button type="button" className="btn" onClick={() => setShowAll(true)}>
          Show all ({items.length} total)
        </button>
      )}
    </div>
  )
}
