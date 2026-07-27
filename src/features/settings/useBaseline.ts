import { useEffect, useState } from 'react'
import { personalBaselineRepository } from '../../data/repositories'
import type { PersonalBaseline } from '../../data/schemas'

const empty: Omit<PersonalBaseline, 'id' | 'schemaVersion'> = {}

export function useBaseline() {
  const [baseline, setBaseline] =
    useState<Omit<PersonalBaseline, 'id' | 'schemaVersion'>>(empty)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    personalBaselineRepository.getSingleton().then((found) => {
      if (found) {
        const { id: _id, schemaVersion: _schemaVersion, ...rest } = found
        setBaseline(rest)
      }
      setLoading(false)
    })
  }, [])

  async function save(next: Omit<PersonalBaseline, 'id' | 'schemaVersion'>) {
    await personalBaselineRepository.save(next)
    setBaseline(next)
  }

  return { baseline, loading, save }
}
