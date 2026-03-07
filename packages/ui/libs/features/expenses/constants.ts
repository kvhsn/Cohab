import { IconNames } from '@/components/Icon/Icon';
import { ExpenseCategory } from '@cohab/shared/src/expense';

export const CATEGORY_ICONS: Record<ExpenseCategory, IconNames<'Ionicons'>> = {
  GROCERIES: 'cart',
  RENT: 'home',
  ELECTRICITY: 'flash',
  OTHER: 'ellipsis-horizontal',
};
