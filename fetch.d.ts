import type { Ref, ShallowRef } from "@vue/reactivity"
import { AxiosInstance } from "axios"

export interface ApiTypeMap {}
export interface ErrorReturn {}

export interface URLMatchGroup {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
}

export interface ExtraOptions<T extends ApiTypeMap[P], P extends keyof ApiTypeMap> {
  /**
   * Request URL
   */
  url: string

  /**
   * Request Method
   */
  method: URLMatchGroup['method']

  /**
   * Request path params
   * @example /api/user/:id
   */
  params: T['request']

  /**
   * POST Request body params
   */
  body: T['request']

  /**
   * Wherevent immediate request
   */
  immediate: boolean

  /**
   * Data default value
   */
  default: T['response']
}

export interface UseFetchReturn<T> {
  data: ShallowRef<T | null>
  error: ShallowRef<ErrorReturn | null>
  isloading: Ref<boolean>
  reload: () => void
}

export interface UseIFetchReturn<T> {
  data: ShallowRef<T | null>
  error: ShallowRef<ErrorReturn | null>
  reload: () => Promise<void>
}

export default function createFetch(http: AxiosInstance): {
  useFetch<T extends ApiTypeMap[P], P extends keyof ApiTypeMap>(url: P, options?: Partial<ExtraOptions<T, P>>): UseFetchReturn<T['response']>
  useIFetch<T extends ApiTypeMap[P], P extends keyof ApiTypeMap>(url: P, options?: Partial<ExtraOptions<T, P>>): Promise<UseIFetchReturn<T['response']>>
}
