import {
  Component,
  ComponentTemplate,
  Entity,
  EntityManager,
  Tasks,
} from "./types";

const getCacheKey = (templates: ComponentTemplate<unknown>[]): string => {
  let result = "";
  for (const template of templates) {
    result += template.type + "&";
  }
  return result;
};

export const createEntityManager = (): EntityManager => {
  const entities: Map<string, Entity> = new Map();
  const entityCache: Map<string, Entity[]> = new Map();
  const noEntities: Entity[] = [];
  const tasks: Tasks = new Map();

  const addEntity = (entity: Entity): void => {
    tasks.set(`addEntity(${entity.id})`, () => {
      entities.set(entity.id, entity);
    });
  };

  const removeEntity = (entity: Entity | string): void => {
    const id = typeof entity === "string" ? entity : entity.id;
    tasks.set(`removeEntity(${id})`, () => {
      entities.delete(id);
    });
  };

  const addComponent = (entity: Entity, component: Component): void => {
    tasks.set(`addComponent(${entity.id}, ${component.type})`, () => {
      entity.components.set(component.type, component);
    });
  };

  const removeComponent = <T>(
    entity: Entity,
    component: Component | ComponentTemplate<T>
  ): void => {
    tasks.set(`removeComponent(${entity.id}, ${component.type})`, () => {
      entity.components.delete(component.type);
    });
  };

  const addEntities = (...entities: Entity[]): void => {
    for (const entity of entities) {
      addEntity(entity);
    }
  };

  const getEntitiesInternal = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templates: ComponentTemplate<any>[]
  ): Entity[] => {
    const key = getCacheKey(templates);
    if (!entityCache.get(key)) {
      const result = [];
      for (const [, entity] of entities) {
        let failed = false;
        for (const template of templates) {
          if (!entity.hasComponent(template)) {
            failed = true;
            break;
          }
        }
        if (!failed) {
          result.push(entity);
        }
      }
      entityCache.set(key, result);
    }
    return entityCache.get(key) || noEntities;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEntities = (...templates: ComponentTemplate<any>[]): Entity[] => {
    return getEntitiesInternal(templates);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEntity = (...templates: ComponentTemplate<any>[]): Entity => {
    return getEntitiesInternal(templates)[0];
  };

  const getEntityById = (id: string): Entity => entities.get(id) as Entity;

  const runTasks = (): void => {
    for (const [, task] of tasks) {
      task();
    }
    if (tasks.size > 0) {
      tasks.clear();
      entityCache.clear();
    }
  };

  return {
    entities,
    addEntity,
    addEntities,
    removeEntity,
    getEntities,
    getEntity,
    getEntityById,
    addComponent,
    removeComponent,
    runTasks,
  };
};
