import type { ColorToken } from '../theme';

export type FileType = 'PDF' | 'DOC' | 'XLS' | 'PPT' | 'IMG' | 'SQL' | 'TXT' | 'OTRO';

export function fileTypeFromName(name: string): FileType {
  const ext = name.includes('.') ? (name.split('.').pop() ?? '').toLowerCase() : '';
  switch (ext) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOC';
    case 'xls':
    case 'xlsx':
      return 'XLS';
    case 'ppt':
    case 'pptx':
      return 'PPT';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'IMG';
    case 'sql':
      return 'SQL';
    case 'txt':
      return 'TXT';
    default:
      return 'OTRO';
  }
}

export function colorForFileType(type: FileType): ColorToken {
  switch (type) {
    case 'PDF':
      return 'red';
    case 'DOC':
      return 'blue';
    case 'IMG':
    case 'XLS':
      return 'green';
    case 'SQL':
      return 'purple';
    case 'PPT':
      return 'rust';
    default:
      return 'muted';
  }
}

/** "240 KB" o "1,1 MB" (coma decimal, como en la app Flutter). */
export function formatBytes(bytes: number): string {
  const MB = 1024 * 1024;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1).replace('.', ',')} MB`;
}
