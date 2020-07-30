import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('clicking like twice gives two likes', () => {
  const blog = {
    likes: 5,
    title: 'Hello world',
    author: 'Tuomas',
    url: 'www.google.com',
    user: {
      username: 'Tupa',
      name: 'Tuomas',
      id: '5f16e6eaa927315a2ebbe3dc'
    },
    id: '5f21205e912d36382692dad1'
  }
  const user = {
    name: 'Tuomas',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlR1cGEiLCJpZCI6IjVmMTZlNmVhYTkyNzMxNWEyZWJiZTNkYyIsImlhdCI6MTU5NjA5NDcwNH0.rHuWNHJ5COYokDaVN-J7wRtscblpBL6Ttw_TNtNgfZI',
    username: 'Tupa'
  }
  const mockHandler = jest.fn()
  const component = render(
    <Blog blog={blog} user={user} addLike={mockHandler} />
  )
  const openButton = component.getByText('view')
  fireEvent.click(openButton)

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('renders title, author, url, and likes when button is clicked', () => {
  const blog = {
    likes: 5,
    title: 'Hello world',
    author: 'Tuomas',
    url: 'www.google.com',
    user: {
      username: 'Tupa',
      name: 'Tuomas',
      id: '5f16e6eaa927315a2ebbe3dc'
    },
    id: '5f21205e912d36382692dad1'
  }
  const user = {
    name: 'Tuomas',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlR1cGEiLCJpZCI6IjVmMTZlNmVhYTkyNzMxNWEyZWJiZTNkYyIsImlhdCI6MTU5NjA5NDcwNH0.rHuWNHJ5COYokDaVN-J7wRtscblpBL6Ttw_TNtNgfZI',
    username: 'Tupa'
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} addLikes={mockHandler}  />
  )
  const button = component.getByText('view')

  fireEvent.click(button)
  expect(component.container).toHaveTextContent(
    'Hello world Tuomas'
  )
  expect(component.container).toHaveTextContent(
    '5'
  )
  expect(component.container).toHaveTextContent(
    'www.google.com'
  )
})

test('renders title and author, not url or likes', () => {
  const blog = {
    likes: 5,
    title: 'Hello world',
    author: 'Tuomas',
    url: 'www.google.com',
    user: {
      username: 'Tupa',
      name: 'Tuomas',
      id: '5f16e6eaa927315a2ebbe3dc'
    },
    id: '5f21205e912d36382692dad1'
  }
  const user = {
    name: 'Tuomas',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlR1cGEiLCJpZCI6IjVmMTZlNmVhYTkyNzMxNWEyZWJiZTNkYyIsImlhdCI6MTU5NjA5NDcwNH0.rHuWNHJ5COYokDaVN-J7wRtscblpBL6Ttw_TNtNgfZI',
    username: 'Tupa'
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} addLikes={mockHandler}  />
  )


  expect(component.container).toHaveTextContent(
    'Hello world Tuomas'
  )
  expect(component.container).not.toHaveTextContent(
    '5'
  )
  expect(component.container).not.toHaveTextContent(
    'www.google.com'
  )
})