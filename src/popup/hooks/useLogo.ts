import { useMemo, useState } from 'react'
import { getLogoUrl } from '@/shared/utils'

export function useLogo(url: string | null) {
  const logoUrl = useMemo(() => getLogoUrl(url), [url])
  const [hasError, setHasError] = useState(false)

  return {
    logoUrl: hasError ? null : logoUrl,
    onError: () => setHasError(true),
    resetError: () => setHasError(false),
  }
}
