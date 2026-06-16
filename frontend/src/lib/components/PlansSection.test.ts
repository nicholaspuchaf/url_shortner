import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PlansSection from './PlansSection.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('PlansSection', () => {
  it('renders the plan highlights and visual labels', () => {
    render(PlansSection, {
      props: {
        plansSection: stringsPtBr.plansSection,
        formSections: stringsPtBr.formSections,
      },
    });

    expect(screen.getByRole('heading', { name: stringsPtBr.plansSection.heading })).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.formSections.urlType)).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.plansSection.items[0])).toBeInTheDocument();
  });
});
