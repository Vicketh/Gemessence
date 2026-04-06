import { describe, it, expect } from 'vitest';

// Simulate the formatPrice logic used in the app
function formatKES(amount: number | string): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
}

function formatUSD(amount: number | string): string {
  const kesAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const usdAmount = kesAmount / 130; // Exchange rate
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(usdAmount);
}

describe('Currency Formatting', () => {
  it('formats KES correctly', () => {
    expect(formatKES(1000)).toMatch(/Ksh[\s\u00a0]1,000\.00/);
    expect(formatKES('50000.00')).toMatch(/Ksh[\s\u00a0]50,000\.00/);
    expect(formatKES(125000)).toMatch(/Ksh[\s\u00a0]125,000\.00/);
  });

  it('formats USD correctly (1 USD = 130 KES)', () => {
    expect(formatUSD(13000)).toBe('$100.00');
    expect(formatUSD('13000.00')).toBe('$100.00');
    expect(formatUSD(1000)).toBe('$7.69');
  });

  it('handles zero amounts', () => {
    expect(formatKES(0)).toMatch(/Ksh[\s\u00a0]0\.00/);
    expect(formatUSD(0)).toBe('$0.00');
  });

  it('handles decimal amounts', () => {
    expect(formatKES(999.99)).toMatch(/Ksh[\s\u00a0]999\.99/);
    expect(formatKES('12345.67')).toMatch(/Ksh[\s\u00a0]12,345\.67/);
  });
});

describe('Order Calculations', () => {
  const VAT_RATE = 0.16; // 16% Kenya VAT

  function calculateOrder(subtotal: number, shippingCost: number, discount: number = 0) {
    const tax = subtotal * VAT_RATE;
    const total = subtotal + shippingCost + tax - discount;
    return { tax, total };
  }

  it('calculates VAT correctly', () => {
    const { tax } = calculateOrder(10000, 500);
    expect(tax).toBe(1600);
  });

  it('calculates total correctly', () => {
    const { total } = calculateOrder(50000, 500);
    expect(total).toBe(58500); // 50000 + 500 + 8000
  });

  it('applies discount correctly', () => {
    const { total } = calculateOrder(50000, 500, 5000);
    expect(total).toBe(53500); // 50000 + 500 + 8000 - 5000
  });
});
