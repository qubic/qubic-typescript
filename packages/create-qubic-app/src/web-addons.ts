import type {
  AnimationId,
  ScaffoldOptions,
  StylingId,
  TemplateFile,
  TemplateId,
} from './options.js'

export function defaultStyling(): StylingId {
  return 'css'
}

export function defaultAnimation(): AnimationId {
  return 'none'
}

export function applyWebAddonsToPackage(
  options: ScaffoldOptions,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
): void {
  Object.assign(dependencies, { '@solar-icons/react': '^1.1.1' })

  if (options.animation === 'motion') {
    Object.assign(dependencies, { motion: '^12.23.0' })
  }

  if (options.styling === 'tailwind') {
    Object.assign(devDependencies, {
      '@tailwindcss/postcss': '^4.1.0',
      postcss: '^8.5.0',
      tailwindcss: '^4.1.0',
    })
  }
}

export function webAddonFiles(
  _template: Extract<TemplateId, 'vite-react' | 'next-react'>,
  options: ScaffoldOptions,
): TemplateFile[] {
  if (options.styling !== 'tailwind') return []

  return [
    {
      path: 'postcss.config.mjs',
      content: "export default {\n  plugins: {\n    '@tailwindcss/postcss': {},\n  },\n}\n",
    },
  ]
}
