import * as migration_20260620_032700_initial from './20260620_032700_initial';
import * as migration_20260620_040329_hero_video from './20260620_040329_hero_video';
import * as migration_20260620_120707_home_editable from './20260620_120707_home_editable';
import * as migration_20260621_030656_facility_images from './20260621_030656_facility_images';

export const migrations = [
  {
    up: migration_20260620_032700_initial.up,
    down: migration_20260620_032700_initial.down,
    name: '20260620_032700_initial',
  },
  {
    up: migration_20260620_040329_hero_video.up,
    down: migration_20260620_040329_hero_video.down,
    name: '20260620_040329_hero_video',
  },
  {
    up: migration_20260620_120707_home_editable.up,
    down: migration_20260620_120707_home_editable.down,
    name: '20260620_120707_home_editable',
  },
  {
    up: migration_20260621_030656_facility_images.up,
    down: migration_20260621_030656_facility_images.down,
    name: '20260621_030656_facility_images'
  },
];
