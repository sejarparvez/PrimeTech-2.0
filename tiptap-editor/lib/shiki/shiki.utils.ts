import type { SpecialLanguage } from '@shikijs/types';
import { supportedLanguages } from './shiki.config';

export function getSupportedLanguages() {
  return Object.entries(supportedLanguages).map(([key, value]) => ({
    label: value.name,
    value: key,
    alias: value.aliases.join(', '),
  }));
}

export function isSpecialLanguage(lang: string): lang is SpecialLanguage {
  const special = ['plaintext', 'txt', 'text', 'plain', 'ansi'];
  return special.includes(lang);
}
