import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    iconName: {
      control: 'text',
    },
  },
  args: {
    iconName: 'receipt-outline',
    title: 'Aucune dépense',
    description: 'Ajoutez votre première dépense pour commencer à suivre les frais de la coloc.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expenses: Story = {
  args: {
    iconName: 'receipt-outline',
    title: 'Aucune dépense',
    description: 'Ajoutez votre première dépense pour commencer à suivre les frais de la coloc.',
  },
};

export const Tasks: Story = {
  args: {
    iconName: 'checkbox-outline',
    title: 'Aucune tâche',
    description: 'Créez des tâches pour organiser la vie de la coloc.',
  },
};

export const Members: Story = {
  args: {
    iconName: 'people-outline',
    title: 'Aucun membre',
    description: 'Invitez vos colocataires pour commencer.',
  },
};
