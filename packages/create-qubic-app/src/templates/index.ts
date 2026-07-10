import type { TemplateDefinition, TemplateId } from '../options.js'
import { nextReactTemplate } from './next-react.js'
import { nodeTemplate } from './node.js'
import { viteReactTemplate } from './vite-react.js'

const templates: Record<TemplateId, TemplateDefinition> = {
  'next-react': nextReactTemplate,
  node: nodeTemplate,
  'vite-react': viteReactTemplate,
}

export function getTemplate(id: TemplateId): TemplateDefinition {
  return templates[id]
}
