import React, { useState, useEffect } from 'react';
import './App.css';
import './script'
import { initializeVoiceAssist } from './script';
import { INTRO_MSG } from './constants';

function App() {
  const [showModal, setShowModal] = useState(false)
  const [globalSpeech, setGlobalSpeech] = useState(INTRO_MSG)
  const [taskList, setTaskList] = useState([{taskName: 'Task 1', assignee: "User 2", dueDate: '12/10/2023', note: "This is a note"},{taskName: 'Task 2', assignee: "User 3", dueDate: '12/10/2023', note: "This is a note test"}])
  useEffect(() => {
    initializeVoiceAssist(setGlobalSpeech)
  }, [])

  function formSubmit(e){
    e.preventDefault();
    const taskName = document.getElementById('task-name').value
    const assignee = document.getElementById('assignee-name').value
    const dueDate = document.getElementById('due-date').value
    const note = document.getElementById('notes').value
    const newTask = {taskName, assignee, dueDate, note}
    let newTaskList = [...taskList]
    newTaskList.push(newTask)
    setTaskList(newTaskList)
    setShowModal(false)
  }
   return (
    <div className="App">
      <h3>Crete a new Task</h3>
      <div className='addTaskButtonContainer'>
        <button id="create-task" data-global-command="create-task" onClick={() => setShowModal(!showModal)}>{!showModal ? '+ Add Task' : '- Close Task'}</button>
      </div>
      {showModal && 
        <div className='formContainer'>
          <form className='appForm' aria-label="Form to enter details for creating a new task" onSubmit={formSubmit}>
            <h3 className='heading'>Add task</h3>
            <label htmlFor="task-name">Task Name</label>
            <input type="text" id="task-name" autoFocus placeholder='Enter Task Name'/>
            <label htmlFor='assignee-name' aria-label='Enter assignee name'>Assignee Name</label>
            <select name="assignee" id="assignee-name">
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
              <option value="User 3">User 3</option>
            </select>
            <label htmlFor='due-date'>Due Date</label>
            <input type="date" id="due-date"/>
            <label htmlFor='notes' >Notes</label>
            <textarea id="notes" type="text" placeholder='Notes'/>
            <div className="buttonContainer">
              <button type="submit">Submit</button>
              <button type="reset">Clear</button>
            </div>
          </form>
        </div>
      }
      {globalSpeech.length > 0 && 
      <div className='global-speech-output'>
        {globalSpeech}
      </div>
      }
      {
        taskList.length > 0 && 
        <table>
          <thead>
            <tr>
              <td>Task</td>
              <td>Assignee</td>
              <td>Due Date</td>
              <td>Notes</td>
            </tr>
          </thead>
          <tbody>
            {taskList.map(task => <tr key={task.taskName}>
              <td>{task.taskName}</td>
              <td>{task.assignee}</td>
              <td>{task.dueDate}</td>
              <td>{task.note}</td>
            </tr>)}
          </tbody>
        </table>
      }
    </div>
  );
}

export default App;
