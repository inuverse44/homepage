export function formatDateISO(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString();
}

export function formatDateHuman(date: string | Date, locale: string = 'ja-JP'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

