
import './App.css';
import './helper'

function App() {
  return (
    <div className="App">
      <div className='formContainer'>
        <h3>Crete a new Task</h3>
        <form className='appForm' aria-label="Please enter task details below">
          <label htmlFor="task-name">Task Name</label>
          <input type="text" id="task-name" placeholder='Enter Task Name'/>
          <label htmlFor='notes' >Notes</label>
          <textarea id="notes" type="tel" placeholder='Notes'/>
          <div className="buttonContainer">
            <button type="submit">Submit</button>
            <button type="reset">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
