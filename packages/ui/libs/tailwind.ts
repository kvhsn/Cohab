import { type TailwindClass } from '@/types';
import { extendTailwindMerge } from 'tailwind-merge';

// Extend tailwind-merge to recognize custom @theme colors
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'background-primary',
        'background-secondary',
        'background-tertiary',
        'dark-surface',
        'dark-surface-2',
        'dark-surface-3',
        'surface',
        'surface-2',
        'border',
        'dark-border',
        'error',
        'warning',
        'info',
        'success',
      ],
    },
  },
});

export const tw = (classes: string) => classes;
export const cn = (...classes: (string | undefined | null | false)[]) =>
  twMerge(...(classes.filter(Boolean) as string[]));
export type TwSize = 'xs' | 'sm' | 'md' | 'lg';

export const buttonStateStyles = {
  enabled: tw('active:scale-[0.95] active:opacity-90'),
  disabled: tw('opacity-50'),
} satisfies Record<'enabled' | 'disabled', TailwindClass>;
