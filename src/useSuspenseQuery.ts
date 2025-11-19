import {
  type QueryParamsProperties,
  type Query,
} from "./useQuery"

export type SuspenseQueryResult<T> = Query<T>
export type SuspenseQueryParamsProperties = QueryParamsProperties

export const useSuspenseQuery = <T> (params: SuspenseQueryParamsProperties): SuspenseQueryResult<T> => {
  throw new Error("useSuspenseQuery is not implemented yet.")
}
