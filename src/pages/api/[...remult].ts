import { Task } from "@/shared/Task";
import { remultNext } from "remult/remult-next";

/* NOTES

 Task can be in the entities key as it has the @Entity decorator.
 The key also acts as the API route and default database collection/table name


 Currently there is no database, we are storing and data in a backend JSON file.
 see folder `db`
 

*/
export default remultNext({
  entities: [Task],
});
