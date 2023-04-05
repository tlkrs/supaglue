import { CustomFields } from '.';
import { Filter } from '../filter';
import type { Account } from './account';
import { User } from './user';

export const OPPORTUNITY_STATUSES = ['OPEN', 'WON', 'LOST'] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

type BaseOpportunity = {
  remoteId: string;
  name: string | null;
  description: string | null;
  amount: number | null;
  stage: string | null;
  status: OpportunityStatus | null;
  lastActivityAt: Date | null;
  closeDate: Date | null;
  pipeline: string | null;
  remoteCreatedAt: Date | null;
  remoteUpdatedAt: Date | null;
  remoteWasDeleted: boolean;
};

export type Opportunity = BaseOpportunity & {
  accountId: string | null;
  account?: Account;
  ownerId: string | null;
  owner?: User;
  id: string;
  lastModifiedAt: Date | null;
  // Support field mappings + remote data etc
};

export type RemoteOpportunity = BaseOpportunity & {
  remoteAccountId: string | null;
  remoteOwnerId: string | null;
  remoteDeletedAt: Date | null;
  detectedOrRemoteDeletedAt: Date | null;
};

type BaseOpportunityCreateParams = {
  amount?: number | null;
  closeDate?: Date | null;
  description?: string | null;

  // TODO: Need extra permissions to create/update this derived field in SF
  // lastActivityAt?: Date | null;

  name?: string | null;
  stage?: string | null;
  accountId?: string | null;
  ownerId?: string | null;
  pipeline?: string | null;

  customFields?: CustomFields;
};

export type OpportunityCreateParams = BaseOpportunityCreateParams;
export type RemoteOpportunityCreateParams = BaseOpportunityCreateParams;

export type OpportunityUpdateParams = OpportunityCreateParams & {
  id: string;
};

export type RemoteOpportunityUpdateParams = RemoteOpportunityCreateParams & {
  remoteId: string;
};

export type OpportunityFilters = {
  accountId?: Filter;
};