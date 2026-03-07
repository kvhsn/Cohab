import type { Meta, StoryObj } from '@storybook/react';
import MemberAvatar from './MemberAvatar';

const meta: Meta<typeof MemberAvatar> = {
  title: 'Components/MemberAvatar',
  component: MemberAvatar,
  argTypes: {
    isAdmin: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
  },
  args: {
    name: 'John Doe',
    isAdmin: false,
  },
};

export default meta;

type Story = StoryObj<typeof MemberAvatar>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    isAdmin: false,
  },
};

export const Admin: Story = {
  args: {
    name: 'John Doe',
    isAdmin: true,
  },
};

export const SingleLetter: Story = {
  args: {
    name: 'A',
    isAdmin: false,
  },
};
