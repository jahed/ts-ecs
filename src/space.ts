import { createEntityManager } from './entityManager'
import { createSystemManager } from './systemManager'
import { ECS, Milliseconds, Space } from './types'

type CreateSpaceArgs = {
  id: Space['id'],
  added?: Space['added'],
  removed?: Space['removed'],
  enabled?: Space['enabled'],
  disabled?: Space['disabled']
}

export const createSpace = ({
  id,
  added = () => undefined,
  removed = () => undefined,
  enabled = () => undefined,
  disabled = () => undefined
}: CreateSpaceArgs): Space => {
  const em = createEntityManager()
  const sm = createSystemManager(() => space)

  const space: Space = {
    id,
    added: (ecs: ECS) => {
      for (const [, system] of sm.systems) {
        system.added(space)
      }
      added(ecs)
    },
    removed: (ecs: ECS) => {
      for (const [, system] of sm.systems) {
        system.removed(space)
      }
      removed(ecs)
    },
    update: (parent: ECS, elapsedMS: Milliseconds) => {
      em.runTasks()
      sm.runTasks()

      for (const [, system] of sm.enabledSystems) {
        system.update(space, elapsedMS)
      }
    },
    enabled: (ecs: ECS) => {
      for (const [, system] of sm.systems) {
        system.enabled(space)
      }
      enabled(ecs)
    },
    disabled: (ecs: ECS) => {
      for (const [, system] of sm.systems) {
        system.disabled(space)
      }
      disabled(ecs)
    },
    ...em,
    ...sm
  }

  return space
}
