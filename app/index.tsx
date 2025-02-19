import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from '../model/schema'
import Todo from '../model/Todo'

const adapter = new SQLiteAdapter({
  schema,
  onSetUpError: error => {
    console.error(error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [Todo],
})