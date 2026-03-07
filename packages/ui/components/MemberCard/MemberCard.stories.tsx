import type { Meta, StoryObj } from '@storybook/react';
import MemberCard from './MemberCard';

const meta: Meta<typeof MemberCard> = {
  title: 'Components/MemberCard',
  component: MemberCard,
  argTypes: {
    isMemberAdmin: {
      control: 'boolean',
    },
    onRemove: { action: 'removed' },
  },
};

export default meta;

type Story = StoryObj<typeof MemberCard>;

const defaultMember = {
  email: 'test@example.com',
  id: 'test',
  name: 'test',
  image: undefined,
};

export const Default: Story = {
  args: {
    isMemberAdmin: false,
    member: defaultMember,
    onRemove: undefined,
  },
};

export const RemoveableMember: Story = {
  args: {
    isMemberAdmin: false,
    member: defaultMember,
    onRemove: undefined,
  },
  render: (args) => <MemberCard {...args} onRemove={(val) => console.log('Remove', val)} />,
};

export const Admin: Story = {
  args: {
    isMemberAdmin: true,
    member: defaultMember,
  },
};
