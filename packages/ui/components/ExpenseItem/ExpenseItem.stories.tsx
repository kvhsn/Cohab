import type { Meta, StoryObj } from '@storybook/react';
import ExpenseItem from './ExpenseItem';

const meta = {
  title: 'Components/ExpenseItem',
  component: ExpenseItem,
  argTypes: {
    category: {
      control: 'select',
      options: ['GROCERIES', 'RENT', 'ELECTRICITY', 'OTHER'],
    },
    amount: {
      control: { type: 'number', min: 0, step: 0.5 },
    },
    isMine: {
      control: 'boolean',
    },
  },
  args: {
    name: 'Courses Carrefour',
    amount: 42.5,
    category: 'GROCERIES',
    memberName: 'Kevin',
    createdAt: '2026-04-09T18:00:00Z',
    isMine: false,
  },
} satisfies Meta<typeof ExpenseItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Groceries: Story = {
  args: {
    name: 'Courses Carrefour',
    amount: 42.5,
    category: 'GROCERIES',
    memberName: 'Kevin',
    createdAt: '2026-04-09T18:00:00Z',
  },
};

export const Rent: Story = {
  args: {
    name: 'Loyer avril',
    amount: 850,
    category: 'RENT',
    memberName: 'Sarah',
    createdAt: '2026-04-01T10:00:00Z',
  },
};

export const Electricity: Story = {
  args: {
    name: 'Facture EDF',
    amount: 120.75,
    category: 'ELECTRICITY',
    memberName: 'Lucas',
    createdAt: '2026-03-28T14:30:00Z',
  },
};

export const Other: Story = {
  args: {
    name: 'Produits ménagers',
    amount: 15.9,
    category: 'OTHER',
    memberName: 'Léa',
    createdAt: '2026-04-05T09:15:00Z',
  },
};

export const LargeAmount: Story = {
  args: {
    name: 'Caution appartement',
    amount: 2400,
    category: 'RENT',
    memberName: 'Kevin',
    createdAt: '2026-01-15T12:00:00Z',
  },
};

export const SmallAmount: Story = {
  args: {
    name: 'Éponges',
    amount: 1.2,
    category: 'GROCERIES',
    memberName: 'Sarah',
    createdAt: '2026-04-08T20:00:00Z',
  },
};

export const PaidByMe: Story = {
  args: {
    name: 'Courses Lidl',
    amount: 38.9,
    category: 'GROCERIES',
    memberName: 'Moi',
    createdAt: '2026-04-09T12:00:00Z',
    isMine: true,
  },
};
