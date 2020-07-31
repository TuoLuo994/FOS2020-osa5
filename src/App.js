import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = React.createRef()
  const likesRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const addLike = () => {
    const newLikes = likesRef.current.likes+1
    const blog = likesRef.current.blog
    const blogObject = {
      user : blog.user.id,
      likes : newLikes,
      author : blog.author,
      title : blog.title,
      url : blog.url
    }
    const id = blog.id

    blogService
      .update(id, blogObject)
      .then(likesRef.current.setLikes(newLikes))

  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception){
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} was added`
        )
        setTimeout(() => {
          setMessage(null)
        },5000)

      })
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null){
    return(
      <div>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {user.name} logged in
      <button onClick={() => window.localStorage.removeItem('loggedBlogappUser')}>logout</button>
      <h2>create new</h2>
      {blogForm()}
      {blogs.sort((a,b) => b.likes-a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={addLike}
          ref={likesRef}
        />
      )}
    </div>
  )
}

export default App
