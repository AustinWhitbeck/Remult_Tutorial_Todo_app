// src/shared/Task.ts

import { Allow, Entity, Fields } from 'remult'

/* NOTES: 

Entity Class
Decorates classes that should be used as entities. Receives a key and an array of EntityOptions.

fields can take an object literal for options such as { validate: }

Example of HTTP response coming back when not giving a title value when required

e: application/json"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    98  100    85  100    13   9826   1502 --:--:-- --:--:-- --:--:-- 12250HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
ETag: "a03myh52v52d"
Content-Length: 85
Vary: Accept-Encoding
Date: Thu, 01 Jun 2023 20:15:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
    "modelState":
    {"title":"Should not be empty"},
    "message":"Title: Should not be empty"
}


You can create a custom validation handling function

*/
@Entity('tasks', {
	// NOTE: without authentication value
	// allowApiCrud: true,

	// NOTE: Requiring authentication
	allowApiCrud: Allow.authenticated,
	allowApiInsert: 'admin',
	allowApiDelete: 'admin',
})
export class Task {
	@Fields.autoIncrement()
	id = 0

	@Fields.string({
		// Validation Required version
		// validate: Validators.required,

		// Throws an error/alert that it's too short
		validate: (task) => {
			if (task.title.length < 3) throw 'Too Short'
		},
		allowApiUpdate: 'admin',
	})
	title = ''

	@Fields.boolean()
	completed = false
}
