import type VersionDiff from '../types/version_diff'

export const semverDiff = (v1: string, v2: string): VersionDiff => {
  const pattern = /^(\d+)\.(\d+)\.(\d+)$/
  const m1 = v1.match(pattern)
  const m2 = v2.match(pattern)

  if (!m1 || !m2) {
    return 'unknown'
  }

  const [major1, minor1, patch1] = m1.slice(1).map(Number)
  const [major2, minor2, patch2] = m2.slice(1).map(Number)

  if (major1 !== major2) return 'major'
  if (minor1 !== minor2) return 'minor'
  if (patch1 !== patch2) return 'patch'

  return 'unknown'
}

export default semverDiff
