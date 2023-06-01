import { Task } from "@/shared/Task";
import { remultNext } from "remult/remult-next";

export default remultNext({
  entities: [Task],
});
