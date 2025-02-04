import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
} from '@tanstack/react-query'

export const useQueryData =  <TData> (
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  enabled?: Enabled,

) => {
  const { data, isPending, isFetched, refetch, isFetching,isError } = useQuery<TData>({
    queryKey,
    queryFn,
  })
  return { data, isPending, isFetched, refetch, isFetching,isError }
}