import type { AddressDto } from '../../entities/address';

function queryFromAddress(address: AddressDto): string {
  if (address.latitude != null && address.longitude != null) {
    return `${address.latitude},${address.longitude}`;
  }
  return address.summary;
}

export function getGoogleMapsUrl(address: AddressDto): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryFromAddress(address))}`;
}

export function getWazeUrl(address: AddressDto): string {
  if (address.latitude != null && address.longitude != null) {
    return `https://waze.com/ul?ll=${address.latitude},${address.longitude}&navigate=yes`;
  }
  return `https://waze.com/ul?q=${encodeURIComponent(address.summary)}&navigate=yes`;
}
