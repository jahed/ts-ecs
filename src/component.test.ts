import { defineComponent, createComponent } from './component'

test('creates a component', () => {
  const def = defineComponent('Test', () => 'hello')
  const component = createComponent(def, undefined)
  expect(component.type).toEqual('Test')
  expect(component.data).toEqual('hello')
})

test('passes arguments to factory', () => {
  const def = defineComponent('Test', (s: string) => s)
  const component = createComponent(def, 'hello')
  expect(component.data).toEqual('hello')
})
