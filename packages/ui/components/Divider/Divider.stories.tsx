import type { Meta, StoryObj } from '@storybook/react-native';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    title: 'Divider Content',
  },
};

export const NoTitle: Story = {
  args: {},
};
