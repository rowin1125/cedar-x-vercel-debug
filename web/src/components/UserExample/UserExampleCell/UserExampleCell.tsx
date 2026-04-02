import type {
  FindUserExampleById,
  FindUserExampleByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

import UserExample from 'src/components/UserExample/UserExample'

export const QUERY: TypedDocumentNode<
  FindUserExampleById,
  FindUserExampleByIdVariables
> = gql`
  query FindUserExampleById($id: Int!) {
    userExample: userExample(id: $id) {
      id
      email
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>UserExample not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserExampleByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userExample,
}: CellSuccessProps<FindUserExampleById, FindUserExampleByIdVariables>) => {
  return <UserExample userExample={userExample} />
}
