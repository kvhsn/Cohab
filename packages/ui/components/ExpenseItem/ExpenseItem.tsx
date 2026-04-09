import Icon from '@/components/Icon/Icon';
import { cn } from '@/libs/tailwind';
import Typography from '@/components/Typography/Typography';
import { CATEGORY_ICONS } from '@/libs/features/expenses/constants';
import { formatAmount, formatDate } from '@/libs/format';
import { EXPENSE_CATEGORY_LABELS, type ExpenseCategory } from '@cohab/shared/src/expense';
import { View } from 'react-native';

interface ExpenseItemProps {
  /** Expense display name */
  name: string;
  /** Amount in euros */
  amount: number;
  /** Expense category */
  category: ExpenseCategory;
  /** Name of the member who paid */
  memberName: string;
  /** ISO date string */
  createdAt: string;
  /** Whether this expense was paid by the current user */
  isMine?: boolean;
}

export default function ExpenseItem({
  name,
  amount,
  category,
  memberName,
  createdAt,
  isMine = false,
}: ExpenseItemProps) {
  const categoryIcon = CATEGORY_ICONS[category];
  const categoryLabel = EXPENSE_CATEGORY_LABELS[category];

  return (
    <View className="flex-row items-center gap-4 py-3">
      {/* Category icon */}
      <View
        className={`size-12 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20`}>
        <Icon as="Ionicons" name={categoryIcon} size="lg" className={`text-primary`} />
      </View>

      {/* Expense details */}
      <View className="flex-1">
        <Typography variant="body" className="font-semibold">
          {name}
        </Typography>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <Typography variant="bodySmall">{categoryLabel}</Typography>
          <Typography variant="bodySmall" className="opacity-40">
            ·
          </Typography>
          <Typography variant="bodySmall">{memberName}</Typography>
        </View>
      </View>

      {/* Amount & date */}
      <View className="items-end">
        <Typography variant="body" weight="bold" className={cn(isMine && 'text-success')}>
          {formatAmount(amount)} €
        </Typography>
        <Typography variant="bodySmall" className="mt-0.5 opacity-60">
          {formatDate(createdAt)}
        </Typography>
      </View>
    </View>
  );
}
