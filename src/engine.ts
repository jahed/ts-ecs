import { createEntityManager } from './entityManager'
import { createSystemManager } from './systemManager'
import { Engine, Milliseconds } from './types'

export const createEngine = (): Engine => {
  const em = createEntityManager()
  const sm = createSystemManager(() => engine)

  const update = (elapsedMS: Milliseconds): void => {
    em.runTasks()
    sm.runTasks()

    for (const [, system] of sm.enabledSystems) {
      system.update(engine, elapsedMS)
    }
  }

  const engine: Engine = {
    update,
    ...em,
    ...sm
  }

  return engine
}
