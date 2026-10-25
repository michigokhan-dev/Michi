import { Story } from '../components/Story.js'
import { PostInput } from '../components/PostInput.js'
import { Post } from '../components/Post.js'

export function Feed(){
  return `
    ${Story()}
    ${PostInput()}
    ${Post()}
  `
}
