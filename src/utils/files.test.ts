import { colorForFileType, fileTypeFromName, formatBytes } from './files';

describe('fileTypeFromName', () => {
  it('reconoce los tipos de archivo del proyecto', () => {
    expect(fileTypeFromName('Rubrica_prototipo.pdf')).toBe('PDF');
    expect(fileTypeFromName('Plantilla.docx')).toBe('DOC');
    expect(fileTypeFromName('Diagrama.PNG')).toBe('IMG');
    expect(fileTypeFromName('script.sql')).toBe('SQL');
    expect(fileTypeFromName('sin_extension')).toBe('OTRO');
  });
});

describe('colorForFileType', () => {
  it('asigna el color por tipo', () => {
    expect(colorForFileType('PDF')).toBe('red');
    expect(colorForFileType('SQL')).toBe('purple');
    expect(colorForFileType('OTRO')).toBe('muted');
  });
});

describe('formatBytes', () => {
  it('usa KB por debajo de 1 MB y MB con coma decimal', () => {
    expect(formatBytes(240 * 1024)).toBe('240 KB');
    expect(formatBytes(1.1 * 1024 * 1024)).toBe('1,1 MB');
  });
});
