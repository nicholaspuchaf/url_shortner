import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import App from './App.svelte';
import { stringsPtBr } from './lib/strings-ptbr';

describe('App', () => {
  it('renders the complete landing page', () => {
    render(App);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.shortenerTab })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.recentLinks.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.plansSection.heading })).toBeInTheDocument();
  });
});
