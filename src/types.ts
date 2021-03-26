export type Milliseconds = number

export type Task = () => void
export type Tasks = Map<string, Task>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentTemplate<T, P = any> = ((props: P) => T) & { type: string }

export type Entity = {
  id: Readonly<string>,
  components: Map<string, Component>,
  /**
   * @deprecated Only use for building entities. Not in game loop.
   */
  addComponent: <T>(component: Component<T>) => Entity,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponent: <T, P = any>(template: ComponentTemplate<T, P>) => Component<T>,
  hasComponent: <T, P = unknown>(template: ComponentTemplate<T, P>) => boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component<T = any> = {
  type: Readonly<string>,
  data: T
}

export type System = {
  id: Readonly<string>,
  update: (ecs: ECS, elapsedMS: Milliseconds) => void,
  added: (ecs: ECS) => void,
  removed: (ecs: ECS) => void,
  enabled: (ecs: ECS) => void,
  disabled: (ecs: ECS) => void
}

export type EntityManager = {
  entities: Map<string, Entity>,
  addEntity: (entity: Entity) => void,
  addEntities: (...entities: Entity[]) => void,
  removeEntity: (entity: Entity | string) => void,
  addComponent: <T>(entity: Entity, component: Component<T>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeComponent: <T, P = any>(entity: Entity, component: Component<T> | ComponentTemplate<T, P>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEntities: (...type: ComponentTemplate<any>[]) => Entity[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEntity: (...type: ComponentTemplate<any>[]) => Entity,
  getEntityById: (id: string) => Entity,
  runTasks: () => void
}

export type SystemManager = {
  systems: Map<string, System>,
  enabledSystems: Map<string, System>,
  addSystem: (system: System) => void,
  removeSystem: (system: System | string) => void,
  enableSystem: (system: System | string) => void,
  disableSystem: (system: System | string) => void,
  runTasks: () => void
}

export type ECS = EntityManager & SystemManager

export type Space = System & ECS

export type Engine = ECS & {
  update: (elapsedMS: Milliseconds) => void
}
