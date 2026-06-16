import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HeroSection from './HeroSection.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('HeroSection', () => {
  it('renders the hero copy, CTAs and metrics', () => {
    render(HeroSection, {
      props: {
        accessibility: stringsPtBr.accessibility,
        hero: stringsPtBr.hero,
        metrics: stringsPtBr.metrics,
      },
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(stringsPtBr.hero.titleLine1);
    expect(screen.getByRole('link', { name: stringsPtBr.hero.primaryCta })).toHaveAttribute('href', '#plans');
    expect(screen.getByText(stringsPtBr.metrics[0].value)).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.metrics[1].label)).toBeInTheDocument();
  });
});
