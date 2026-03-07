import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import OTPInput from './OTPInput';

const meta = {
  title: 'Components/OTPInput',
  component: OTPInput,
  argTypes: {
    onCodeFilled: { action: 'onCodeFilled' },
    onChange: { action: 'onChange' },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof OTPInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    length: 6,
  },
};

/**
 * Interactive version with local state to test the flow
 */
export const Interactive: Story = {
  render: function InteractiveRender(args) {
    const [value, setValue] = useState('');
    return (
      <OTPInput
        {...args}
        value={value}
        onChange={(val) => {
          setValue(val);
          args.onChange?.(val);
        }}
        onCodeFilled={(val) => {
          args.onCodeFilled?.(val);
        }}
      />
    );
  },
};

export const Filled: Story = {
  args: {
    value: '123456',
  },
};

export const Disabled: Story = {
  args: {
    value: '123456',
    disabled: true,
  },
};

export const CustomLength: Story = {
  args: {
    length: 4,
    value: '1234',
  },
};

export const WithError: Story = {
  args: {
    value: '12',
    error: 'Code invalide ou expiré',
  },
};
