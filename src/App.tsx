import React from 'react'
import useFetch from './hooks/useFetch'

interface Post {
  id: number
  title: string
  body: string
}

const App: React.FC = () => {
  const { data, error } = useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts')

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      {data && data.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  )
}

export default App