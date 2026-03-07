import type { Meta, StoryObj } from '@storybook/react';
import Icon from '../Icon/Icon';
import CustomButton from './Button';

const meta: Meta<typeof CustomButton> = {
  title: 'Components/Button',
  component: CustomButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    onPress: { action: 'pressed' },
  },
  args: {
    title: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof CustomButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
  },
};

export const Link: Story = {
  args: {
    title: 'Mot de passe oublié ?',
    variant: 'link',
    size: 'lg',
  },
};

export const Danger: Story = {
  args: {
    title: 'Bouton danger',
    variant: 'danger',
    size: 'lg',
  },
};

export const WithLeftIcon: Story = {
  args: {
    title: 'Ajouter un coloc',
    variant: 'primary',
    size: 'lg',
  },
  render: (args) => (
    <CustomButton
      {...args}
      LeftIcon={(props) => <Icon as="Ionicons" name="person-add" {...props} />}
    />
  ),
};

export const WithRightIcon: Story = {
  args: {
    title: 'Continuer',
    variant: 'primary',
    size: 'lg',
  },
  render: (args) => (
    <CustomButton
      {...args}
      RightIcon={(props) => <Icon as="Ionicons" name="arrow-forward" {...props} />}
    />
  ),
};

export const Disabled: Story = {
  args: {
    title: 'Bouton désactivé',
    variant: 'primary',
    size: 'lg',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    title: 'Petit bouton',
    variant: 'secondary',
    size: 'xs',
  },
};
