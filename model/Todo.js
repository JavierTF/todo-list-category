import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class Todo extends Model {
  static table = 'todos'

  @field('text') text
  @field('completed') completed
  @field('order') order
  @date('created_at') createdAt
}