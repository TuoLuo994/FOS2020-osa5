import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = React.forwardRef(({ blog, user, addLike }, ref) => {

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
      likes, setLikes, blog
    }
  })
  if(removed)
    return(false)
  if(enlarged){
    return(
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleEnlarge}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {likes}
          <button id='add-like' onClick={addLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
        {user.username === blog.user.username ?
          <button
            onClick={ removeBlog }
            style={{ backgroundColor:'red' }}>
            remove
          </button> :
          <div></div>
        }
      </div>
    )
  }
  return(
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleEnlarge}>view</button>
    </div>
  )
})

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user:PropTypes.object.isRequired
}

Blog.displayName = 'Blog'

export default Blog
