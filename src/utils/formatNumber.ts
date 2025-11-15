export const formatNumber = (value: number | string): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('ko-KR');
  }
  return value;
};

export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};