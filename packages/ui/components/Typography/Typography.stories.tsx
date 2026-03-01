import type { Meta, StoryObj } from '@storybook/react-native';
import Typography from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      defaultValue: 'h1',
      options: ['h1', 'subtitle', 'body', 'bodySmall', 'caption', 'button'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'h1',
  },
};
