export interface AddressDto {
  id: string;
  line1: string;
  line2?: string | null;
  city: string;
  countyOrRegion?: string | null;
  postalCode?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  summary: string;
}
