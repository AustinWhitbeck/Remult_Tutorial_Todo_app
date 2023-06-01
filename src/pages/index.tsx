// src/pages/index.tsx

import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import { Task } from "../shared/Task"

/* NOTES *

taskRepo is a Remult Repository object used to fetch and create Task entity objects.

2. You can pass option parameters like SQL statements to the find method.

3. Nice TypeScript autocomplete and suggestions for the options argument



*/


const taskRepo = remult.repo(Task)

export default function Home() {
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
      const newTask = await taskRepo.insert({ title: newTaskTitle })
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    } catch (error: any) {
      alert(error.message)
    }
  }

  useEffect(() => {
    taskRepo.find({
      limit: 20,
      orderBy: { completed: "asc"},
      // Example SQL style query options
      // where: { completed: false},
      // where: { title: 'Clean car'},
    }).then(setTasks)
  }, [])

  return (
    <div>
      <h1>Todos</h1>
      <main>

        <form onSubmit={addTask}>
          <input
            value={newTaskTitle}
            placeholder="What needs to be done?"
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>
        </form>

        {tasks.map(task => {

        const setTask = (value: Task) =>
          setTasks(tasks => tasks.map(t => (t === task ? value : t)))

        const setCompleted = async (completed: boolean) =>
          setTask(await taskRepo.save({ ...task, completed }))
        
        const setTitle = (title: string) => setTask({ ...task, title })

        const saveTask = async () => {
          try {
            setTask(await taskRepo.save(task))
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
            </div>
          )
        })}
      </main>
    </div>
  )
}