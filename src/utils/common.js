import { encode } from 'he';

export const escapeHTML = (text) => encode(String(text));

export const createIdMap = (items = []) => new Map(items.map((item) => [item.id, item]));

export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
