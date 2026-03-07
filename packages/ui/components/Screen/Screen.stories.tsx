import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import Screen from './Screen';

const meta: Meta<typeof Screen> = {
  title: 'Components/Screen',
  component: Screen,
};

export default meta;

type Story = StoryObj<typeof Screen>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    return (
      <Screen {...args}>
        <Text>Adresse email</Text>
      </Screen>
    );
  },
};
