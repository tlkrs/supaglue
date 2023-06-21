/* eslint-disable @typescript-eslint/no-floating-promises */
import { createRemoteProvider, updateRemoteProvider } from '@/client';
import Spinner from '@/components/Spinner';
import { useNotification } from '@/context/notification';
import { useActiveApplicationId } from '@/hooks/useActiveApplicationId';
import { useProviders } from '@/hooks/useProviders';
import providerToIcon from '@/utils/providerToIcon';
import { Box, Button, FormControlLabel, FormHelperText, Stack, Switch, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Provider, ProviderCategory, ProviderCreateParams, ProviderName } from '@supaglue/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { providerCardsInfo } from './ProviderTabPanelContainer';

export type ProviderDetailsPanelProps = {
  category: ProviderCategory;
  providerName: ProviderName;
  isLoading: boolean;
};

export default function ProviderDetailsPanel({ providerName, category, isLoading }: ProviderDetailsPanelProps) {
  const shouldAllowManagedOauth = ['salesforce', 'hubspot'].includes(providerName);
  const activeApplicationId = useActiveApplicationId();
  const { addNotification } = useNotification();
  const [friendlyProviderId, setFriendlyProviderId] = useState<string>('--');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [oauthScopes, setOauthScopes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [useManagedOauth, setUseManagedOauth] = useState<boolean>(true);
  const router = useRouter();

  const { providers: existingProviders = [], mutate } = useProviders();

  const provider = existingProviders.find((existingProvider) => existingProvider.name === providerName);

  const providerCardInfo = providerCardsInfo.find((providerCardInfo) => providerCardInfo.providerName === providerName);

  useEffect(() => {
    setFriendlyProviderId(provider?.id ?? '--');

    setClientId(provider?.config?.oauth?.credentials?.oauthClientId ?? '');

    setClientSecret(provider?.config?.oauth?.credentials?.oauthClientSecret ?? '');

    setOauthScopes(provider?.config?.oauth?.oauthScopes?.join(',') ?? '');
    setUseManagedOauth(
      provider?.id ? Boolean(provider?.config?.useManagedOauth) && shouldAllowManagedOauth : shouldAllowManagedOauth
    );
  }, [provider?.id]);

  const createOrUpdateProvider = async (): Promise<Provider> => {
    if (provider) {
      const newProvider: Provider = {
        ...provider,
        config: {
          ...provider.config,
          providerAppId: '', // TODO: add input field for this
          oauth: {
            ...provider.config?.oauth,
            credentials: {
              oauthClientId: clientId,
              oauthClientSecret: clientSecret,
            },
            oauthScopes: oauthScopes.split(','),
          },
        },
      };
      return await updateRemoteProvider(activeApplicationId, newProvider);
    }
    return await createRemoteProvider(activeApplicationId, {
      applicationId: activeApplicationId,
      authType: 'oauth2',
      category,
      name: providerName as ProviderName,
      config: {
        providerAppId: '', // TODO: add input field for this
        useManagedOauth,
        oauth: {
          credentials: {
            oauthClientId: clientId,
            oauthClientSecret: clientSecret,
          },
          oauthScopes: oauthScopes.split(','),
        },
      },
    } as ProviderCreateParams);
  };

  if (!providerCardInfo) {
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Card>
      <Stack direction="column" className="gap-4" sx={{ padding: '2rem' }}>
        <Stack direction="row" className="items-center gap-2">
          {providerToIcon(providerCardInfo.providerName, 35)}
          <Stack direction="column">
            <Typography variant="subtitle1">{providerCardInfo.name}</Typography>
            <Typography fontSize={12}>{providerCardInfo.category.toUpperCase()}</Typography>
          </Stack>
        </Stack>
        <Stack className="gap-2">
          <Typography variant="subtitle1">Provider Metadata</Typography>
          <TextField value={friendlyProviderId} size="small" label="ID" variant="outlined" disabled />
        </Stack>
        {shouldAllowManagedOauth && (
          <Box className="">
            <FormControlLabel
              control={
                <Switch
                  disabled={provider?.id ? true : false}
                  checked={useManagedOauth}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUseManagedOauth(event.target.checked);
                  }}
                />
              }
              label="Managed OAuth2 App"
            />
            <FormHelperText sx={{ marginY: 0, marginLeft: '14px' }}>
              Use Supaglue's credentials. This cannot be changed once saved.
            </FormHelperText>
          </Box>
        )}
        <Stack className="gap-2">
          <Typography variant="subtitle1">Credentials</Typography>
          <TextField
            disabled={useManagedOauth}
            value={clientId}
            size="small"
            label="Client ID"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setClientId(event.target.value);
            }}
          />
          <TextField
            disabled={useManagedOauth}
            value={clientSecret}
            size="small"
            label="Client Secret"
            variant="outlined"
            type="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setClientSecret(event.target.value);
            }}
          />
          <TextField
            disabled={useManagedOauth || providerName === 'ms_dynamics_365_sales'}
            value={oauthScopes}
            size="small"
            label="OAuth2 scopes"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setOauthScopes(event.target.value);
            }}
            helperText="Comma separated values (without spaces)."
          />
        </Stack>

        <Stack direction="row" className="gap-2 justify-between">
          <Button
            variant="outlined"
            disabled={isSaving}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disabled={isSaving || isLoading}
            onClick={async () => {
              setIsSaving(true);
              const newProvider = await createOrUpdateProvider();
              const latestProviders = [
                ...existingProviders.filter((provider) => provider.id !== newProvider.id),
                newProvider,
              ];
              addNotification({ message: 'Successfully updated provider', severity: 'success' });
              await mutate(latestProviders, {
                optimisticData: latestProviders,
                revalidate: false,
                populateCache: false,
              });
              setIsSaving(false);
            }}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}