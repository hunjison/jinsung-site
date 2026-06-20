import * as migration_20260620_032700_initial from './20260620_032700_initial';
import * as migration_20260620_040329_hero_video from './20260620_040329_hero_video';

export const migrations = [
  {
    up: migration_20260620_032700_initial.up,
    down: migration_20260620_032700_initial.down,
    name: '20260620_032700_initial',
  },
  {
    up: migration_20260620_040329_hero_video.up,
    down: migration_20260620_040329_hero_video.down,
    name: '20260620_040329_hero_video'
  },
];
