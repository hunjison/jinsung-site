import * as migration_20260620_032700_initial from './20260620_032700_initial';

export const migrations = [
  {
    up: migration_20260620_032700_initial.up,
    down: migration_20260620_032700_initial.down,
    name: '20260620_032700_initial'
  },
];
