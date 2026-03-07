import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import mutations from '@/libs/mutations';
import { PendingInvite, RespondToInvitation } from '@cohab/shared/src/household';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, Image, View } from 'react-native';

interface PendingInvitationsViewProps {
  invitations: PendingInvite[];
}

export default function PendingInvitationsView({ invitations }: PendingInvitationsViewProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    ...mutations.households.respondToInvitationMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] });
    },
    onError: (error: Error) => {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    },
  });

  const handleRespond = (invitationId: string, action: RespondToInvitation['action']) => {
    mutate({ invitationId, action });
  };

  // On prend la première invitation pour l'affichage (simplification si plusieurs)
  const invite = invitations[0];
  const householdName = invite.household.name;
  const adminName = invite.household.admin.name;

  return (
    <Screen>
      <View className="mt-8 gap-2">
        <Typography variant="h1" className="text-center">
          On t&apos;attend !
        </Typography>
        <Typography variant="subtitle" className="text-center px-4">
          Tu as été invité à rejoindre une colocation. Prêt à faire tes cartons ?
        </Typography>
      </View>

      <View className="mt-8 items-center">
        <View className="w-full aspect-4/3 rounded-3xl overflow-hidden bg-white/30 dark:bg-white/5 shadow-sm border border-white/50 dark:border-white/10">
          <Image
            source={require('@/assets/images/onboarding-house.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <Card className="mt-8 p-6">
        <View className="items-center gap-4 mb-6">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center overflow-hidden border-2 border-primary/20">
            {invite.household.admin.image ? (
              <Image source={{ uri: invite.household.admin.image }} className="w-full h-full" />
            ) : (
              <Icon as="Ionicons" name="person" size="lg" className="text-primary" />
            )}
          </View>
          <View className="items-center">
            <Typography variant="h1" className="text-2xl text-center">
              {householdName}
            </Typography>
            <Typography variant="bodySmall" className="text-center">
              Invité par {adminName}
            </Typography>
          </View>
        </View>

        <View className="gap-3">
          <CustomButton
            title="Rejoindre la colocation"
            variant="primary"
            size="lg"
            onPress={() => handleRespond(invite.id, 'ACCEPT')}
            disabled={isPending}
            RightIcon={({ color, size }) => (
              <Icon as="Ionicons" name="home" color={color} size={size} />
            )}
          />
          <CustomButton
            title="Refuser l'invitation"
            variant="secondary"
            size="md"
            className="text-red-400"
            onPress={() => handleRespond(invite.id, 'DECLINE')}
            disabled={isPending}
          />
        </View>
      </Card>

      <View className="mt-8 px-6">
        <Typography variant="caption" className="text-center text-gray-500">
          Si tu refuses, l&apos;invitation sera définitivement supprimée et tu pourras créer ta
          propre coloc.
        </Typography>
      </View>
    </Screen>
  );
}
