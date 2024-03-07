import { get, writable } from 'svelte/store';

export const keywords = writable<string[]>([]);

export const addKeyword = (keyword: string) => {
  if (keyword === '') return;
  if (get(keywords).includes(keyword)) return;
  keywords.update((keywords) => [...keywords, keyword]);
};

export const removeKeyword = (keyword: string) => {
  keywords.update((keywords) => keywords.filter((k) => k !== keyword));
};
