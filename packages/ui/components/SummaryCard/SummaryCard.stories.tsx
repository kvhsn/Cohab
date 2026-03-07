import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard } from './SummaryCard';

const meta: Meta<typeof SummaryCard> = {
  title: 'Components/SummaryCard',
  component: SummaryCard,
  argTypes: {
    share: {
      control: { type: 'number' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SummaryCard>;

export const Positive: Story = {
  args: {
    share: 42.5,
  },
};

export const Negative: Story = {
  args: {
    share: -18.75,
  },
};

export const Balanced: Story = {
  args: {
    share: 0,
  },
};
