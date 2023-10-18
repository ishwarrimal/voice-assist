import React, { useState } from 'react';
import './App.css';
import './helper'

function App() {
  const [showModal, setShowModal] = useState(false)
   return (
    <div className="App">
      <div className='addTaskButtonContainer'>
        <button onClick={() => setShowModal(!showModal)}>{!showModal ? '+ Add Task' : '- Close Task'}</button>
      </div>
      {showModal && 
        <div className='formContainer'>
          <p>Note: Please keep "control" pressed when you speak. <br/> You can use command "next" and "previous" to navigate the form.</p>
          <h3>Crete a new Task</h3>
          <form className='appForm' aria-label="Please enter task details below">
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
    </div>
  );
}

export default App;
