import './engine';
import { persistentAtom } from '@nanostores/persistent';
import type { Step } from '../data/types';
import type { Priority, Tolerance } from '../data/taxonomy';
import type { SkinType } from '../data/types';

export type SlotKey = `${'am' | 'pm'}-${Step}`;
export type Picks = Partial<Record<SlotKey, string | null>>;

export interface QuizAnswers {
  skin: SkinType;
  priority: Priority;
  tolerance: Tolerance;
}

export interface QuizState {
  answers: QuizAnswers;
  picks: Picks;
  at: number;
}

const json = <T,>(fallback: T) => ({
  encode: JSON.stringify,
  decode: (raw: string): T => {
    try {
      return (JSON.parse(raw) as T) ?? fallback;
    } catch {
      return fallback;
    }
  },
});

/** Saved quiz result: answers plus the picks the shopper settled on. */
export const $quiz = persistentAtom<QuizState | null>('verum:quiz', null, json<QuizState | null>(null));

/** Routine builder slots. */
export const $routine = persistentAtom<Picks>('verum:routine', {}, json<Picks>({}));
