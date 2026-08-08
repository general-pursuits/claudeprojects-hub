import { BID_INCREMENT, formatTime, nextBid } from './auction';

describe('nextBid', () => {
  test('raises the bid by the fixed increment', () => {
    expect(nextBid(0)).toBe(BID_INCREMENT);
    expect(nextBid(120)).toBe(135);
  });

  test('is repeatable so consecutive bids keep climbing', () => {
    expect(nextBid(nextBid(nextBid(0)))).toBe(45);
  });
});

describe('formatTime', () => {
  test('zero-pads hours, minutes and seconds', () => {
    expect(formatTime(0)).toBe('00:00:00');
    expect(formatTime(9)).toBe('00:00:09');
    expect(formatTime(65)).toBe('00:01:05');
  });

  test('formats a full hour and mixed durations', () => {
    expect(formatTime(3600)).toBe('01:00:00');
    expect(formatTime(3661)).toBe('01:01:01');
  });

  test('keeps counting past 24 hours instead of wrapping', () => {
    expect(formatTime(90000)).toBe('25:00:00');
  });
});
