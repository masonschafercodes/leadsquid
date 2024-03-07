import { get, writable } from 'svelte/store';

export const keywords = writable<string[]>([]);

export const addKeyword = (keyword: string) => {
  if (keyword === '') return;
  if (get(keywords).includes(keyword)) return;
  keywords.update((keywords) => [...keywords, keyword]);
};
