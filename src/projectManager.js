/* eslint-disable no-loop-func */
/* eslint-disable no-alert */
/* eslint-disable no-console */

import ProjectList from './projectList';
import Project from './project';
import Todo from './todo';
import Create from './create';

const ProjectManager = () => {
  const list = ProjectList();
  let currentProject = 0;
  let currentTodo = 0;

  const cleanActive = () => {
    for (let i = 0; i < list.projectList.length; i += 1) {
      const currentElement = document.getElementById(`project-${i}`);
      currentElement.classList.remove('Active');
    }
  };

  const renderTodos = (index = 0) => {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    for (let i = 0; i < list.projectList[index].todoList.length; i += 1) {
      const todoElement = Create(todoList, 'list-group-item', `todo-${i}`, 'li');
      const todoRow = Create(todoElement, 'row action', `todo-${i}`, 'li');
      const todoLeft = Create(todoRow, 'col-md-1');
      const todoCheckbox = Create(todoLeft, '', `checkbox-${i}`, 'input');
      const todoMiddle = Create(todoRow, 'col-md-8');
      const todoRight = Create(todoRow, 'col-md-3');
      const editBtn = Create(todoRight, 'btn btn-info', '', 'button');
      const deleteBtn = Create(todoRight, 'btn btn-danger', '', 'button');
      todoMiddle.innerHTML = `
      <strong>Task: ${list.projectList[index].todoList[i].title}</strong><br>
        Due Date: ${list.projectList[index].todoList[i].dueDate}<br>
        `;
      todoRight.classList.add('actionButtons');
      editBtn.textContent = 'Edit';
      deleteBtn.textContent = 'Delete';
      editBtn.setAttribute('data-toggle', 'modal');
      editBtn.setAttribute('data-target', '#myModal');

      editBtn.addEventListener('click', () => {
        currentTodo = i;
      });

      todoCheckbox.type = 'checkbox';
      if (list.projectList[index].todoList[i].isCompleted) todoCheckbox.checked = true;
      else todoCheckbox.checked = false;
      todoCheckbox.addEventListener('change', () => {
        list.switchCompleted(index, i);
        renderTodos(index);
      });

      todoElement.addEventListener('click', () => {
        document.getElementById('modal-title').value = list.projectList[index].todoList[i].title;
        document.getElementById('modal-date').value = list.projectList[index].todoList[i].dueDate;
        document.getElementById('modal-priority').value = list.projectList[index].todoList[i].priority;
        document.getElementById('modal-description').value = list.projectList[index].todoList[i].description;
      });

      deleteBtn.addEventListener('click', () => {
        list.delTodo(currentProject, i);
        renderTodos(currentProject);
      });
    }
  };

  const renderProjects = (index = 0) => {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    for (let i = 0; i < list.projectList.length; i += 1) {
      const rowProject = Create(projectList, 'row col-12');
      const projectElement = Create(rowProject, 'col-sm-9 list-group-item', `project-${i}`, 'li');
      if (i !== 0) {
        const delButton = Create(rowProject, 'btn btn-danger deleteBtn', 'delete-project', 'button');
        delButton.textContent = 'Delete';

        delButton.addEventListener('click', () => {
          list.delProject(i);
          renderTodos(0);
          renderProjects(0);
        });
      } else {
        const delButton = Create(rowProject, 'btn btn-danger defaultBtn disabled deleteBtn', 'delete-project', 'button');
        delButton.textContent = 'Delete';
      }

      projectElement.textContent = list.projectList[i].title;
      projectElement.addEventListener('click', () => {
        renderTodos(i);
        currentProject = i;
        cleanActive();
        projectElement.classList.add('Active');
      });
    }

    cleanActive();
    renderTodos(currentProject);
    currentProject = index;
    document.getElementById(`project-${index}`).classList.add('Active');
  };

  document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newProject = document.forms['project-form'][0];

    if (newProject.value !== '') {
      list.addProject(Project(newProject.value));
      newProject.value = null;
      renderProjects(list.projectList.length - 1);
    }
  });

  document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.forms['todo-form'][0].value === null || document.forms['todo-form'][0].value === '') {
      alert('Add the name of the To-do ');
    } else {
      list.addTodo(currentProject, Todo(
        document.forms['todo-form'][0].value,
        document.forms['todo-form'][1].value,
        document.forms['todo-form'][2].value,
        document.forms['todo-form'][3].value,
      ));
      renderTodos(currentProject);
      document.getElementById('todo-form').reset();
    }
  });

  document.getElementById('modal-button-save').addEventListener('click', (e) => {
    e.preventDefault();
    if (document.forms['todo-modal'][0].value === null || document.forms['todo-modal'][0].value === '') {
      alert('Add the name of the To-do ');
    } else {
      const array = [document.forms['todo-modal'][0].value,
        document.forms['todo-modal'][1].value,
        document.forms['todo-modal'][2].value,
        document.forms['todo-modal'][3].value];
      list.changeTodo(currentProject, currentTodo, array);
      renderTodos(currentProject);
      document.getElementById('todo-modal').reset();
    }
  });

  renderProjects();
  renderTodos(0);
  document.getElementById('project-0').classList.add('Active');
};

export default ProjectManager;
