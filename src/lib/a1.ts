export type Category = 'Shapes' | 'Type' | 'Color';
export type Challenge = { title: string; brief: string; category: Category; tags: string[]; difficulty: string; art: string };

export const challenges: Challenge[] = [
  { title: 'Two shapes, one face', brief: 'Make a face using only two geometric shapes. No lines, no extras. Just personality.', category: 'Shapes', tags: ['Shapes', '15–20 min', 'Keep it simple'], difficulty: 'Easy does it', art: 'face' },
  { title: 'Your name, no letters', brief: 'Turn your name into a little symbol. Not a single letter allowed.', category: 'Type', tags: ['Type', '20 min', 'Make it personal'], difficulty: 'A little stretch', art: 'name' },
  { title: 'Four colors, one poster', brief: 'Design a tiny gig poster with exactly four colors. Make it sing.', category: 'Color', tags: ['Color', '20 min', 'Go bold'], difficulty: 'Easy does it', art: 'poster' },
  { title: 'The triangle logo', brief: 'Build a logo from three triangles. Pick an imaginary brand to give it a home.', category: 'Shapes', tags: ['Shapes', '15 min', 'Three triangles'], difficulty: 'Easy does it', art: 'triangle' },
  { title: 'Two-word sign', brief: 'Letter a two-word sign that makes someone stop and smile.', category: 'Type', tags: ['Type', '20 min', 'Say less'], difficulty: 'A little stretch', art: 'sign' },
  { title: 'Black and white, plus one', brief: 'Draw a still life in black and white. Let one bright color steal the show.', category: 'Color', tags: ['Color', '20 min', 'One bright accent'], difficulty: 'Easy does it', art: 'flower' },
  { title: 'A very tiny city', brief: 'Build a whole city in a square. Use just circles, squares, and triangles.', category: 'Shapes', tags: ['Shapes', '20 min', 'Think small'], difficulty: 'A little stretch', art: 'triangle' },
  { title: 'One letter, big feelings', brief: 'Choose one letter and give it a mood. Happy, nervous, loud? Let the shape do the talking.', category: 'Type', tags: ['Type', '15 min', 'Feel something'], difficulty: 'Easy does it', art: 'name' },
];

export type DailyChallenge = { date: string; index: number; swapped: boolean };
export type ClubState = { stamps: string[]; follows: string[]; daily: DailyChallenge | null };

export const emptyState: ClubState = { stamps: [], follows: [], daily: null };
export const STORAGE_KEY = 'a1-daily-club-v1';

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function defaultDaily(now: Date): DailyChallenge {
  const seed = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return { date: dateKey(now), index: seed % challenges.length, swapped: false };
}

export function currentDaily(daily: DailyChallenge | null, now: Date): DailyChallenge {
  return daily?.date === dateKey(now) ? daily : defaultDaily(now);
}

export function swapChallenge(daily: DailyChallenge | null, now: Date): DailyChallenge {
  const active = currentDaily(daily, now);
  return active.swapped ? active : { ...active, index: (active.index + 1) % challenges.length, swapped: true };
}

export function toggleStamp(stamps: string[], key: string): string[] {
  return stamps.includes(key) ? stamps.filter((stamp) => stamp !== key) : [...stamps, key];
}

export function stampToday(stamps: string[], now: Date): string[] {
  const key = dateKey(now);
  return stamps.includes(key) ? stamps : [...stamps, key];
}

export function secondsToMidnight(now: Date): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.ceil((midnight.getTime() - now.getTime()) / 1000));
}

export function weekDates(now: Date): Date[] {
  const sunday = new Date(now);
  sunday.setHours(12, 0, 0, 0);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sunday);
    day.setDate(day.getDate() + i);
    return day;
  });
}

export function readState(): ClubState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyState };
    const value = JSON.parse(raw);
    const daily = value.daily;
    return {
      stamps: Array.isArray(value.stamps)
        ? value.stamps.filter((v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v))
        : [],
      follows: Array.isArray(value.follows) ? value.follows.filter((v: unknown): v is string => typeof v === 'string') : [],
      daily:
        daily && typeof daily.date === 'string' && Number.isInteger(daily.index) && daily.index >= 0 && daily.index < challenges.length && typeof daily.swapped === 'boolean'
          ? daily
          : null,
    };
  } catch {
    return { ...emptyState };
  }
}

export function saveState(state: ClubState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* The club still works when browser storage is unavailable. */
  }
}
