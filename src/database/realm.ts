import Realm from 'realm';
import { TaskSchema } from './schemas/TaskSchema';

export const getRealm = async () =>
  await Realm.open({
    path: 'task-app',
    schema: [TaskSchema],
    schemaVersion: 1,
  });
