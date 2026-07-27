import { db } from '../db'
import { transitionEventSchema, type TransitionEvent } from '../schemas'
import { createRepository } from './createRepository'

const base = createRepository<TransitionEvent>(db.transitionEvents, transitionEventSchema)

export const transitionEventRepository = {
  ...base,
  async listChronological(): Promise<TransitionEvent[]> {
    return db.transitionEvents.orderBy('occurredAt').toArray()
  },
}
