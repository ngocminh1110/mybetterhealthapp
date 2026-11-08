import { addDays, formatDayLabel, fromDateKey, lastNDays, toDateKey } from '../date';

describe('date utils', () => {
  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('converts a key back to the same local day', () => {
    expect(toDateKey(fromDateKey('2026-10-14'))).toBe('2026-10-14');
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('returns the last N days, oldest first', () => {
    expect(lastNDays('2026-10-14', 3)).toEqual(['2026-10-12', '2026-10-13', '2026-10-14']);
  });

  it('labels today and yesterday', () => {
    expect(formatDayLabel('2026-10-14', '2026-10-14')).toBe('Today');
    expect(formatDayLabel('2026-10-13', '2026-10-14')).toBe('Yesterday');
  });
});
