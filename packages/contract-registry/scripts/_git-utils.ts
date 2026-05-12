import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export interface CloneOptions {
  /** Default: 'https://github.com/qubic/core' */
  repo?: string
  /** git tag, branch, or commit SHA */
  ref: string
  /** Sparse-checkout paths (saves bandwidth); e.g. ['src/contracts'] */
  paths?: string[]
}

export interface CloneResult {
  dir: string
  cleanup(): Promise<void>
}

/**
 * Clones a git repo at a specific ref into a temp dir.
 * Uses sparse checkout when paths are provided.
 * Always call cleanup() in a finally block.
 */
export async function cloneAtRef(options: CloneOptions): Promise<CloneResult> {
  const repo = options.repo ?? 'https://github.com/qubic/core'
  const dir = join(
    tmpdir(),
    `qubic-core-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )

  if (options.paths) {
    await Bun.$`git clone --no-checkout --depth 1 --branch ${options.ref} ${repo} ${dir}`
    await Bun.$`git -C ${dir} sparse-checkout set ${options.paths.join(' ')}`
    await Bun.$`git -C ${dir} checkout`
  } else {
    await Bun.$`git clone --depth 1 --branch ${options.ref} ${repo} ${dir}`
  }

  return {
    dir,
    cleanup: () => rm(dir, { recursive: true, force: true }),
  }
}

/**
 * Returns all git tags from qubic/core sorted chronologically (semver order).
 * @param token - Optional GitHub personal access token for higher rate limits.
 */
export async function fetchCoreTags(options?: { token?: string }): Promise<string[]> {
  const headers: HeadersInit = options?.token
    ? { Authorization: `Bearer ${options.token}` }
    : {}
  const res = await fetch(
    'https://api.github.com/repos/qubic/core/tags?per_page=100',
    { headers },
  )
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  const tags = (await res.json()) as Array<{ name: string }>
  return tags
    .map((t) => t.name)
    .sort((a, b) => {
      const parse = (s: string) => s.replace(/^v/, '').split('.').map(Number) as [number, number, number]
      const [ma, na, pa] = parse(a)
      const [mb, nb, pb] = parse(b)
      return (ma - mb) || (na - nb) || (pa - pb)
    })
}
