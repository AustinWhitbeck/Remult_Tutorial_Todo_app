import { Allow, BackendMethod, remult } from 'remult'
import { Task } from './Task'

/* // NOTES \\


BackendMethod interacts directly with the database vs. frontend version.


Definition of the 'static' keyword before function
    The static keyword defines a static method or field for a class, or a static initialization block (see the link for more information about this usage). 
    Static properties cannot be directly accessed on instances of the class. Instead, they're accessed on the class itself.



*/

export class TasksController {
	@BackendMethod({
		// NOTE: Allows all users to access
		// allowed: true

		// NOTE: Allows only authenticated users to access
		allowed: Allow.authenticated,
	})
	static async setAllCompleted(completed: boolean) {
		const taskRepo = remult.repo(Task)

		for (const task of await taskRepo.find()) {
			await taskRepo.save({ ...task, completed })
		}
	}
}
