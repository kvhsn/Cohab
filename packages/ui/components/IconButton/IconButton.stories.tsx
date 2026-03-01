import { Meta, StoryObj } from '@storybook/react-native';
import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    as: {
      control: 'select',
      options: ['Ionicons', 'FontAwesome6', 'MaterialCommunityIcons'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    as: 'Ionicons',
    name: 'add',
    variant: 'primary',
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    as: 'Ionicons',
    name: 'search',
    variant: 'secondary',
    size: 'lg',
  },
};

export const Ghost: Story = {
  args: {
    as: 'Ionicons',
    name: 'close',
    variant: 'ghost',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    as: 'Ionicons',
    name: 'heart',
    variant: 'primary',
    size: 'lg',
    disabled: true,
  },
};
