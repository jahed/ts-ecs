import { ECS, System, SystemManager, Tasks } from "./types";

export const createSystemManager = (getECS: () => ECS): SystemManager => {
  const systems: Map<string, System> = new Map();
  const enabledSystems: Map<string, System> = new Map();
  const tasks: Tasks = new Map();

  const addSystem = (system: System): void => {
    tasks.set(`addSystem(${system.id})`, () => {
      systems.set(system.id, system);
      enabledSystems.set(system.id, system);
      system.added(getECS());
    });
  };

  const removeSystem = (systemOrId: System | string): void => {
    const id = typeof systemOrId === "string" ? systemOrId : systemOrId.id;
    const system = systems.get(id);
    if (system) {
      tasks.set(`removeSystem(${system.id})`, () => {
        systems.delete(system.id);
        enabledSystems.delete(system.id);
        system.removed(getECS());
      });
    } else {
      console.warn(`attempted to remove system that was not found (${id})`);
    }
  };

  const enableSystem = (systemOrId: System | string): void => {
    const id = typeof systemOrId === "string" ? systemOrId : systemOrId.id;
    const system = systems.get(id);
    if (system) {
      tasks.set(`enableSystem(${system.id})`, () => {
        enabledSystems.set(system.id, system);
        system.enabled(getECS());
      });
    } else {
      console.warn(`attempted to enable system that was not found (${id})`);
    }
  };

  const disableSystem = (systemOrId: System | string): void => {
    const id = typeof systemOrId === "string" ? systemOrId : systemOrId.id;
    const system = systems.get(id);
    if (system) {
      tasks.set(`disableSystem(${system.id})`, () => {
        enabledSystems.delete(system.id);
        system.disabled(getECS());
      });
    } else {
      console.warn(`attempted to disable system that was not found (${id})`);
    }
  };

  const runTasks = (): void => {
    for (const [, task] of tasks) {
      task();
    }
    tasks.clear();
  };

  return {
    systems,
    enabledSystems,
    addSystem,
    removeSystem,
    enableSystem,
    disableSystem,
    runTasks,
  };
};
