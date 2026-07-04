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

  it('renders generated links when they are available', () => {
    render(RecentLinksSection, {
      props: {
        recentLinks: stringsPtBr.recentLinks,
        generatedLinks: [
          {
            code: 'abc1234',
            url: 'https://example.com',
            shortUrl: 'http://localhost:3000/abc1234',
            createdAt: '2026-07-04T12:00:00.000Z',
          },
        ],
      },
    });

    expect(screen.queryByText(stringsPtBr.recentLinks.emptyState)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'http://localhost:3000/abc1234' })).toHaveAttribute(
      'href',
      'http://localhost:3000/abc1234',
    );
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });
});
