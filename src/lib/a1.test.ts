import { describe, expect, it } from 'vitest';
import { challenges, currentDaily, dateKey, secondsToMidnight, stampToday, swapChallenge, toggleStamp, weekDates } from './a1';

const noon = new Date(2026, 9, 14, 12, 0, 0); // Wed 14 Oct 2026, local time

describe('A1 club logic', () => {
  it('formats local date keys', () => {
    expect(dateKey(noon)).toBe('2026-10-14');
  });

  it('counts down to local midnight', () => {
    expect(secondsToMidnight(noon)).toBe(12 * 3600);
    expect(secondsToMidnight(new Date(2026, 9, 14, 23, 59, 59))).toBe(1);
  });

  it('stamps today once and toggles days', () => {
    const once = stampToday([], noon);
    expect(stampToday(once, noon)).toEqual(once);
    expect(toggleStamp(once, '2026-10-14')).toEqual([]);
    expect(toggleStamp([], '2026-10-13')).toEqual(['2026-10-13']);
  });

  it('allows one swap per day, then keeps the swapped challenge', () => {
    const first = currentDaily(null, noon);
    const swapped = swapChallenge(null, noon);
    expect(swapped.swapped).toBe(true);
    expect(swapped.index).toBe((first.index + 1) % challenges.length);
    expect(swapChallenge(swapped, noon)).toEqual(swapped);
    expect(currentDaily(swapped, new Date(2026, 9, 15, 9)).swapped).toBe(false);
  });

  it('builds a Sunday to Saturday week', () => {
    const week = weekDates(noon);
    expect(week).toHaveLength(7);
    expect(week[0].getDay()).toBe(0);
    expect(week[6].getDay()).toBe(6);
    expect(week.map(dateKey)).toContain('2026-10-14');
  });
});
