import { basename } from '@std/path';

export type FileSystemPath = string & { __brand: 'FilePath' };

export function getBaseName (path: FileSystemPath, suffix?: string): string {
	return basename(path, suffix);
}
