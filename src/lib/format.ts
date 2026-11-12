const TIME_ZONE = 'Asia/Kuala_Lumpur';

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const moneyFormat = new Intl.NumberFormat('en-MY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "12 Nov 2026, 8:00 PM", always in Malaysia time. */
export function formatDateTime(d: Date | string): string {
  const parts = dateTimeFormat.formatToParts(typeof d === 'string' ? new Date(d) : d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${get('dayPeriod').toUpperCase()}`;
}

/** "RM 1,250.00" */
export function formatRM(amount: number): string {
  return `RM ${moneyFormat.format(amount)}`;
}
