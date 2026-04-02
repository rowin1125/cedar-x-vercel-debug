import type { FindUserExamples, FindUserExamplesVariables } from 'types/graphql'

import { Link, routes } from '@cedarjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

import UserExamples from 'src/components/UserExample/UserExamples'

export const QUERY: TypedDocumentNode<
  FindUserExamples,
  FindUserExamplesVariables
> = gql`
  query FindUserExamples {
    userExamples {
      id
      email
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No userExamples yet.{' '}
      <Link to={routes.newUserExample()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindUserExamples>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userExamples,
}: CellSuccessProps<FindUserExamples, FindUserExamplesVariables>) => {
  return <UserExamples userExamples={userExamples} />
}
