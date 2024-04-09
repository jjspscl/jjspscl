import { persistentAtom } from '@nanostores/persistent';
export const themeStore = persistentAtom<"dark" | "light" | "auto">("theme", "dark"); 