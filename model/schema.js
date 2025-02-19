import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'text', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'order', type: 'number' },
      ]
    })
  ]
})
