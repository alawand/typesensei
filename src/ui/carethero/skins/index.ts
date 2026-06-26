import { orbSkin } from './orb';
import { brushSkin } from './brush';
import type { CaretSkin } from '../types';

// Register caret skins here. Adding one is a single line + a new file in skins/.
export const SKINS: Record<string, CaretSkin> = {
  [orbSkin.id]: orbSkin,
  [brushSkin.id]: brushSkin,
};

export const DEFAULT_SKIN = orbSkin.id;
