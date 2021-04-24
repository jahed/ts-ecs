# ts-ecs

[![npm](https://img.shields.io/npm/v/@jahed/ts-ecs.svg)](https://www.npmjs.com/package/@jahed/ts-ecs)
[![author](https://img.shields.io/badge/author-jahed-%23007fff)](https://jahed.dev/)

Experimental ECS Framework for TypeScript.

## Installation

```
npm install @jahed/ts-ecs
```

## Usage

A thorough example might be provided in the future. For now, here's a simple
one.

```ts
/*
 * Component Definitions are used to create and find components
 */

export const withPosition = defineComponent(
  'Position',
  (position: Position): Position => position
)

export const withRadius = defineComponent(
  'Radius',
  (radius: number): number => radius
)

/*
 * Systems are used to query and modify components.
 */

const createRenderSystem = (app: Application): System => {
  return createSystem({
    id: 'renderSystem',
    update: (ecs, elapsedMS) => {
      /*
       * Query entities that share common components.
       */
      for (const entity of ecs.getEntities(withPosition, withRadius)) {
        const { data: { x, y } } = entity.getComponent(withPosition)
        const { data: radius } = entity.getComponent(withRadius)
        app.drawCircle(x, y, radius)
      }
    }
  })
}

export const createTitleSystem = (onStartGame: () => void): System => {
  return createSystem({
    id: 'TitleSystem',
    update: (ecs) => {
      if (/* input logic */) {
        onStartGame()
      }
    }
  })
}

/*
 * Spaces are used to group entities, components and systems together
 */

export const createTitleSpace = (
  app: Application,
  onStartGame: () => void
): Space => {
  /*
   * Entities are a grouping of components.
   */
  const logo = createEntity('logo')
    .addComponent(createComponent(withPosition, { x: 10, y: 10 }))
    .addComponent(createComponent(withRadius, 5))

  const space = createSpace({ id: 'title' })
  space.addSystem(createRenderSystem(app))
  space.addSystem(createTitleSystem(onStartGame))
  space.addEntity(logo)
  return space
}


export const createBattleSpace = (
  app: Application,
  onBattleEnd: () => void
): Space => {
  // similar to createTitleSpace
}

/*
 * An "app" can be any rendering framework. e.g. pixi.js.
 */
const app = createApp();

/*
 * The Engine decided which systems execute and when.
 */
const engine = createEngine();

/*
 * Let's tie the spaces together so we can transition from one to the other and
 * back.
 */
createTitleSpace(app, () => {
  const battleSpace = createBattleSpace(app, () => {
    engine.removeSystem(battleSpace)
    engine.addSystem(titleSpace)
  })

  engine.removeSystem(titleSpace)
  engine.addSystem(battleSpace)
})

engine.addSystem(titleSpace)

/*
 * Now we can update everything on each tick.
 */
app.ticker.add(() => engine.update(app.ticker.elapsedMS))
```

## License

Copyright (C) 2020 Jahed Ahmed

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.
