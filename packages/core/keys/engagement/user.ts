import { SnakecasedKeysEngagementUserV2WithTenant } from '@supaglue/types/engagement';
import { arrayOfAllKeys } from '../util';

export const keysOfSnakecasedEngagementUserV2WithTenant = arrayOfAllKeys<SnakecasedKeysEngagementUserV2WithTenant>()([
  '_supaglue_application_id',
  '_supaglue_provider_name',
  '_supaglue_customer_id',
  'id',
  'created_at',
  'updated_at',
  'is_deleted',
  'last_modified_at',
  'first_name',
  'last_name',
  'email',
  'raw_data',
]);