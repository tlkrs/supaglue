import {
  CommonObjectForCategory,
  OAuthConfigDecrypted,
  OAuthConfigEncrypted,
  ProviderCategory,
  SchemaCreateParams,
} from '.';
import { CRMProviderName } from './crm';
import { EngagementProviderName } from './engagement';

type BaseProvider = {
  id: string;
  applicationId: string;
  authType: 'oauth2';
  config: ProviderConfigDecrypted;
};

export type CRMProvider = BaseProvider & {
  category: 'crm';
  name: CRMProviderName;
  objects?: ProviderObjects<'crm'>;
};

export type EngagementProvider = BaseProvider & {
  category: 'engagement';
  name: EngagementProviderName;
  objects?: ProviderObjects<'engagement'>;
};

export type ProviderObjects<T extends ProviderCategory> = {
  common?: ProviderCommonObject<T>[];
  standard?: ProviderObject[];
  custom?: ProviderObject[];
};

export type ProviderCommonObject<T extends ProviderCategory> = {
  name: CommonObjectForCategory<T>;
  schemaId?: string;
};

export type ProviderObject = {
  name: string;
  schemaId?: string;
};

export type ProviderConfigDecrypted = {
  providerAppId: string;
  oauth: OAuthConfigDecrypted;
  useManagedOauth?: boolean;
};

export type ProviderConfigEncrypted = {
  providerAppId: string;
  oauth: OAuthConfigEncrypted;
  useManagedOauth?: boolean;
};

export type CRMProviderCreateParams = Omit<CRMProvider, 'id'>;
export type CRMProviderUpdateParams = Omit<CRMProvider, 'id' | 'applicationId'>;

export type EngagementProviderCreateParams = Omit<EngagementProvider, 'id'>;
export type EngagementProviderUpdateParams = Omit<EngagementProvider, 'id' | 'applicationId'>;

export type Provider = CRMProvider | EngagementProvider;

export type ProviderCreateParams = CRMProviderCreateParams | EngagementProviderCreateParams;
export type ProviderUpdateParams = CRMProviderUpdateParams | EngagementProviderUpdateParams;

export type ProviderConfigMapperArgs = {
  managedOauthConfig: OAuthConfigDecrypted;
};

export type AddObjectToProviderParams = {
  name: string;
  type: 'common' | 'standard' | 'custom';
  enableSync?: boolean;
  schemaId?: string;
  schema?: Omit<SchemaCreateParams, 'applicationId'>;
};
