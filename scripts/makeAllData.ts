/**
 * 统一数据生成入口脚本
 * 依次运行所有 make* 任务，生成全部数据文件。
 * 执行方式: yarn makedata
 */
import fs from 'node:fs';
import { makeItems } from './tasks/makeItems';
import { makePackGroups, makePacks, makePackShops } from './tasks/makePacks';
import { makeRecoverApItems } from './tasks/makeRecoverApItems';
import { makeTrialOfSwordmancyLevelTable } from './tasks/makeTrialOfSwordmancyLevelTable';
import { makeTrialOfSwordmancyPools } from './tasks/makeTrialOfSwordmancyPools';
import { makeEnergyAlluviums, makeWeaponLocalizations, makeWeapons } from './tasks/makeWeapons';
import { makeWeaponToChars } from './tasks/makeWeaponToChars';

// ---------- items ----------
fs.writeFileSync('custom/core/items.json', JSON.stringify(makeItems(), null, 2), 'utf8');
console.log('✓ custom/core/items.json');

// ---------- weapons ----------
fs.writeFileSync('custom/core/weapons.json', JSON.stringify(makeWeapons(), null, 2), 'utf8');
console.log('✓ custom/core/weapons.json');

fs.writeFileSync('custom/core/energyAlluviums.json', JSON.stringify(makeEnergyAlluviums(), null, 2), 'utf8');
console.log('✓ custom/core/energyAlluviums.json');

fs.writeFileSync('i18n/locales/zh-CN-weapons.json', JSON.stringify(makeWeaponLocalizations("CN"), null, 2), 'utf8');
fs.writeFileSync('i18n/locales/en-US-weapons.json', JSON.stringify(makeWeaponLocalizations("EN"), null, 2), 'utf8');
console.log('✓ i18n/locales/zh-CN-weapons.json');
console.log('✓ i18n/locales/en-US-weapons.json');

// ---------- weaponToChars ----------
fs.writeFileSync(
  'custom/core/weaponToChars.json',
  JSON.stringify(makeWeaponToChars(), null, 2),
  'utf8',
);
console.log('✓ custom/core/weaponToChars.json');

// ---------- packs ----------
const packs = makePacks();
const packShops = makePackShops(packs);
const packGroups = makePackGroups();
fs.writeFileSync('custom/core/packs.json', JSON.stringify(packs, null, 2), 'utf8');
fs.writeFileSync('custom/core/packShops.json', JSON.stringify(packShops, null, 2), 'utf8');
fs.writeFileSync('custom/core/packGroups.json', JSON.stringify(packGroups, null, 2), 'utf8');
console.log(`✓ custom/core/packs.json (${Object.keys(packs).length} packs)`);
console.log(`✓ custom/core/packShops.json (${Object.keys(packShops).length} shops)`);
console.log(`✓ custom/core/packGroups.json (${Object.keys(packGroups).length} groups)`);

// ---------- recover-ap-items ----------
fs.writeFileSync('custom/core/apItems.json', JSON.stringify(makeRecoverApItems(), null, 2), 'utf8');
console.log(`✓ custom/core/apItems.json`);

// ---------- trial-of-swordmancy level table ----------
const trialOfSwordmancyLevelTable = makeTrialOfSwordmancyLevelTable();
fs.writeFileSync(
  'custom/core/trialOfSwordmancyLevelTable.json',
  JSON.stringify(trialOfSwordmancyLevelTable, null, 2),
  'utf8',
);
console.log(
  `✓ custom/core/trialOfSwordmancyLevelTable.json (${Object.keys(trialOfSwordmancyLevelTable).length} levels)`,
);

// ---------- trial-of-swordmancy pools ----------
const trialOfSwordmancyPools = makeTrialOfSwordmancyPools();
fs.writeFileSync(
  'custom/core/trialOfSwordmancyPools.json',
  JSON.stringify(trialOfSwordmancyPools, null, 2),
  'utf8',
);
console.log(
  `✓ custom/core/trialOfSwordmancyPools.json (${trialOfSwordmancyPools.pools.length} pools)`,
);
