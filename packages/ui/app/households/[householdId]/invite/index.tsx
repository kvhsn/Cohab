import Banner from '@/components/Banner/Banner';
import { colors } from '@/libs/colors';
import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import OTPInput from '@/components/OTPInput/OTPInput';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import mutations from '@/libs/mutations';
import queries from '@/libs/queries';
import { InvitationValidity } from '@cohab/shared/src/household';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Share, Text, View } from 'react-native';

type ValidityOption = {
  value: InvitationValidity;
  label: string;
};

const validityOptions: ValidityOption[] = [
  { value: 'HOURS_24', label: '24h' },
  { value: 'HOURS_48', label: '48h' },
  { value: 'PERMANENT', label: '∞' },
];

export default function InviteHousehold() {
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const queryClient = useQueryClient();
  const [isEditingValidity, setIsEditingValidity] = useState(false);
  const [selectedValidity, setSelectedValidity] = useState<InvitationValidity>('HOURS_24');

  const { data: invitation } = useQuery(queries.households.getInviteCodeQuery(householdId));
  const { data: me } = useQuery(queries.me.getMeQuery());

  const invalidateInvite = () =>
    queryClient.invalidateQueries({ queryKey: ['households', householdId, 'invite'] });

  const { mutate: createCode, isPending: isCreating } = useMutation({
    ...mutations.households.createInviteCodeMutation(),
    onSuccess: () => invalidateInvite(),
    onError: (error) => Alert.alert('Erreur', error.message),
  });

  const { mutate: updateValidity, isPending: isUpdating } = useMutation({
    ...mutations.households.updateInviteValidityMutation(),
    onSuccess: () => {
      setIsEditingValidity(false);
      invalidateInvite();
    },
    onError: (error) => Alert.alert('Erreur', error.message),
  });

  const { mutate: revokeCode, isPending: isRevoking } = useMutation({
    ...mutations.households.revokeInviteCodeMutation(),
    onSuccess: () => invalidateInvite(),
    onError: (error) => Alert.alert('Erreur', error.message),
  });

  const onCopy = async () => {
    if (!invitation) return;
    await Clipboard.setStringAsync(invitation.code);
  };

  const onShare = async () => {
    if (!invitation) return;
    await Share.share({ message: invitation.code });
  };

  const onStartEditing = () => {
    setSelectedValidity(invitation?.validity ?? 'HOURS_24');
    setIsEditingValidity(true);
  };

  const onRevoke = () => {
    Alert.alert(
      'Révoquer le code',
      "Le code d'invitation sera désactivé. Les membres existants ne sont pas affectés.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Révoquer',
          style: 'destructive',
          onPress: () => revokeCode({ householdId }),
        },
      ],
    );
  };

  const displayValidity = isEditingValidity
    ? selectedValidity
    : (invitation?.validity ?? 'HOURS_24');

  return (
    <Screen title="Inviter un colocataire">
      <View className="flex justify-center items-center">
        <View className="flex justify-center items-center rounded-full size-24 bg-white/60 dark:bg-white/5 shadow-sm">
          <Icon as="FontAwesome" size="lg" name="user" color={colors.primary} />
        </View>
        <Typography variant="h1">Générer un code</Typography>
        <Typography variant="bodySmall" className="text-center mt-1">
          Créez un accès sécurisé pour votre futur colocataire. Ce code lui permettra de rejoindre
          automatiquement votre foyer.
        </Typography>
      </View>

      <Card className="min-h-64 mt-8 p-4 items-center justify-center">
        {!invitation && (
          <IconButton
            as="Ionicons"
            name="add"
            variant="secondary"
            size="lg"
            disabled={isCreating}
            onPress={() => createCode({ householdId, validity: 'HOURS_24' })}
          />
        )}

        {invitation && (
          <View className="flex-col gap-4 items-center justify-center w-full">
            <Typography variant="caption">Votre code d&apos;invitation</Typography>
            <OTPInput value={invitation.code} length={6} disabled />
            <View className="flex-row gap-4">
              <CustomButton
                title="Copier"
                onPress={onCopy}
                variant="secondary"
                size="md"
                LeftIcon={({ color, size }) => (
                  <Icon as="Ionicons" name="copy-outline" size={size} color={color} />
                )}
              />
              <CustomButton
                title="Partager"
                onPress={onShare}
                variant="secondary"
                size="md"
                LeftIcon={({ color, size }) => (
                  <Icon as="Ionicons" name="share-outline" size={size} color={color} />
                )}
              />
            </View>
          </View>
        )}
      </Card>

      {invitation && (
        <>
          <Card className="mt-4">
            <View className="flex-row justify-between items-center mb-4 wrap-normal">
              <Typography variant="body">Validité</Typography>
              {isEditingValidity ? (
                <View className="flex-row gap-2 items-center">
                  <CustomButton
                    title="Annuler"
                    variant="secondary"
                    size="sm"
                    onPress={() => setIsEditingValidity(false)}
                    disabled={isUpdating}
                  />
                  <CustomButton
                    title="Sauvegarder"
                    variant="primary"
                    size="sm"
                    onPress={() => updateValidity({ householdId, validity: selectedValidity })}
                    disabled={isUpdating}
                  />
                </View>
              ) : (
                <CustomButton
                  onPress={onStartEditing}
                  title="Modifier"
                  variant="secondary"
                  size="sm"
                />
              )}
            </View>

            <View className="flex-row self-center gap-3">
              {validityOptions.map((option) => {
                const isActive = displayValidity === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => isEditingValidity && setSelectedValidity(option.value)}>
                    <Card isActive={isActive} isDisabled={!isEditingValidity}>
                      <Typography variant="body">{option.label}</Typography>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </Card>
          <Banner variant="information" className="mt-4">
            <Typography variant="bodySmall">
              Le futur colocataire devra saisir ce code lors de son inscription pour rejoindre
              automatiquement le groupe{' '}
              <Text className="text-blue-500 font-bold">&quot;{me?.household?.name}&quot;</Text>.
            </Typography>
          </Banner>

          <View className="mt-4 items-center">
            <CustomButton
              title="Révoquer le code"
              variant="danger"
              size="md"
              onPress={onRevoke}
              disabled={isRevoking}
            />
          </View>
        </>
      )}
    </Screen>
  );
}
