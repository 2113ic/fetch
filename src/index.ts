import type { ApiTypeMap, ExtraOptions, URLMatchGroup, ErrorReturn, UseFetchReturn, UseIFetchReturn } from './type'
import type { AxiosInstance } from 'axios'
import { ref, shallowRef } from '@vue/reactivity'

export default function createFetch(http: AxiosInstance) {
  function useFetch<
    T extends ApiTypeMap[P],
    P extends keyof ApiTypeMap
  >(url: P, options: Partial<ExtraOptions<T, P>> = {}): UseFetchReturn<T['response']> {
    const { method, path } = patchURL(url as string, options.params)
    options = { immediate: true, method, url: path, ...options }

    const data = shallowRef<T['response'] | null>(options.default ?? null)
    const error = shallowRef<ErrorReturn | null>(null)
    const isloading = ref(false)

    options.immediate && reload()
    function reload() {
      isloading.value = true

      const response = http.request({
        url: options.url,
        method: options.method,
        data: options.body,
      })

      response.then((r: any) => data.value = r.data)
      response.catch((e: any) => error.value = e)
      response.finally(() => isloading.value = false)
    }

    return { data, error, isloading, reload }
  }

  async function useIFetch<
    T extends ApiTypeMap[P],
    P extends keyof ApiTypeMap
  >(url: P, options: Partial<ExtraOptions<T, P>> = {}): Promise<UseIFetchReturn<T['response']>> {

    const { method, path } = patchURL(url as string, options.params)
    options = { immediate: true, method, url: path, ...options }

    const data = shallowRef<T['response'] | null>(options.default ?? null)
    const error = shallowRef<ErrorReturn | null>(null)

    options.immediate && await reload()
    async function reload() {

      try {
        const response = await http.request({
          url: options.url,
          method: options.method,
          data: options.body,
        })

        data.value = response.data
      }
      catch (e: any) {
        error.value = e
      }
    }

    return { data, error, reload }
  }

  return { useFetch, useIFetch }
}

function patchURL<
  T extends ApiTypeMap[P],
  P extends keyof ApiTypeMap,
>(url: string, params?: T['request']) {
  const matchs = url.match(/(?<method>GET|POST|PUT|DELETE)? *(?<path>.+)/)
  if (!matchs) throw new Error('URL Wrong Format!')

  const { method, path } = (matchs.groups as any) as URLMatchGroup
  let _path = path

  if (params) {
    if (typeof params !== 'object') {
      _path = path.replace(/:([\w-]+)/, String(params))
    }
    else {
      for (const [key, value] of Object.entries(params)) {
        const reg = new RegExp(`[:{]${key}\}?`)
        _path = _path.replace(reg, String(value))
      }
      _path = _path.replace(/[:{][\w-]+\}?/g, '')
    }
  }

  return { method, path: _path }
}
