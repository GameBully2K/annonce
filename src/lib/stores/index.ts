import { writable } from 'svelte/store';
import type { Publication, Draft } from '../types';

export const selectedPublicationStore = writable<Publication | null>(null);

export const newPublicationStateStore = writable(false);

export const toBeEditedPublicationStore = writable<Draft | null>(null);