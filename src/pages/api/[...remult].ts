import { Task } from '@/shared/Task'
import { TasksController } from '@/shared/TasksController'
import { remultNext } from 'remult/remult-next'
import { findUserById } from './auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'

/* NOTES

 Task can be in the entities key as it has the @Entity decorator.
 The key also acts as the API route and default database collection/table name


 Currently there is no database, we are storing and data in a backend JSON file.
 see folder `db`
 

*/
export default remultNext({
	entities: [Task],
	controllers: [TasksController],
	// This is the remult key, using NextAuth methods
	getUser: async (req) => findUserById((await getToken({ req }))?.sub),
})
