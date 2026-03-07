import type { Decorator, Preview } from '@storybook/react';
import { View } from 'react-native';

const centerDecorator: Decorator = (Story, context) => {
  const isFullscreen = context.parameters?.layout === 'fullscreen';

  if (isFullscreen) {
    return <Story />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Story />
    </View>
  );
};

const preview: Preview = {
  decorators: [centerDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
  },
};

export default preview;
