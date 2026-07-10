import type { TemplateDefinition, TemplateId } from '../options.js'
import { nodeTemplate } from './node.js'

const templates: Record<TemplateId, TemplateDefinition> = {
  node: nodeTemplate,
}

export function getTemplate(id: TemplateId): TemplateDefinition {
  return templates[id]
}
