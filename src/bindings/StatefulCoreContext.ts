import React from 'react'
import { StatefulCore } from '../../../lib/esm'

// Don't set a default because we don't know the user's config yet
export const StatefulCoreContext = React.createContext<StatefulCore | null>(null)
