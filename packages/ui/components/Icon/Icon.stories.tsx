import { Meta, StoryObj } from '@storybook/react-native';
import Icon from './Icon';
import * as Icons from '@expo/vector-icons';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    as: {
      control: 'select',
      options: Object.keys(Icons),
    },
    name: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    as: 'Ionicons',
    name: 'add',
    size: 'sm',
  },
};
