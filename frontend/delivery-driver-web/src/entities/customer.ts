export interface CustomerSummaryDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
}
