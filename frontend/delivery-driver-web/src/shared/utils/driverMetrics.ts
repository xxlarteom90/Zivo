import type { OrderListItemDto } from '../entities/order';

// Backend does not yet expose fees/tips/distance on OrderListItemDto. To make
// the new Wolt/Bolt-style screens feel real (instead of all zeros), we derive
// stable, deterministic values from the order id. Replace with real fields
// when the API exposes them.

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface DerivedOrderMetrics {
  distanceKm: number;
  fareRon: number;
  tipRon: number;
  paymentMethod: 'Cash' | 'Card';
  acceptedAt: Date;
  deliveredAt: Date;
}

export function deriveMetrics(order: OrderListItemDto): DerivedOrderMetrics {
  const h = hash(order.id);
  const distanceKm = 1 + (h % 1100) / 100; // 1.00 – 12.00 km
  const fareRon = 8 + (h % 2500) / 100; // 8.00 – 33.00 RON
  const tipBucket = h % 10;
  const tipRon = tipBucket < 7 ? 0 : tipBucket === 7 ? 4 : tipBucket === 8 ? 10 : 5;
  const paymentMethod: 'Cash' | 'Card' = h % 3 === 0 ? 'Cash' : 'Card';

  const base = order.deliveryWindowEndUtc || order.pickupWindowEndUtc || new Date().toISOString();
  const deliveredAt = new Date(base);
  const acceptedAt = new Date(deliveredAt.getTime() - 30 * 60 * 1000);
  return { distanceKm, fareRon, tipRon, paymentMethod, acceptedAt, deliveredAt };
}

export function formatRon(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} RON`;
}

export function formatKm(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} km`;
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDateRo(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatDateLongRo(d: Date): string {
  const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
