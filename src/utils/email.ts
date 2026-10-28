const INSTITUTIONAL = /^[^@\s]+@ucundinamarca\.edu\.co$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isInstitutionalEmail(value: string): boolean {
  return INSTITUTIONAL.test(normalizeEmail(value));
}
