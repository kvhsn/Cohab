import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { Text } from 'react-native';
import Typography from '../Typography/Typography';
import Banner from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  argTypes: {
    variant: {
      control: 'select',
      options: ['information', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Information: Story = {
  args: {
    variant: 'information',
  },
  render: (args) => (
    <Banner {...args}>
      <Typography variant="body">
        Le futur membre devra saisir ce code lors de son inscription pour rejoindre automatiquement
        le groupe <Text className="text-blue-500 font-bold">"Appart' des Amis"</Text>.
      </Typography>
    </Banner>
  ),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
  render: (args) => (
    <Banner {...args}>
      <Typography variant="body">
        Ce code est valable <Text className="text-yellow-600 font-bold">7 jours</Text>. Pensez à le
        renouveler avant expiration.
      </Typography>
    </Banner>
  ),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
  render: (args) => (
    <Banner {...args}>
      <Typography variant="body">
        Cette action est <Text className="text-red-500 font-bold">irréversible</Text>. Le groupe
        sera définitivement supprimé.
      </Typography>
    </Banner>
  ),
};
