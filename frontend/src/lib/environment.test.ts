import { describe, expect, it } from 'vitest';
import environment, { environment as namedEnvironment } from './environment';

describe('environment', () => {
  it('exports the same config as default and named export', () => {
    expect(environment).toEqual(namedEnvironment);
    expect(environment.backendUrl).toMatch(/^http/);
  });
});
