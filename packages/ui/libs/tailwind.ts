import { type TailwindClass } from '@/types';

export const tw = (classes: string) => classes;
export type TwSize = 'sm' | 'md' | 'lg';

export const buttonStateStyles = {
  enabled: tw('active:scale-[0.95] active:opacity-90'),
  disabled: tw('opacity-50'),
} satisfies Record<'enabled' | 'disabled', TailwindClass>;
