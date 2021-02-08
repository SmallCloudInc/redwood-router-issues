import { Link, routes, useMatch } from '@redwoodjs/router'
import ProfileMenu from 'src/components/ProfileMenu/ProfileMenu'
import PublicPortalSidebarCell from 'src/components/PublicPortalSidebarCell'
import { useAuth } from '@redwoodjs/auth'

const CustomLink = ({ to, children }) => {
  const matchInfo = useMatch(to)
  const activeClassName = 'group flex items-center px-2 py-2 text-lg leading-5 font-medium text-indigo-600 rounded-md focus:outline-none bg-gray-200 transition ease-in-out duration-150'
  const inActiveClassName = 'group flex items-center px-2 py-2 text-lg leading-5 text-gray-600 rounded-md hover:text-indigo-600 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150'
  if (matchInfo.match) {
    return (
      <Link to={to} className={activeClassName}>
        {children}
      </Link>
    )
  } else {
    return (
      <Link to={to} className={inActiveClassName}>
        {children}
      </Link>
    )
  }
}

const Navigation = () => {
  const { isAuthenticated, currentUser } = useAuth()
  return (
    <div class="flex flex-col w-64 border-r border-gray-200 pb-4 bg-gray-50 min-h-screen flex-grow">
      <div class="flex flex-col flex-grow pt-5 pb-4">
        <div class="flex items-center flex-shrink-0 px-4">
          <img src="https://d33wubrfki0l68.cloudfront.net/492ed629970792d32ac857da0166a7d2308bad99/428b6/images/diecut.svg" alt="Redwood Logo" class="w-2/3 mx-auto" />
        </div>
        <nav class="mt-5 flex-1 flex flex-col px-2 bg-gray-50 justify-between">
          <div class="space-y-2">
            <CustomLink to={routes.dashboard({ workspace: currentUser.defaultWorkspace })}>
              <svg class="mr-3 h-6 w-6 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Dashboard
            </CustomLink>
          </div>
          <PublicPortalSidebarCell />
        </nav>
      </div>
      <div class="flex-shrink-0 flex border-t border-gray-200 p-2">
        <ProfileMenu />
      </div>
    </div>
  )
}

export default Navigation
