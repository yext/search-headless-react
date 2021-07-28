import { StatefulCore } from '@yext/answers-headless'
import React from 'react'

// Don't set a default because we don't know the user's config yet
export const StatefulCoreContext = React.createContext<StatefulCore | null>(null)
