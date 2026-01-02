import { expect, test } from 'vitest'
import type Workspace from '../types/workspace'
import filterWorkspaces from './filter_workspaces'

test('filter workspaces by name', () => {
  const workspaces: Workspace[] = [
    { name: 'root', root: true },
    { name: 'web', root: false },
    { name: 'admin', root: false },
    { name: '@repo/utils', root: false },
  ]
  const filter = ['web', '@repo/utils']
  const expected: Workspace[] = [
    { name: 'web', root: false },
    { name: '@repo/utils', root: false },
  ]

  const result = filterWorkspaces(workspaces, filter)

  expect(result).toEqual(expected)
})

test('returns all workspaces if no filter is provided', () => {
  const workspaces: Workspace[] = [
    { name: 'root', root: true },
    { name: 'web', root: false },
    { name: 'admin', root: false },
    { name: '@repo/utils', root: false },
  ]
  const filter: string[] = []
  const expected: Workspace[] = [
    { name: 'root', root: true },
    { name: 'web', root: false },
    { name: 'admin', root: false },
    { name: '@repo/utils', root: false },
  ]

  const result = filterWorkspaces(workspaces, filter)

  expect(result).toEqual(expected)
})
