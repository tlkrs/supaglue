import * as sdk from '@supaglue/sdk';
import { contactMapping } from '../common/contact';
import credentials from '../postgres_credentials';

const contactSchema = sdk.schema({
  fields: [
    {
      name: 'salesforce_id',
      label: 'id',
    },
    {
      name: 'email',
    },
    {
      name: 'first_name',
      label: 'first name',
    },
    // TUTORIAL: Uncomment this
    // {
    //   name: 'last_name',
    //   label: 'last name',
    // },
    // {
    //   name: 'title',
    //   label: 'title',
    // },
  ],
});

const contactSyncConfig = sdk.salesforce.inboundSyncConfig({
  name: 'Contacts',
  salesforceObject: 'Contact',
  cronExpression: '*/15 * * * *',
  destination: sdk.destinations.postgres({
    schema: contactSchema,
    config: {
      credentials,
      table: 'salesforce_contacts',
      upsertKey: 'salesforce_id',
      customerIdColumn: 'customer_id',
    },
    retryPolicy: sdk.retryPolicy({
      retries: 2,
    }),
  }),
  strategy: 'full_refresh',
  defaultFieldMapping: contactMapping,
});

export default contactSyncConfig;