import { en } from './en';
import { pl } from './pl';
import { uk } from './uk';
import { ru } from './ru';

export const translations = {
    en,
    pl,
    uk,
    ru,
} as const;

export type TranslationKey = keyof typeof en; 