import { useEffect, useState } from 'react'
import { fetchSamplePosts } from '../services/api'

export const useFetchData = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchSamplePosts()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return { posts, loading, error }
}
