import { defineComponent, createComponent } from './component'
import { createEntity } from './entity'
import { Component, ComponentTemplate } from './types'

const createTestComponent = (): { definition: ComponentTemplate<string>, component: Component } => {
  const definition = defineComponent('Test', (i: string) => i)
  const component = createComponent(definition, 'hello')
  return { definition, component }
}

test('creates an entity', () => {
  const entity = createEntity('test-id')
  expect(entity.id).toEqual('test-id')
  expect(entity.components.size).toBe(0)
})

test('adds a component', () => {
  const entity = createEntity('test-id')
  const { component } = createTestComponent()
  entity.addComponent(component)
  expect(entity.components.size).toBe(1)
  expect(entity.components.get(component.type)).toBe(component)
})

test('gets component by definition', () => {
  const entity = createEntity('test-id')
  const { component, definition } = createTestComponent()
  entity.addComponent(component)
  expect(entity.getComponent(definition)).toBe(component)
})
