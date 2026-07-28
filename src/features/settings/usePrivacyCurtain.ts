import { useEffect, useState } from 'react'
import { appPreferenceRepository } from '../../data/repositories'

export function usePrivacyCurtain() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appPreferenceRepository.getSingleton().then((preference) => {
      setEnabled(preference.privacyCurtainEnabled)
      setLoading(false)
    })
  }, [])

  async function setPrivacyCurtainEnabled(next: boolean) {
    await appPreferenceRepository.save({ privacyCurtainEnabled: next })
    setEnabled(next)
  }

  return { enabled, loading, setPrivacyCurtainEnabled }
}
