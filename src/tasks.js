import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASK = 'SHOW_TASKS';

const createNewTaskAction = (content) => {
  return {
    type: CREATE_TASK,
    value: content
  };
};

const showTaskAction = (show) => {
  return {
    type: SHOW_TASK,
    value: show
  };
};

const completeTaskAction = (id, isComplete) => {
  return {
    type: COMPLETE_TASK,
    id,
    value: isComplete
  };
};

class TaskStore extends ReduceStore {
  getInitialState () {
    return {
      tasks: [
        {
          id: id(),
          content: 'Update CSS Task',
          completed: false
        },
        {
          id: id(),
          content: 'Create new tracert',
          completed: false
        },
        {
          id: id(),
          content: 'Get awesome task List',
          completed: false
        }
      ],
      showCompleted: true
    };
  }

  getState () {
    return this.__state;
  }

  reduce (state, action) {
    console.log('Reducing..', state, action);
    let newState;
    switch (action.type) {
      case CREATE_TASK:
        newState = {...state, tasks: [...state.tasks]};
        newState.tasks.push({
          id: id(),
          content: action.value,
          completed: false
        });
        return newState;
      case SHOW_TASK:
        newState = {...state, tasks: [...state.tasks], showCompleted: action.value};
        return newState;
      case COMPLETE_TASK:
        newState = {...state, tasks: [...state.tasks]};
        const affectedElementIndex = newState.tasks.findIndex(tsk => tsk.id === action.id);
        newState.tasks[affectedElementIndex] = {...state.tasks[affectedElementIndex], completed: action.value};
        return newState;
    }
    return state;
  }
}

const TaskComponent = ({content, completed, id}) => (
  `<div>
    ${content} <input type='checkbox' name='taskCompletedCheck' data-taskid=${id} ${completed ? 'checked' : ''} />
  </div>`
);

document.getElementById('undo').addEventListener('click', (event) => {
  event.preventDefault();
  taskStore.revertLastHistory();
});

const render = () => {
  const taskSection = document.getElementById('taskList');
  const state = taskStore.getState();

  const rendered = state.tasks.filter(task => state.showCompleted ? true : !task.completed)
    .map(TaskComponent).join('');

  taskSection.innerHTML = rendered;

  // ADD Listeners to all checks
  document.getElementsByName('taskCompletedCheck').forEach(element => {
    element.addEventListener('change', event => {
      const id = event.target.attributes['data-taskid'].value;
      const checked = event.target.checked;
      tasksDispatcher.dispatch(completeTaskAction(id, checked));
    });
  });
};

document.forms.newTask.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.newTask.value;
  if (name) {
    tasksDispatcher.dispatch(createNewTaskAction(name));
    e.target.newTask.value = null;
  }
});

document.getElementById('showComplete').addEventListener('change', ({target}) => {
  const showComplete = target.checked;
  tasksDispatcher.dispatch(showTaskAction(showComplete));
});

const taskStore = new TaskStore(tasksDispatcher);

tasksDispatcher.dispatch('TEST_DISPATCHER');

taskStore.addListener(() => {
  render();
});

render();