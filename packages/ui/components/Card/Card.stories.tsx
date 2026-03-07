import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import Typography from '../Typography/Typography';
import Card from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as any,
  render: () => (
    <Card>
      <View>
        <Typography variant="body" className="font-bold mb-2">
          Card Title
        </Typography>
        <Typography variant="bodySmall">
          This is the content of a basic card. It uses the premium glassmorphism effect.
        </Typography>
      </View>
    </Card>
  ),
};

export const WithCustomPadding: Story = {
  args: {
    className: 'p-10',
  } as any,
  render: (args) => (
    <Card {...args}>
      <View>
        <Typography variant="body" className="font-bold">
          More Padding
        </Typography>
      </View>
    </Card>
  ),
};
