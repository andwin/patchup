import { expect, test } from 'vitest'
import semverDiff from './semver_diff'

test('major version diff', () => {
  expect(semverDiff('1.0.0', '2.0.0')).toBe('major')
})

test('minor version diff', () => {
  expect(semverDiff('1.0.0', '1.1.0')).toBe('minor')
})

test('patch version diff', () => {
  expect(semverDiff('1.0.0', '1.0.1')).toBe('patch')
})

test('unknown version diff', () => {
  expect(semverDiff('1.0.0', '1.0.0')).toBe('unknown')
})

test('invalid version diff', () => {
  expect(semverDiff('1.0.0', '1.0.0.0')).toBe('unknown')
})

test('version with text', () => {
  expect(semverDiff('1.0.0', '1.0.1-alpha.1')).toBe('unknown')
  expect(semverDiff('1.0.0-alpha.1', '1.0.1')).toBe('unknown')
  expect(semverDiff('8.0.0-alpha.15', '8.0.0-rc.4')).toBe('unknown')
})
