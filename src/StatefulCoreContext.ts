import { StatefulCore } from '@yext/answers-headless'
import { createContext } from 'react'

// Don't set a default because we don't know the user's config yet
export const StatefulCoreContext = createContext<StatefulCore | null>(null)
