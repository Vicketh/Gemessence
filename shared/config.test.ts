import { describe, it, expect } from 'vitest';
import { KENYAN_COUNTIES, METAL_TYPES, GEMSTONE_TYPES, RING_SIZES, CHAIN_LENGTHS } from '@shared/schema';

describe('Configuration Constants', () => {
  it('has all 47 Kenyan counties', () => {
    expect(KENYAN_COUNTIES).toHaveLength(47);
  });

  it('includes major counties', () => {
    expect(KENYAN_COUNTIES).toContain('Nairobi');
    expect(KENYAN_COUNTIES).toContain('Mombasa');
    expect(KENYAN_COUNTIES).toContain('Kisumu');
    expect(KENYAN_COUNTIES).toContain('Nakuru');
  });

  it('has all metal types', () => {
    expect(METAL_TYPES).toContain('18k Gold');
    expect(METAL_TYPES).toContain('Platinum');
    expect(METAL_TYPES).toContain('Sterling Silver');
  });

  it('has all gemstone types', () => {
    expect(GEMSTONE_TYPES).toContain('Diamond');
    expect(GEMSTONE_TYPES).toContain('Ruby');
    expect(GEMSTONE_TYPES).toContain('Sapphire');
    expect(GEMSTONE_TYPES).toContain('Emerald');
  });

  it('has ring sizes 4-12', () => {
    expect(RING_SIZES).toEqual(['4', '5', '6', '7', '8', '9', '10', '11', '12']);
  });

  it('has chain lengths', () => {
    expect(CHAIN_LENGTHS).toContain('16 inches');
    expect(CHAIN_LENGTHS).toContain('18 inches');
    expect(CHAIN_LENGTHS).toContain('24 inches');
  });
});
