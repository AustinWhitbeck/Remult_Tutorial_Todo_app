// src/pages/index.tsx

import { FormEvent, useEffect, useState } from "react"
import { remult, UserInfo  } from "remult"
import { Task } from "../shared/Task"
import { TasksController } from "@/shared/TasksController";
import { signIn, signOut, useSession } from "next-auth/react"


/* NOTES *

taskRepo is a Remult Repository object used to fetch and create Task entity objects.

2. You can pass option parameters like SQL statements to the find method.

3. Nice TypeScript autocomplete and suggestions for the options argument



*/


const taskRepo = remult.repo(Task)

export default function Home() {
  const session = useSession()

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    try {
      /*
       Steps: 
       1. call the repo, instert the new task with the title.
          This will automatically set completed to false and
          id to auto increment as this is defined in the @Entity of Task
      
       2. set the task state to the tasks and spread in the new task. 

      */
      await taskRepo.insert({ title: newTaskTitle })
      // setTasks([...tasks, newTask])
      setNewTaskTitle("")
    } catch (error: any) {
      alert(error.message)
    }
  }


  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
  }

  //** / NOTES  **\\
  /*
    liveQuery vs. find.
    find may be better for useQuery in tan stack as it might not refresh oth
    erwise.

    The subscribe method accepts a callback with an info object that has 3 members:

      1. items - an up to date list of items representing the current result - it's useful for readonly use cases.
      2. applyChanges - a method that receives an array and applies the changes to it - we send that method to the setTasks state function, to apply the changes to the existing tasks state.
      3. changes - a detailed list of changes that were received
  */
  useEffect(() => {
    remult.user = session.data?.user as UserInfo
  if (session.status === "unauthenticated") signIn()
  else if (session.status === "authenticated")
    taskRepo.liveQuery({
      limit: 20,
      orderBy: { completed: "asc"},
      // Example SQL style query options
      // where: { completed: false},
      // where: { title: 'Clean car'},
    }).subscribe( info => setTasks(info.applyChanges))
  }, [session])

  if (session.status !== "authenticated") return <h1>Not Authenticated</h1>

  return (
    <div>
      <h1>Todos</h1>
      <main>
        <div>
          Hello {remult.user?.name}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
        <div>
          <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
          <button onClick={() => setAllCompleted(false)}>Set All Uncompleted</button>
        </div>

        <form onSubmit={addTask}>
          <input
            value={newTaskTitle}
            placeholder="What needs to be done?"
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>
        </form>

        {tasks.map(task => {

        // Functions

        const setTask = (value: Task) =>
           tasks.map(t => (t === task ? value : t))

       const setCompleted = async (completed: boolean) =>
        // setTask(await taskRepo.save({ ...task, completed })) <- Delete this line
        await taskRepo.save({ ...task, completed }) // <- replace with this line
        
        const setTitle = (title: string) => setTask({ ...task, title })

        const saveTask = async () => {
          try {
            // setTask(await taskRepo.save(task)) <- Delete this line
            await taskRepo.save(task) // <- replace with this line
          } catch (error: any) {
            alert(error.message)
          }
        }

        const deleteTask = async () => {
          try {
            await taskRepo.delete(task)
            // setTasks(tasks.filter(t => t !== task)) <- Delete this line
          } catch (error: any) {
            alert(error.message)
          }
        }
          return (
            <div key={task.id}>
              <input 
                type="checkbox" 
                checked={task.completed}           
                onChange={e => setCompleted(e.target.checked)} 
              />
              <input value={task.title} onChange={e => setTitle(e.target.value)} />
              <button onClick={saveTask}>Save</button>
              <button onClick={deleteTask}>Delete</button>
            </div>
          )
        })}
      </main>
    </div>
  )
}