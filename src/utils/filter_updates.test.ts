import { expect, test } from 'vitest'
import type Update from '../types/update'
import filterUpdates from './filter_updates'

test('return all updates if no filter is provided', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = undefined
  const maxVersionDiff = undefined
  const expected: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filter updates by packages name when packages argument is provided', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = ['zod', 'sass']
  const maxVersionDiff = undefined
  const expected: Update[] = [
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filters updates with version diff greater that minor when max version diff is set to minor', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'minor'
  const expected: Update[] = [
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filters updates with version diff greater that patch when max version diff is set to patch', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'patch'
  const expected: Update[] = [
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('returns all updates when max version diff is set to major', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'major'
  const expected: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filter updates by both package names and max version diff', () => {
  const updates: Update[] = [
    {
      packageName: 'vitest',
      workspace: { name: 'root', root: true },
      versionDiff: 'major',
      currentVersion: '3.2.4',
      latestVersion: '4.0.16',
    },
    {
      packageName: 'zod',
      workspace: { name: 'root', root: true },
      versionDiff: 'minor',
      currentVersion: '4.1.13',
      latestVersion: '4.3.2',
    },
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]
  const packages = ['vitest', 'sass']
  const maxVersionDiff = 'minor'
  const expected: Update[] = [
    {
      packageName: 'sass',
      workspace: { name: 'root', root: true },
      versionDiff: 'patch',
      currentVersion: '1.96.0',
      latestVersion: '1.96.1',
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})
