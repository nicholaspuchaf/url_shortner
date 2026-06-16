import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TopBar from './TopBar.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('TopBar', () => {
  it('renders navigation and auth links', () => {
    render(TopBar, {
      props: {
        brand: stringsPtBr.brand,
        accessibility: stringsPtBr.accessibility,
        navigation: stringsPtBr.navigation,
      },
    });

    expect(screen.getByText(stringsPtBr.brand)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.plans })).toHaveAttribute('href', '#plans');
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.login })).toHaveAttribute('href', '#login');
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.signUp })).toHaveAttribute('href', '#signup');
  });
});
