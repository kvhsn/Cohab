import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import SettingsItem from './SettingsItem';

const meta: Meta<typeof SettingsItem> = {
  title: 'Components/SettingsItem',
  component: SettingsItem,
  decorators: [
    (Story) => (
      <View className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    iconName: { control: 'text' },
    label: { control: 'text' },
    subtitle: { control: 'text' },
    onPress: { action: 'pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof SettingsItem>;

export const Default: Story = {
  args: {
    label: 'Gérer les membres',
    iconName: 'people',
  },
};

export const WithSubtitle: Story = {
  args: {
    label: 'Nom',
    subtitle: 'Modifier le nom',
    iconName: 'pencil',
  },
};

export const List: Story = {
  render: () => (
    <View className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <SettingsItem
        label="Nom"
        subtitle="Modifier le nom"
        iconName="pencil"
        className="border-b border-gray-50 dark:border-slate-700"
      />
      <SettingsItem
        label="Gérer les membres"
        iconName="people"
        className="border-b border-gray-50 dark:border-slate-700"
      />
      <SettingsItem label="Créer un code d'invitation" iconName="key" />
    </View>
  ),
};
