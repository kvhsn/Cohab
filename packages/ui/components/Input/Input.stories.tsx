// create input stories with default
import { Meta, StoryObj } from '@storybook/react-native';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Enter your name',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Enter your name',
    iconName: 'add',
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Enter your password',
    secureTextEntry: true,
  },
  argTypes: {
    secureTextEntry: {
      control: false,
    },
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your name',
    error: 'This field is required',
    value: 'John',
  },
};
