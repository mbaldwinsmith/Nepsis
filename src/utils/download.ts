export function triggerDownload(
  filename: string,
  content: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export interface DownloadFile {
  filename: string
  content: string
  mimeType?: string
}

/**
 * Triggers each file's download from a single synchronous loop so the whole
 * batch stays inside the click event's user-activation window.
 */
export function triggerDownloads(files: DownloadFile[]): void {
  for (const file of files) {
    triggerDownload(file.filename, file.content, file.mimeType ?? 'text/plain')
  }
}
