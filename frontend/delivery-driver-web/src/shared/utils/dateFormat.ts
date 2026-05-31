import { format, parseISO } from 'date-fns';

export function formatDateTime(value?: string | null): string {
  if (!value) return 'Not scheduled';
  return format(parseISO(value), 'dd MMM yyyy, HH:mm');
}

export function formatTimeWindow(start?: string | null, end?: string | null): string {
  if (!start && !end) return 'No time window';
  if (start && end) return `${formatDateTime(start)} - ${format(parseISO(end), 'HH:mm')}`;
  return start ? `From ${formatDateTime(start)}` : `Until ${formatDateTime(end)}`;
}
