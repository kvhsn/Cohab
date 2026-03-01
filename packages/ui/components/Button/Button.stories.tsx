// create button stories
import { Meta, StoryObj } from '@storybook/react-native';
import { CustomButton } from './Button';
import Ionicons from '@expo/vector-icons/Ionicons';

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
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomButton>;

export const Default: Story = {
  args: {
    title: 'Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const LeftButtonIcon: Story = {
  args: {
    title: 'Left Icon',
    variant: 'primary',
    size: 'lg',
    LeftIcon: (props) => <Ionicons name="add" {...props} />,
  },
};

export const RightButtonIcon: Story = {
  args: {
    title: 'Right Icon',
    variant: 'primary',
    size: 'lg',
    RightIcon: (props) => <Ionicons name="arrow-forward" {...props} />,
  },
};

export const BothIcons: Story = {
  args: {
    title: 'Both Icons',
    variant: 'primary',
    size: 'lg',
    LeftIcon: (props) => <Ionicons name="star" {...props} />,
    RightIcon: (props) => <Ionicons name="chevron-forward" {...props} />,
  },
};
export const Link: Story = {
  args: {
    title: 'Créer un compte',
    variant: 'link',
    size: 'lg',
  },
};
