import { useAuth } from '@redwoodjs/auth'

const portalHost = process.env.UV_PORTAL_DOMAIN

export const QUERY = gql`
  query PublicPortalSidebarQuery {
    myPortalToken {
      token
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div></div>

export const Success = ({ myPortalToken }) => {
  const { currentUser } = useAuth()

  return (
    <div class="space-y-1 mt-auto">
      <h3 class="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider" id="projects-headline">
        {currentUser.currentTeam.name} portal
      </h3>
      <div class="space-y-1" role="group" aria-labelledby="projects-headline">
        <a href={`http://${currentUser.defaultWorkspace}.${portalHost}/?token=${myPortalToken.token}`} target="_blank" class="group flex items-center px-3 py-1 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
          <span class="truncate">Public portal</span>
        </a>
      </div>
    </div>
  )
}
