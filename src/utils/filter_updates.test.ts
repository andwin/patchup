import { expect, test } from 'vitest'
import type Update from '../types/update'
import filterUpdates from './filter_updates'

test('return all updates if no filter is provided', () => {
  const updates: Update[] = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]
  const packages = undefined
  const maxVersionDiff = undefined
  const expected = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filter updates by packages name when packages argument is provided', () => {
  const updates: Update[] = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]
  const packages = ['zod', 'sass']
  const maxVersionDiff = undefined
  const expected = [
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filters updates with version diff greater that minor when max version diff is set to minor', () => {
  const updates: Update[] = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'minor'
  const expected = [
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('filters updates with version diff greater that patch when max version diff is set to patch', () => {
  const updates: Update[] = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'patch'
  const expected = [
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})

test('returns all updates when max version diff is set to major', () => {
  const updates: Update[] = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]
  const packages = undefined
  const maxVersionDiff = 'major'
  const expected = [
    {
      name: 'vitest 3.2.4 => 4.0.16 (major)',
      value: {
        pkg: 'vitest',
        workspace: { name: 'root', root: true },
        diff: 'major',
      },
    },
    {
      name: 'zod 4.1.13 => 4.3.2 (minor)',
      value: {
        pkg: 'zod',
        workspace: { name: 'root', root: true },
        diff: 'minor',
      },
    },
    {
      name: 'sass 1.96.0 => 1.96.1 (patch)',
      value: {
        pkg: 'sass',
        workspace: { name: 'root', root: true },
        diff: 'patch',
      },
    },
  ]

  const result = filterUpdates(updates, packages, maxVersionDiff)

  expect(result).toEqual(expected)
})
