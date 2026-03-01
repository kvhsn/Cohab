// create the story for logo component
import { Meta, StoryObj } from '@storybook/react-native';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  args: {
    size: 100,
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    size: 100,
  },
};
