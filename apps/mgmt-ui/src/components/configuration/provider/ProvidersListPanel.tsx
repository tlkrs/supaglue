import Spinner from '@/components/Spinner';
import { Grid } from '@mui/material';
import { Provider } from '@supaglue/types';
import ProviderCard from './ProviderCard';
import { ProviderCardInfo } from './ProviderTabPanelContainer';

export type ProvidersListPanelProps = {
  providerCardsInfo: ProviderCardInfo[];
  existingProviders: Provider[];
  isLoading: boolean;
};

export default function ProvidersListPanel(props: ProvidersListPanelProps) {
  const { providerCardsInfo, existingProviders, isLoading } = props;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Grid container spacing={2}>
      {providerCardsInfo.map((info) => {
        const existingProvider = existingProviders.find((provider: Provider) => info.providerName === provider.name);

        return (
          <Grid key={info.name} item xs={6}>
            <ProviderCard provider={existingProvider} providerInfo={info} />
          </Grid>
        );
      })}
    </Grid>
  );
}
