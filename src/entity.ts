import { Component, ComponentTemplate, Entity } from './types'

export const createEntity = (idTemplate: string): Entity => {
  const id = idTemplate.replace(/%r/g, `${Date.now()}${Math.floor(Math.random() * 5)}`)
  const components: Map<string, Component> = new Map()

  const addComponent = (component: Component): Entity => {
    components.set(component.type, component)
    return entity
  }

  const getComponent = <T>(template: ComponentTemplate<T>): Component<T> => {
    return components.get(template.type) as Component<T>
  }

  const hasComponent = <T>(template: ComponentTemplate<T>): boolean => {
    return components.has(template.type)
  }

  const entity: Entity = {
    id,
    components,
    addComponent,
    getComponent,
    hasComponent
  }

  return entity
}
