import { Connection as ConnectionModel, ObjectSyncRun as ObjectSyncRunModel } from '@supaglue/db';

export type ObjectSyncRunModelExpanded = ObjectSyncRunModel & {
  objectSync: {
    id: string;
    connection: ConnectionModel;
  };
};

export type ObjectSyncRunModelExpandedWithObject = ObjectSyncRunModelExpanded & {
  objectSync: {
    objectType: string;
    object: string;
  };
};
