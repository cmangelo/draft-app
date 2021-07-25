import './App.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import {
    faBars,
    faCheckSquare,
    faChevronDown,
    faChevronLeft,
    faDoorOpen,
    faFileUpload,
    faList,
    faListOl,
    faPencilAlt,
    faSignInAlt,
    faSignOutAlt,
    faSquare,
    faTh,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'

import { DraftArena } from './app/views/arena/DraftArena'

library.add(faBars,
	faList,
	faFileUpload,
	faSignInAlt,
	faListOl,
	faTh,
	faDoorOpen,
	faPlusSquare,
	faSquare,
	faCheckSquare,
	faEdit,
	faPencilAlt,
	faChevronLeft,
	faChevronDown,
	faTimes,
	faSignOutAlt)

function App() {

  return (
    <div className="App">
      <div className="content">
        <DraftArena />
      </div>
    </div>
  )
}

export default App
