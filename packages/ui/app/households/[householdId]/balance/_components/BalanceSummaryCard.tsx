import { SummaryCard } from '@/components/SummaryCard/SummaryCard';
import { formatAmount } from '@/libs/format';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import ExpandableDebtRow from './ExpandableDebtRow';

export interface DebtSummaryItem {
  memberId: string;
  memberName: string;
  amount: number;
  type: 'owe-me' | 'i-owe';
  lastExpenseLabel?: string;
}

interface BalanceSummaryCardProps {
  share: number;
  isAlone?: boolean;
  debts: DebtSummaryItem[];
  className?: string;
}

export default function BalanceSummaryCard({
  share,
  isAlone,
  debts,
  className,
}: BalanceSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDebtPress = (item: DebtSummaryItem) => {
    if (item.type === 'i-owe') {
      Alert.alert(
        'Remboursement',
        `Confirmer le paiement de ${formatAmount(item.amount)} € à ${item.memberName} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: "J'ai déjà payé", onPress: () => {} },
        ],
      );
    } else {
      Alert.alert(
        'Rappel',
        `Envoyer un rappel à ${item.memberName} pour ${formatAmount(item.amount)} € ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Envoyer', onPress: () => {} },
        ],
      );
    }
  };

  return (
    <SummaryCard
      share={share}
      isAlone={isAlone}
      expandable={debts.length > 0}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded((prev) => !prev)}
      className={className}>
      <View className="mt-2 pt-3 border-t border-white/20 dark:border-slate-700/50 gap-1">
        {debts.map((item) => (
          <ExpandableDebtRow
            key={item.memberId}
            memberName={item.memberName}
            label={
              item.type === 'owe-me' ? `${item.memberName} te doit` : `Tu dois à ${item.memberName}`
            }
            subtitle={item.lastExpenseLabel ?? 'Dépenses communes'}
            amount={item.type === 'owe-me' ? item.amount : -item.amount}
            onPress={() => handleDebtPress(item)}
          />
        ))}
      </View>
    </SummaryCard>
  );
}
