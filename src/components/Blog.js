import React, {useState, useImperativeHandle} from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = React.forwardRef(({blog, user}, ref) => {

  const [enlarged, setEnlarge] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [removed, setRemoved] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const blogObject = {
      user : blog.user.id,
      likes : likes+1,
      author : blog.author,
      title : blog.title,
      url : blog.url
    }
    const id = blog.id

    blogService
      .update(id, blogObject)
      .then(setLikes(likes+1))

  }
  const removeBlog = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      blogService
      .remove(blog.id)
      .then(setRemoved(true))
    }
  }

  const toggleEnlarge = () => {
    setEnlarge(!enlarged)
  }
  
  useImperativeHandle(ref, () => {
    return {
      toggleEnlarge
    }
  })
  if(removed)
    return(false)
  if(enlarged){
    return(
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleEnlarge}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {likes}
          <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
        {user.username === blog.user.username ?
          <button 
          onClick={removeBlog} 
          style={{backgroundColor:'red'}}>
            remove
          </button> :
          <div></div>
        }
        
      </div>
    )
  }
  return(
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleEnlarge}>view</button>
    </div>
  )
})

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user:PropTypes.object.isRequired
}

export default Blog
