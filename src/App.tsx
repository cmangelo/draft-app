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
    faUserCheck,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { ConnectedRouter } from 'connected-react-router'
import { Redirect, Route, Switch } from 'react-router-dom'
import { history } from './store/store'

import { DraftArena } from './app/views/arena/DraftArena'
import { DraftsList } from './app/views/draftsList/DraftsList'
import { CreateDraft } from './app/views/createDraft/CreateDraft'
import { Sidebar } from './app/components/sidebar/Sidebar'
import { UserRanks } from './app/views/userRanks/UserRanks'

library.add(
  faBars,
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
	faSignOutAlt,
  faUserPlus,
  faUserCheck
)

const routes = [
	// {
	// 	path: '/login',
	// 	main: (props: any) => <LandingPage {...props} />
	// },
	{
		path: '/drafts/create',
		main: (props: any) => <CreateDraft {...props} />
	},
	{
		path: '/drafts/:draftId',
		main: (props: any) => <DraftArena {...props} />
	},
	{
		path: '/drafts',
		main: (props: any) => <DraftsList {...props} />
	},
	{
		path: '/players',
		main: (props: any) => <UserRanks {...props} />
	},
	// {
	// 	path: '/',
	// 	main: (props: any) => <LandingPage {...props} />
	// }
];

function App() {
  return (
    <div className="App">
      <ConnectedRouter history={history}>
				<Sidebar />
        <div className="content">
          <Switch>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                render={props => route.main(props)} />
            ))}
            <Redirect from="/" to="/drafts" exact />
          </Switch>
        </div>
      </ConnectedRouter>
    </div>
  )
}

export default App
