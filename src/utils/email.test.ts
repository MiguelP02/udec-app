import { isInstitutionalEmail, normalizeEmail } from './email';

describe('isInstitutionalEmail', () => {
  it('acepta correos institucionales sin importar mayúsculas o espacios', () => {
    expect(isInstitutionalEmail('A.B@UCundinamarca.edu.co ')).toBe(true);
  });

  it('rechaza correos personales y dominios parecidos', () => {
    expect(isInstitutionalEmail('x@gmail.com')).toBe(false);
    expect(isInstitutionalEmail('x@ucundinamarca.edu.co.fake')).toBe(false);
    expect(isInstitutionalEmail('@ucundinamarca.edu.co')).toBe(false);
  });
});

describe('normalizeEmail', () => {
  it('quita espacios y pasa a minúsculas', () => {
    expect(normalizeEmail('  Test@GMAIL.com ')).toBe('test@gmail.com');
  });
});
