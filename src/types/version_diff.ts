type VersionDiff = 'major' | 'minor' | 'patch' | 'unknown'

export type VersionDiffWithoutUnknown = Exclude<VersionDiff, 'unknown'>

export default VersionDiff
