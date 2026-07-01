import apiClient from './apiClient'

export const fetchSamplePosts = async () => {
  const response = await apiClient.get('/posts?_limit=3')
  return response.data
}
