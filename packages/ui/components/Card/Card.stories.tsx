import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import Typography from '../Typography/Typography';
import Card from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#f0f4fa',
        }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <View>
        <Typography variant="body" className="font-bold mb-2">
          Card Title
        </Typography>
        <Typography variant="bodySmall">
          This is the content of a basic card. It uses the premium glassmorphism effect.
        </Typography>
      </View>
    ),
  },
};

export const WithCustomPadding: Story = {
  args: {
    className: 'p-10',
    children: (
      <View>
        <Typography variant="body" className="font-bold">
          More Padding
        </Typography>
      </View>
    ),
  },
};
