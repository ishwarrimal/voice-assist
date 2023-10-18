import React, { useState, useEffect } from 'react';
import './App.css';
import './script'
import { initializeVoiceAssist } from './script';

function App() {
  const [showModal, setShowModal] = useState(false)
  const [globalSpeech, setGlobalSpeech] = useState('apple')
  useEffect(() => {
    initializeVoiceAssist(setGlobalSpeech)
  }, [])
   return (
    <div className="App">
      <p>Note: Please keep "control" pressed when you speak. 
      <br/> You can use command "next" and "previous" to navigate the form.
      <br/>Global commands like "create a task" is supported.
      </p>
      <h3>Crete a new Task</h3>
      <div className='addTaskButtonContainer'>
        <button id="create-task" data-global-command="create-task" onClick={() => setShowModal(!showModal)}>{!showModal ? '+ Add Task' : '- Close Task'}</button>
      </div>
      {showModal && 
        <div className='formContainer'>
          <form className='appForm' aria-label="Form to enter details for creating a new task">
            <label htmlFor="task-name">Task Name</label>
            <input type="text" id="task-name" placeholder='Enter Task Name'/>
            <label htmlFor='assignee-name'>Assignee Name</label>
            <select name="assignee" id="assignee-name">
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
              <option value="User 3">User 3</option>
            </select>
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
    </div>
  );
}

export default App;
