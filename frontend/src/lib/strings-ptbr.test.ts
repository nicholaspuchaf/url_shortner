import { describe, expect, it } from 'vitest';
import { stringsPtBr } from './strings-ptbr';

describe('stringsPtBr', () => {
  it('contains the main landing page copy', () => {
    expect(stringsPtBr.brand).toBe('TINYURL');
    expect(stringsPtBr.hero.primaryCta).toBe('Ver planos');
    expect(stringsPtBr.shortenerCard.qrSubmit).toBe('Gerar QR Code');
  });
});
