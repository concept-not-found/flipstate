import {createElement, Component, createContext} from 'react'

/* START DEVELOPMENT BUILD ONLY */
import devTool from './dev-tool'
/* END DEVELOPMENT BUILD ONLY */

import factory from './factory'

export default factory(devTool, createElement, Component, createContext)
