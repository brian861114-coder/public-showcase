export const categories = [
  { value: 'all', label: '全部文章' },
  { value: 'essay', label: '隨筆' },
  { value: 'tech', label: '技術' },
  { value: 'life', label: '生活' },
  { value: 'learn', label: '學習' },
] as const;

export type CategoryValue = (typeof categories)[number]['value'];

export function categoryLabel(value: string): string {
  return categories.find((item) => item.value === value)?.label ?? value;
}
