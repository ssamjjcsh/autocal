export const formatNumber = (value: string | number): string => {
  if (value === '' || value === null || value === undefined) return ''
  const num = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value
  if (num === '' || isNaN(Number(num))) return ''

  const parts = String(num).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const parseNumber = (value: string): number => {
  if (value === '' || value === null || value === undefined) return 0
  const num = Number(value.replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? 0 : num
}