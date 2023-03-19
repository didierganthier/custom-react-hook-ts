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
    <div className='grid grid-cols-3'>
      {data && data.map(post => (
        <div key={post.id} className='border shadow-md my-4 mx-10 p-4 rounded-lg'>
          <div className='flex items-center'>
            <img src={`https://avatars.dicebear.com/api/adventurer/${post.id}.svg`} alt='avatar' className='w-10 h-10 rounded-full' />
            <h3 className='font-bold uppercase'>{post.title}</h3>
          </div>
          <p className=''>{post.body}</p>
        </div>
      ))}
    </div>
  )
}

export default App