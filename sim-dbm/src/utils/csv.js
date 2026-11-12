// Bangun teks CSV dari baris objek; columns = [{ key, label }]
export function toCSV(columns, rows) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const lines = [columns.map((c) => escape(c.label)).join(',')]
  rows.forEach((row) => lines.push(columns.map((c) => escape(row[c.key])).join(',')))
  return lines.join('\n')
}

export function downloadCSV(filename, text) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
