import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { Pressable } from 'react-native';
import Icon from '../Icon/Icon';
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

export const WithRightElement: Story = {
  args: {
    placeholder: 'Search…',
    iconName: 'search',
    rightElement: (
      <Pressable onPress={() => {}}>
        <Icon
          as="Ionicons"
          name="close-circle"
          size="md"
          className="text-gray-400 dark:text-gray-500"
        />
      </Pressable>
    ),
  },
  argTypes: {
    rightElement: { control: false },
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your name',
    error: 'This field is required',
    value: 'John',
  },
};
