import { Meta, StoryObj } from '@storybook/react-native';
import Screen from './Screen';
import { Text } from 'react-native';

const meta: Meta<typeof Screen> = {
  title: 'Components/Screen',
  component: Screen,
};

export default meta;

type Story = StoryObj<typeof Screen>;

export const Default: Story = {
  render: (args) => {
    return (
      <Screen {...args}>
        <Text>Adresse email</Text>
      </Screen>
    );
  },
};
