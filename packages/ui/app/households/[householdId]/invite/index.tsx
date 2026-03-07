import CustomButton from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import OTPInput from '@/components/OTPInput/OTPInput';
import Screen from '@/components/Screen/Screen';
import Typography from '@/components/Typography/Typography';
import mutations from '@/libs/mutations';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Share, TextInput, View } from 'react-native';

export default function InviteHousehold() {
  const [code, setCode] = useState<string>();
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: { TextInput },
    formComponents: { IconButton },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      householdId,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    ...mutations.households.createInviteCodeMutation(),
    onSuccess: (data) => {
      setCode(data.code);
    },
    onError: (error) => {
      console.error(error);
      Alert.alert('Error', error.message || 'Invite household failed');
    },
  });

  const onCopy = async () => {
    if (!code) return;
    if (Platform.OS === 'ios') {
      await Clipboard.setStringAsync(code);
    } else {
      await Clipboard.setStringAsync(code);
    }
  };
  const onShare = async () => {
    if (!code) return;
    await Share.share({
      message: code,
    });
  };

  return (
    <Screen title="Inviter un colocataire">
      <View className="flex justify-center items-center">
        <View className="flex justify-center items-center rounded-full size-24 bg-white/60 dark:bg-white/5 shadow-sm">
          <Icon as="FontAwesome" size="lg" name="user" color="#c084fc"></Icon>
        </View>
        <Typography variant="h1">Générer un code</Typography>
        <Typography variant="bodySmall">
          Créez un accès sécurisé pour votre futur colocataire. Ce code lui permettra de rejoindre
          automatiquement votre foyer.
        </Typography>
      </View>
      <Card className="min-h-64 mt-8 p-4 items-center justify-center">
        {!code && (
          <form.IconButton
            as="Ionicons"
            name="add"
            variant="secondary"
            size="lg"
            disabled={isPending}
            onPress={() => form.handleSubmit()}
          />
        )}

        {code && (
          <View className="flex flex-col gap-4 items-center justify-center">
            <Typography variant="caption">Votre code d&apos;invitation</Typography>
            <OTPInput value={code} length={6} disabled />
            <View className="flex flex-row gap-4">
              <CustomButton
                title="Copier"
                onPress={onCopy}
                variant="secondary"
                size="md"
                LeftIcon={() => <Icon as="Ionicons" name="copy-outline" size="lg" />}
              />
              <CustomButton
                title="Partager"
                onPress={onShare}
                variant="secondary"
                size="md"
                LeftIcon={() => <Icon as="Ionicons" name="share-outline" size="lg" />}
              />
            </View>
          </View>
        )}
      </Card>
    </Screen>
  );
}
