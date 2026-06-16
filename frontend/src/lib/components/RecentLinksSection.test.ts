import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RecentLinksSection from './RecentLinksSection.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('RecentLinksSection', () => {
  it('renders the recent links list', () => {
    render(RecentLinksSection, {
      props: {
        recentLinks: stringsPtBr.recentLinks,
      },
    });

    expect(screen.getByRole('heading', { name: stringsPtBr.recentLinks.title })).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.recentLinks.items[0].title)).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.recentLinks.emptyState)).toBeInTheDocument();
  });
});
