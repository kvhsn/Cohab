import MemberAvatar from '@/components/MemberAvatar/MemberAvatar';
import Typography from '@/components/Typography/Typography';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pressable, View } from 'react-native';
import { SummaryCard } from './SummaryCard';

const meta: Meta<typeof SummaryCard> = {
  title: 'Components/SummaryCard',
  component: SummaryCard,
  argTypes: {
    share: {
      control: { type: 'number' },
    },
    isAlone: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
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

export const Alone: Story = {
  args: {
    share: 324,
    isAlone: true,
  },
};

export const AloneEmpty: Story = {
  args: {
    share: 0,
    isAlone: true,
  },
};

const MockDebtRows = () => (
  <View className="mt-2 pt-3 border-t border-white/20 dark:border-slate-700/50 gap-1">
    <Pressable className="flex-row items-center gap-3 py-2 active:opacity-70">
      <MemberAvatar name="Alice" isAdmin={false} className="size-10" />
      <View className="flex-1">
        <Typography variant="body" weight="bold">
          Alice te doit
        </Typography>
        <Typography variant="caption" className="opacity-60">
          Dernier : Courses Lundi
        </Typography>
      </View>
      <Typography variant="body" weight="bold" className="text-primary">
        +15,00 €
      </Typography>
    </Pressable>
    <Pressable className="flex-row items-center gap-3 py-2 active:opacity-70">
      <MemberAvatar name="Thomas" isAdmin={false} className="size-10" />
      <View className="flex-1">
        <Typography variant="body" weight="bold">
          Tu dois à Thomas
        </Typography>
        <Typography variant="caption" className="opacity-60">
          Dernier : Pizza Party
        </Typography>
      </View>
      <Typography variant="body" weight="bold" className="text-rose-500">
        -12,50 €
      </Typography>
    </Pressable>
  </View>
);

export const ExpandableCollapsed: Story = {
  args: {
    share: 145.5,
    expandable: true,
    isExpanded: false,
  },
  render: (args) => (
    <SummaryCard {...args}>
      <MockDebtRows />
    </SummaryCard>
  ),
};

export const ExpandableExpanded: Story = {
  args: {
    share: 145.5,
    expandable: true,
    isExpanded: true,
  },
  render: (args) => (
    <SummaryCard {...args}>
      <MockDebtRows />
    </SummaryCard>
  ),
};
