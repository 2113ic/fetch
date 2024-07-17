import type { AxiosResponse } from 'axios'
import createFetch from '@icxy/fetch'
import axios from 'axios'

const service = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000 * 60,
})

service.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
)

service.interceptors.response.use(
  res => handleResponse(res),
  error => Promise.reject(error),
)

function handleResponse(response: AxiosResponse) {
  const data = response.data

  if (data.code === 200) return data
  return Promise.reject(data)
}

export const { useFetch, useIFetch } = createFetch(service)
export default service
