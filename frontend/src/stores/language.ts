import { persistentAtom } from '@nanostores/persistent';
export const languageStore = persistentAtom<"en" | "en-ph">("en");