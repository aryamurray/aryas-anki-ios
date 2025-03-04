import { sqliteTable, integer, text, blob } from 'drizzle-orm/sqlite-core';

// cards table
export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey(),
  nid: integer('nid').notNull(),
  did: integer('did').notNull(),
  ord: integer('ord').notNull(),
  mod: integer('mod').notNull(),
  usn: integer('usn').notNull(),
  type: integer('type').notNull(),
  queue: integer('queue').notNull(),
  due: integer('due').notNull(),
  ivl: integer('ivl').notNull(),
  factor: integer('factor').notNull(),
  reps: integer('reps').notNull(),
  lapses: integer('lapses').notNull(),
  left: integer('left').notNull(),
  odue: integer('odue').notNull(),
  odid: integer('odid').notNull(),
  flags: integer('flags').notNull(),
  data: text('data').notNull(),
});

// col table
export const col = sqliteTable('col', {
  id: integer('id').primaryKey(),
  crt: integer('crt').notNull(),
  mod: integer('mod').notNull(),
  scm: integer('scm').notNull(),
  ver: integer('ver').notNull(),
  dty: integer('dty').notNull(),
  usn: integer('usn').notNull(),
  ls: integer('ls').notNull(),
  conf: text('conf').notNull(),
  models: text('models').notNull(),
  decks: text('decks').notNull(),
  dconf: text('dconf').notNull(),
  tags: text('tags').notNull(),
});

// config table
export const config = sqliteTable('config', {
  key: text('key').primaryKey(),
  usn: integer('usn').notNull(),
  mtimeSecs: integer('mtime_secs').notNull(),
  val: blob('val').notNull(),
});

// deck_config table
export const deckConfig = sqliteTable('deck_config', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  mtimeSecs: integer('mtime_secs').notNull(),
  usn: integer('usn').notNull(),
  config: blob('config').notNull(),
});

// decks table
export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  mtimeSecs: integer('mtime_secs').notNull(),
  usn: integer('usn').notNull(),
  common: blob('common').notNull(),
  kind: blob('kind').notNull(),
});

// fields table
export const fields = sqliteTable('fields', {
  ntid: integer('ntid').notNull(),
  ord: integer('ord').notNull(),
  name: text('name').notNull(),
  config: blob('config').notNull(),
});

// graves table
export const graves = sqliteTable('graves', {
  oid: integer('oid').notNull(),
  type: integer('type').notNull(),
  usn: integer('usn').notNull(),
});

// notes table
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey(),
  guid: text('guid').notNull(),
  mid: integer('mid').notNull(),
  mod: integer('mod').notNull(),
  usn: integer('usn').notNull(),
  tags: text('tags').notNull(),
  flds: text('flds').notNull(),
  sfld: integer('sfld').notNull(),
  csum: integer('csum').notNull(),
  flags: integer('flags').notNull(),
  data: text('data').notNull(),
});

// notetypes table
export const notetypes = sqliteTable('notetypes', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  mtimeSecs: integer('mtime_secs').notNull(),
  usn: integer('usn').notNull(),
  config: blob('config').notNull(),
});

// revlog table
export const revlog = sqliteTable('revlog', {
  id: integer('id').primaryKey(),
  cid: integer('cid').notNull(),
  usn: integer('usn').notNull(),
  ease: integer('ease').notNull(),
  ivl: integer('ivl').notNull(),
  lastIvl: integer('lastIvl').notNull(),
  factor: integer('factor').notNull(),
  time: integer('time').notNull(),
  type: integer('type').notNull(),
});

// tags table
export const tags = sqliteTable('tags', {
  tag: text('tag').primaryKey(),
  usn: integer('usn').notNull(),
  collapsed: integer('collapsed').notNull(), // boolean is represented as integer in SQLite
  config: blob('config'),
});

// templates table
export const templates = sqliteTable('templates', {
  ntid: integer('ntid').notNull(),
  ord: integer('ord').notNull(),
  name: text('name').notNull(),
  mtimeSecs: integer('mtime_secs').notNull(),
  usn: integer('usn').notNull(),
  config: blob('config').notNull(),
});