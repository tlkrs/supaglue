import { CRMConnectionUnsafe, CRMProviderName, Integration } from '@supaglue/types';
import { logger } from '../../lib/logger';
import { ConnectorAuthConfig, CrmConnectorConfig, CrmRemoteClient } from './base';
import * as capsule from './capsule';
import * as hubspot from './hubspot';
import * as ms_dynamics_365_sales from './ms_dynamics_365_sales';
import * as pipedrive from './pipedrive';
import * as salesforce from './salesforce';
import * as zendesk_sell from './zendesk_sell';
import * as zoho_crm from './zoho_crm';

const crmConnectorConfigMap: Record<CRMProviderName, CrmConnectorConfig> = {
  salesforce,
  hubspot,
  pipedrive,
  zendesk_sell,
  ms_dynamics_365_sales,
  capsule,
  zoho_crm,
};

export function getConnectorAuthConfig(providerName: CRMProviderName): ConnectorAuthConfig {
  const { authConfig } = crmConnectorConfigMap[providerName];
  return authConfig;
}

export function getCrmRemoteClient(connection: CRMConnectionUnsafe, integration: Integration): CrmRemoteClient {
  const { newClient } = crmConnectorConfigMap[connection.providerName];
  const client = newClient(connection, integration);

  // Intercept and log errors to remotes
  return new Proxy(client, {
    get(target, p) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const v = target[p];
      if (typeof v !== 'function') {
        return v;
      }

      return new Proxy(v, {
        apply(_target, thisArg, argArray) {
          try {
            const res = v.apply(target, argArray);
            if (Promise.resolve(res) === res) {
              // if it's a promise
              return (res as Promise<unknown>).catch((err) => {
                logger.error(
                  {
                    error: err,
                    client: target.constructor.name,
                    method: p,
                    args: argArray,
                  },
                  'remote client error'
                );
                throw err;
              });
            }
          } catch (err: unknown) {
            logger.error(
              {
                error: err,
                client: target.constructor.name,
                method: p,
                args: argArray,
              },
              'remote client error'
            );
            throw err;
          }
        },
      });
    },
  });
}
