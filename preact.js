import {h, Component} from 'preact'
import {createContext} from 'preact-context'

/* START DEVELOPMENT BUILD ONLY */
import devTool from './dev-tool'
/* END DEVELOPMENT BUILD ONLY */

import factory from './factory'

export default factory(devTool, h, Component, createContext)
