// src/shared/Task.ts

import { Entity, Fields } from "remult";

/* NOTES: 

Entity Class
Decorates classes that should be used as entities. Receives a key and an array of EntityOptions.

*/
@Entity("tasks", {
  allowApiCrud: true,
})
export class Task {
  @Fields.autoIncrement()
  id = 0;

  @Fields.string()
  title = "";

  @Fields.boolean()
  completed = false;
}
