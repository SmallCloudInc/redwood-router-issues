import { Link, routes } from '@redwoodjs/router'
import { useSubdomain } from 'src/middleware'
import Layout from 'src/layouts/PortalLayout'
import { withPage } from 'src/components/WithPageHoc'
import PortalHeader from 'src/components/PortalHeader'
import { AvatarPill } from 'src/components/Avatar'
import { formatDistanceToNow, format, parseJSON } from 'date-fns'
import { startCase, get } from 'lodash'

export const QUERY = gql`
  query PortalProfilePageQuery($subdomain: String!) {
    subdomainMetadata(subdomain: $subdomain) {
      id
      name
      subdomain
    }
    myFeedback {
      text
      createdAt
      roadmapItem {
        name
        slug
        status
      }
      contact {
        id
        name
      }
    }
  }
`

export const beforeQuery = (props) => {
  const subdomainSlug = useSubdomain()
  return { variables: { subdomain: subdomainSlug } }
}

const Success = ({ subdomainMetadata, myFeedback }) => {
  return (
    <>
      <PortalHeader subdomainMetadata={subdomainMetadata} />
      <div class={'max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 mt-4'}>
        <h2 class="text-xl font-medium text-gray-700 mb-1">My Feedback History</h2>
        <div class="flex flex-col space-y-4">
          {myFeedback.map((insight) => (
            <Link to={routes.portalRoadmapItem({ itemSlug: insight.roadmapItem.slug })} class="flex hover  rounded-md p-4 shadow hover:shadow-md">
              <AvatarPill user={insight.contact} forceDefault={true} />
              <div class="ml-3">
                <div class="text-lg text-gray-700 mb-1 leading-5">{insight.text}</div>
                <div class="flex items-center">
                  <p class="flex text-gray-500 text-sm leading-5 space-x-2">
                    You submitted {formatDistanceToNow(parseJSON(insight.createdAt), 'LLLL, do yyyy')} ago for&nbsp;<span className="font-medium">{insight.roadmapItem.name}</span>
                  </p>
                  <div class="ml-1 inline-flex px-2.5 py-0.5 rounded-md text-sm font-medium leading-5 bg-green-100 text-green-800 capitalize">{startCase(insight.roadmapItem.status)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default withPage({
  beforeQuery,
  QUERY,
  Success,
  Layout,
})
