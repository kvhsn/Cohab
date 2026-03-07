import MemberAvatar from '@/components/MemberAvatar/MemberAvatar';
import Screen from '@/components/Screen/Screen';
import { SummaryCard } from '@/components/SummaryCard/SummaryCard';
import Typography from '@/components/Typography/Typography';
import { useAuth } from '@/hooks/useAuth';
import queries from '@/libs/queries';
import { GetMe } from '@cohab/shared/src/me';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { Pressable, View } from 'react-native';

export default function HouseholdDetails() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { data } = useSuspenseQuery(queries.me.getMeQuery());
  const { data: balance } = useSuspenseQuery(
    queries.households.getHouseholdBalanceQuery(householdId),
  );
  return (
    <Screen>
      <Suspense fallback="Is loading...">
        <MemberHeader
          me={data}
          onSettings={() => router.push(`/households/${householdId}/settings`)}
        />
      </Suspense>

      <View className="flex mt-8 px-4">
        <Link
          href={{
            pathname: '/households/[householdId]/balance',
            params: { householdId },
          }}>
          <SummaryCard share={balance.total} />
        </Link>
        <View>
          <Link
            href={{
              pathname: '/households/[householdId]/expenses',
              params: { householdId },
            }}>
            <Typography variant="bodySmall">Show expenses</Typography>
          </Link>
        </View>
        <Link
          href={{
            pathname: '/households/[householdId]/refunds',
            params: { householdId },
          }}>
          <Typography variant="bodySmall">Show refunds</Typography>
        </Link>
      </View>
    </Screen>
  );
}

type MemberHeaderProps = {
  me: GetMe;
  onSettings: () => void;
};

function MemberHeader({ me, onSettings }: MemberHeaderProps) {
  const { data: userData } = useAuth();

  return (
    <View className="flex flex-row items-center gap-4">
      <Pressable onPress={onSettings}>
        <MemberAvatar name={me.name} isAdmin={me.household?.adminId === userData?.user?.id} />
      </Pressable>
      <View className="flex flex-1 flex-col self-center">
        <Typography variant="h1" className="text-primary">
          Salut {me.name} 👋 !
        </Typography>
        <Typography variant="bodySmall" className="text-gray-400">
          Voici ce qui se passe à la coloc
        </Typography>
      </View>
    </View>
  );
}
