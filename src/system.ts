import { System } from './types'

type CreateSystemArgs = {
  id: System['id'],
  update?: System['update'],
  added?: System['added'],
  removed?: System['removed'],
  enabled?: System['enabled'],
  disabled?: System['disabled']
}

export const createSystem = ({
  id,
  added = () => undefined,
  removed = () => undefined,
  update = () => undefined,
  enabled = () => undefined,
  disabled = () => undefined
}: CreateSystemArgs): System => {
  return {
    id,
    update,
    added,
    removed,
    enabled,
    disabled
  }
}
