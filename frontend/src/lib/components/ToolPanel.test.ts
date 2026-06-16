import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolPanel from './ToolPanel.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('ToolPanel', () => {
  it('shows the shortener form by default', () => {
    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    expect(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.shortenerTab })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(`${stringsPtBr.shortenerCard.longUrlLabel} *`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit })).toBeInTheDocument();
  });

  it('switches to the QR mode when the QR tab is clicked', async () => {
    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    await fireEvent.click(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.qrTab }));

    expect(screen.getByRole('heading', { level: 3, name: stringsPtBr.shortenerCard.qrTitle })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.shortenerCard.qrSubmit })).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.shortenerCard.qrPreviewHint)).toBeInTheDocument();
  });
});
