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
  const dir = join(tmpdir(), `qubic-core-${Date.now()}-${Math.random().toString(36).slice(2)}`)

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
 * Paginates until all tags are fetched.
 * @param token - Optional GitHub personal access token for higher rate limits.
 */
export async function fetchCoreTags(options?: { token?: string }): Promise<string[]> {
  const headers: Record<string, string> = options?.token
    ? { Authorization: `Bearer ${options.token}` }
    : {}
  const allTags: string[] = []
  let page = 1
  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/qubic/core/tags?per_page=100&page=${page}`,
      { headers },
    )
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
    const batch = (await res.json()) as Array<{ name: string }>
    if (batch.length === 0) break
    for (const t of batch) allTags.push(t.name)
    if (batch.length < 100) break
    page++
  }
  return allTags
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
    .sort((a, b) => {
      const parse = (s: string) => s.replace(/^v/, '').split('.').map(Number) as number[]
      const [ma = 0, na = 0, pa = 0] = parse(a)
      const [mb = 0, nb = 0, pb = 0] = parse(b)
      return ma - mb || na - nb || pa - pb
    })
}

/** Extracts the epoch number from a tag like "v1.234.0" → 234. Returns null if not parseable. */
export function tagToEpoch(tag: string): number | null {
  const m = tag.match(/^v\d+\.(\d+)\.\d+$/)
  return m ? Number(m[1]) : null
}
