import { Component, ComponentTemplate } from './types'

export const defineComponent = <T, P = undefined>(
  type: string,
  factory: ((props: P) => T)
): ComponentTemplate<T, P> => {
  return Object.assign(factory, { type })
}

export const createComponent = <T, P>(
  template: ComponentTemplate<T, P>,
  props: P
): Component<T> => {
  return {
    type: template.type,
    data: template(props)
  }
}
