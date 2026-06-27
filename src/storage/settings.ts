import { DEFAULT_SKIN } from '../ui/carethero/skins';
import { DEFAULT_PACK } from '../audio/packs';

export interface Settings {
  gameOn: boolean; // caret "Flow" effect on/off
  caretSkin: string;
  soundOn: boolean; // typing sound on/off
  soundPack: string;
}

const KEY = 'typesensei:settings';

const DEFAULTS: Settings = {
  gameOn: true,
  caretSkin: DEFAULT_SKIN,
  soundOn: false,
  soundPack: DEFAULT_PACK,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore (private mode etc.)
  }
}
