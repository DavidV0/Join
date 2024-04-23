let currentDraggedElement;
let subTaskStateArray = [];


let todos = [];
contacts = [];

function initBoard() {
	loadFromServer('contacts', contacts);
}

function updateBoard() {
	loadFromServer('tasks', todos);
	closePopupTask();
}



function searchTasks() {
	let searchQuery = document.getElementById('search').value.toLowerCase();

	const filteredTodos = todos.filter((todo) => {
		return (
			todo.title.toLowerCase().includes(searchQuery) ||
			todo.status.toLowerCase().includes(searchQuery) ||
			todo.description.toLowerCase().includes(searchQuery)
		);
	});

	updateHTML(filteredTodos);
}

function searchTasksMobile() {
	let searchQuery = document
		.getElementById('search-mobile')
		.value.toLowerCase();

	const filteredTodos = todos.filter((todo) => {
		return (
			todo.title.toLowerCase().includes(searchQuery) ||
			todo.status.toLowerCase().includes(searchQuery) ||
			todo.description.toLowerCase().includes(searchQuery)
		);
	});
	updateHTML(filteredTodos);
}

function updateHTML(tasks = todos) {
	//render tasks with each status
	renderToDo(tasks);
	renderInProgress(tasks);
	renderAwaitFeedback(tasks);
	renderDone(tasks);
}

function renderToDo(tasks) {
	let toDo = tasks.filter((t) => t['status'] == 'toDo');

	let toDoDiv = document.getElementById('toDo');
	toDoDiv.innerHTML = '';

	if (toDo.length == 0) {
		toDoDiv.innerHTML = ` <div class="no-tasks">No Tasks To do</div> `;
	}
	for (let i = 0; i < toDo.length; i++) {
		const e = toDo[i];
		toDoDiv.innerHTML += generateToDoHTML(e);
		displayCardAssignedContacts(e);
	}
}

function renderInProgress(tasks) {
	let inProgress = tasks.filter((t) => t['status'] == 'inProgress');
	let inProgressDiv = document.getElementById('inProgress');
	inProgressDiv.innerHTML = '';

	if (inProgress.length == 0) {
		inProgressDiv.innerHTML = ` <div class="no-tasks">No Tasks To do</div> `;
	}
	for (let i = 0; i < inProgress.length; i++) {
		const e = inProgress[i];
		inProgressDiv.innerHTML += generateToDoHTML(e);
		displayCardAssignedContacts(e);
	}
}

function renderAwaitFeedback(tasks) {
	let awaitFeedback = tasks.filter((t) => t['status'] == 'awaitFeedback');
	let awaitFeedbackDiv = document.getElementById('awaitFeedback');
	awaitFeedbackDiv.innerHTML = '';

	if (awaitFeedback.length == 0) {
		awaitFeedbackDiv.innerHTML = ` <div class="no-tasks">No Tasks To do</div> `;
	}
	for (let i = 0; i < awaitFeedback.length; i++) {
		const e = awaitFeedback[i];
		awaitFeedbackDiv.innerHTML += generateToDoHTML(e);
		displayCardAssignedContacts(e);
	}
}

function renderDone(tasks) {
	let done = tasks.filter((t) => t['status'] == 'done');
	let doneDiv = document.getElementById('done');
	doneDiv.innerHTML = '';

	if (done.length == 0) {
		doneDiv.innerHTML = ` <div class="no-tasks">No Tasks To do</div> `;
	}
	for (let i = 0; i < done.length; i++) {
		const e = done[i];
		doneDiv.innerHTML += generateToDoHTML(e);
		displayCardAssignedContacts(e);
	}
}
function generateToDoHTML(e) {
	let width = getCheckedSubTasks(e);
	let checked = getCheckedSubTasksLength(e);
	return /*HTML*/ `
    <div
      class="todo"
      draggable="true"
      ondragstart="startDragging(${e.taskID})"
      ondragend="stopDragging(${e.taskID})"
      onclick="openPopup(${e.taskID})"
    >
      <div class="todo-container">
        <div class="todo-type">${e.category}</div>
        <div class="todo-info">
          <span class="todo-title">${e.title}</span>
          <span class="todo-description">${e.description}</span>
        </div>
        <div class="progress">
          <div class="progress-container">
            <div class="progress-bar" style="width: ${width}%"></div>
          </div>
          <span class="subtask-container">${checked}/${e.subtasks.length} Subtasks</span>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%; ">	<div id="todo-assigned-container${e.taskID}" class="todo-assigned-container"></div>
    <div id="todo-prio-container${e.taskID}" class="todo-prip-container"></div>  </div>
	 
    <div class="todo-arrows">
          <button
            class="arrow-buttons"
            onclick="event.stopPropagation(); moveTask(${e.taskID}, 'up')"
          >
            ↑
          </button>
          <button
            class="arrow-buttons"
            onclick="event.stopPropagation(); moveTask(${e.taskID}, 'down')"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  `;
}

async function moveTask(taskID, direction) {
	const todo = todos.find((t) => t.taskID === taskID);
	let status = todo.status;

	// handle if "up" direction
	if (direction == 'up') {
		if (status === 'toDo') {
			return;
		} else if (status === 'inProgress') {
			todo.status = 'toDo';
		} else if (status === 'awaitFeedback') {
			todo.status = 'inProgress';
		} else if (status === 'done') {
			todo.status = 'awaitFeedback';
		}
	}

	// handle if "down" direction
	if (direction == 'down') {
		if (status === 'toDo') {
			todo.status = 'inProgress';
		} else if (status === 'inProgress') {
			todo.status = 'awaitFeedback';
		} else if (status === 'awaitFeedback') {
			todo.status = 'done';
		} else if (status === 'done') {
			
			return;
		}
	}

	for (let i = 0; i < todos.length; i++) {
		if (todos[i].taskID === todo.taskID) {
			todos[i] = todo;
		}
	}
	await saveToServer('tasks', todos);
	updateHTML();
}

function getCheckedSubTasks(task) {
	let len = task.subtasks.length;
	let checked = 0;
	let width = 0;
	for (let i = 0; i < task.subtasks.length; i++) {
		if (task.subtasks[i].state === 'checked') {
			checked++;
		}
	}
	width = checked / len;
	if(width == 1){
		return width + "00";
	}else{
		return (width + "0" )* 100
	}
	
}

function getCheckedSubTasksLength(task) {
	let checked = 0;
	for (let i = 0; i < task.subtasks.length; i++) {
		if (task.subtasks[i].state === 'checked') {
			checked++;
		}
	}
	return checked;
}

function displayCardAssignedContacts(task) {
	let foundContacts = [];

	const selectedContactDiv = document.getElementById(
		'todo-assigned-container' + task.taskID
	);
	selectedContactDiv.innerHTML = '';
	const selectedPrioDiv = document.getElementById(
		'todo-prio-container' + task.taskID
	);
	selectedPrioDiv.innerHTML = '';

	task.assignedTo.forEach((contactId) => {
		for (let i = 0; i < contacts.length; i++) {
			if (contacts[i].id == contactId) {
				foundContacts.push(contacts[i]);
			}
		}
	});

	for (let i = 0; i < foundContacts.length; i++) {
		let foundContact = foundContacts[i];

		selectedContactDiv.innerHTML += /*HTML*/ `
    <div class="todo-assignment-user-container">
  <div
    class="edit-assigned-user-container"
    style="background-color: ${foundContact.badgeColor}"
  >
    <div>${foundContact.initials}</div>
  </div>
</div>
   `;
	}
	displayCardPriority(task);
}
function displayCardPriority(task) {
	const selectedPrioDiv = document.getElementById(
		'todo-prio-container' + task.taskID
	);

	if (task.prio == 1) {
		selectedPrioDiv.innerHTML = /*HTML*/ `
    <img class="card-prio-img" src="../assets/img/add_task/urgent.svg" alt="">
  `;
	} else if (task.prio == 2) {
		selectedPrioDiv.innerHTML = /*HTML*/ `
    <img class="card-prio-img" src="../assets/img/add_task/medium.svg" alt="">
  `;
	} else if (task.prio == 3) {
		selectedPrioDiv.innerHTML = /*HTML*/ `
      <img class="card-prio-img" src="../assets/img/add_task/low.svg" alt="">
    `;
	}
}

function startDragging(id) {
	currentDraggedElement = id;
	window.currentlyDraggedElement = document.querySelector(
		`[ondragstart="startDragging(${id})"]`
	);
	if (window.currentlyDraggedElement) {
		window.currentlyDraggedElement.classList.add('rotated');
	}
}

function stopDragging() {
	if (window.currentlyDraggedElement) {
		window.currentlyDraggedElement.classList.remove('rotated');
		window.currentlyDraggedElement = null; // Reset the reference
	}
}

function openPopup(id) {
	const todo = todos.find((t) => t.taskID === id);

	let taskPopup = document.getElementById('todo-pop-up');
	taskPopup.classList.toggle('d-none');

	document.getElementById('popup-type').innerHTML = todo.category;
	document.getElementById('popup-title').innerHTML = todo.title;
	document.getElementById('popup-description').innerHTML = todo.description;
	document.getElementById('popup-due-date').innerHTML = todo.dueDate;
	displayPriority(todo);
	displayPopupAssignedContacts(todo);
	displaySubTasks(todo);

	document.getElementById('popup-buttons').innerHTML = /*HTML*/ `

	<div class="todo-pop-up-footer">
							<div class="buttonContainer">
								<div
									id="todo-delete-btn"
									class="todo-pop-up-button delete-edit-buttons"
									onclick="deleteTodo(${todo.taskID})"
								>
									<img src="../assets/img/board/delete.svg" />
									Delete
								</div>
								<img src="../assets/img/board/Vector 3.svg" />
								<div
									id="todo-edit-btn"
									class="todo-pop-up-button delete-edit-buttons"
									onclick="openEditPopup(${todo.taskID})"
								>
									<img src="../assets/img/board/edit.svg" />Edit
								</div>
							</div>
						</div>
	`;
}

function displayPriority(task) {
	let container = document.getElementById('popup-prio-container');
	let icon = document.getElementById('popup-prio-icon');

	if (task.prio == 1) {
		container.innerHTML = 'urgent';
		icon.innerHTML = /*HTML*/ `
    <img src="../assets/img/add_task/urgent.svg" alt="">
  `;
	} else if (task.prio == 2) {
		container.innerHTML = 'medium';
		icon.innerHTML = /*HTML*/ `
    <img src="../assets/img/add_task/medium.svg" alt="">
  `;
	} else if (task.prio == 3) {
		container.innerHTML = 'low';
		icon.innerHTML = /*HTML*/ `
      <img src="../assets/img/add_task/low.svg" alt="">
    `;
	}
}

function displaySubTasks(task) {
	let container = document.getElementById('todo-subtask-list-container');
	let foundSubTasks = [];
	let todo = task;
	container.innerHTML = '';

	if (task.subtasks.length > 0) {
		for (let i = 0; i < task['subtasks'].length; i++) {
			const element = task.subtasks[i];
			foundSubTasks.push(element);
		}
	}

	if (foundSubTasks.length > 0) {
		for (let i = 0; i < foundSubTasks.length; i++) {
			const subTask = foundSubTasks[i];

			let imgSrc = '../assets/img/board/unchecked.png';
			if (todo.subtasks[i].state === 'checked') {
				imgSrc = '../assets/img/board/checked.png';
			}

			container.innerHTML += /*HTML*/ `
   
      <ul class="fullSizeSubTasksContainer">
          <div class="flexNC fullSizeSubTask" id="fullSizeSubTask-0">
              <img onclick="changeCheckBox(${i}, ${todo.taskID})" src="${imgSrc}" value="1" alt="" id="subTaskImg-${i}" style="margin: 0px;">
              <p>${subTask.description}</p>
          </div>
          </ul>

    
     `;
		}
	}
}

async function changeCheckBox(id, todoID) {
	const todo = todos.find((t) => t.taskID === todoID);
	let img = document.getElementById('subTaskImg-' + id);
	if (img.value === undefined) {
		img.value = '1';
	}

	if (img.value == '1') {
		img.src = '../assets/img/board/checked.png';
		img.value = '2';
		todo.subtasks[id].state = 'checked';
	} else if (img.value == '2') {
		img.src = '../assets/img/board/unchecked.png';
		img.value = '1';
		todo.subtasks[id].state = 'unchecked';
	}
	for (let i = 0; i < todos.length; i++) {
		if (todos[i].taskID === todo.taskID) {
			todos[i] = todo;
		}
	}
	await saveToServer('tasks', todos);
	updateHTML();
}

function displayPopupAssignedContacts(task) {
	let foundContacts = [];

	const selectedContactDiv = document.getElementById(
		'todo-assignment-list-container'
	);
	selectedContactDiv.innerHTML = '';

	task.assignedTo.forEach((contactId) => {
		foundContacts.push(
			contacts.find((c) => String(c.id) === String(contactId))
		);
	});

	for (let i = 0; i < foundContacts.length; i++) {
		const foundContact = foundContacts[i];
		selectedContactDiv.innerHTML += /*HTML*/ `
    <div class="todo-assignment-user-container">
  <div
    class="edit-assigned-user-container"
    style="background-color: ${foundContact.badgeColor}"
  >
    <div>${foundContact.initials}</div>
  </div>
  <div class="todo-assigned-user-name-container">
  ${foundContact['first-name'] + ' ' + foundContact['last-name']} 
  </div>
</div>
   `;
	}
}

function closePopupCard(event) {
	let taskPopup = document.getElementById('todo-pop-up');

	if (taskPopup) {
		taskPopup.classList.toggle('d-none');

		updateHTML();
	}
}

function allowDrop(ev) {
	ev.preventDefault();
}

async function moveTo(status) {
	const todo = todos.find((t) => t.taskID === currentDraggedElement);


	todo.status = status;
	
	for (let i = 0; i < todos.length; i++) {
		if (todos[i].taskID === todo.taskID) {
			todos[i] = todo;
		}
	}

	await saveToServer('tasks', todos);

	updateHTML();
}

function highlight(event) {
	event.preventDefault();
	let target = event.target;
	let targetContainer = target;
	targetContainer.style.backgroundColor = 'white';
}

function removeHighlight(event) {

	let targetContainer = event.target;
	targetContainer.style.backgroundColor = '';
}

async function deleteTodo(id) {
	const index = todos.findIndex((t) => t.taskID === id);
	if (index !== -1) {
		todos.splice(index, 1);
		await saveToServer('tasks', todos);
		closePopupCard(event);
		updateHTML();
	} else {
		console.error(`Todo with ID ${id} not found!`);
	}
}

async function openEditPopup(id) {
	closePopupCard(event);
	const todo = todos.find((t) => t.taskID === id);
	let editPopup = document.getElementById('edit-task-popup-container');
	editPopup.classList.toggle('d-none');

	document.getElementById('edit-task-popup-container').innerHTML = /*HTML*/ `
	<div class="edit-container">
	<form class="edit-form" onsubmit="event.preventDefault(); ">
    <div class="edit-close-btn"><img class="edit-close-img" src="../assets/img/board/cancel.svg" alt="" onclick="closePopupEdit(event)"></div>
        <div class="edit-title-section">
            <label class="edit-label">Title</label>
            <input required="" type="text" class="edit-title-input" id="edit-title-input" placeholder="Enter a title" value="${todo.title}">

            <div class="edit-description-section">
			<label class="edit-label">Description</label>

                <textarea required="" type="text" class="edit-description-input" id="edit-description-input" placeholder="Enter a Description" spellcheck="false">${todo.description}</textarea>
				<div class="edit-date-section">
			<label class="edit-label">Due date</label>

                <input required="" type="date" value="${todo.dueDate}" class="edit-date-input" id="edit-date-input" placeholder="dd/mm/yy" min="2023-12-12">
	
			</div>
      <div class="input-container">
              <label class="add-task-label" for="add-task-assign"
                >Assigned to</label
              >
              <select
                class="select add-task-label-input"
                id="add-task-assign-select"
                onchange="getAssignedContacts('add-task-assign-select', 'add-task-selected-contact'); "
              >
                <option
                  value="Select contacts to assign"
                  disabled
                  selected
                  hidden
                >
                  Select contacts to assign
                </option>
              </select>
            </div>
            <div
              id="add-task-selected-contact"
              class="add-task-selected-contact"
            ></div>
            </div>
        </div>
            <div class="edit-prio-section">
                            <label class="edit-label">Prio</label>
                            <div class="edit-prio-btn-section">
                                <button id="add-task-prio-1" class="edit-btn" onclick="togglePrioButton(1)">
                                    <div class="edit-prio-btn-icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/add_task/urgent.svg" alt="High-Prio-Icon">
                                    </div>
                                </button>
                
                                <button id="add-task-prio-2" class="edit-btn" onclick="togglePrioButton(2)">
                                    <div class="edit-prio-btn-icon">
                                        <h6 >Medium</h6>
                                        <img src="../assets/img/add_task/medium.svg" alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                            
                                <button id="add-task-prio-3" class="edit-btn" onclick="togglePrioButton(3)">
                                    <div class="edit-prio-btn-icon">
                                        <h6>Low</h6>
                                        <img src="../assets/img/add_task/low.svg" alt="Low-Prio-Icon">
                                    </div>
                                </button>
                              
                            </div>
                        </div>
            <div class="edit-subtask-container">
                <div class="edit-subtask-position">
                    <input class="edit-subtask-input" type="text" id="edit-subtask-input" placeholder="Add new subtask">
                    <div class="edit-subtask-btn">
                        <img class="edit-subtask-img" src="../assets/img/board/add.svg" alt="" onclick="addSubtaskToBoard(); ">
                    </div>
				</div>
            </div>

                <ul id="edit-subtask-list" class="edit-subtask-list">
                    
                </ul>
           
       
    <div class="edit-fotter">
        <button type="button" onclick="saveEditedTask(${todo.taskID})" class="edit-footer-btn">
           Ok
            <img src="../assets/img/add_task/check.svg" alt="">
        </button>
    </div>
    </form>
	</div>

`;
	fillContactsToAssign(id);
	renderAssignToContacts('add-task-assign-select', contacts);
	displayAssignedContacts();
	renderEditSubTasks(id);

	renderHighlightedPrioBtn(id);
}

function renderHighlightedPrioBtn(id) {
	const task = todos.find((t) => t.taskID === id);

	selectButton(task.prio);
}

function renderEditSubTasks(id) {
	const task = todos.find((t) => t.taskID === id);

	let container = document.getElementById('edit-subtask-list');
	let foundSubTasks = [];

	container.innerHTML = '';

	if (task.subtasks.length > 0) {
		for (let i = 0; i < task['subtasks'].length; i++) {
			const element = task.subtasks[i];
			foundSubTasks.push(element);

		}
	}

	if (foundSubTasks.length > 0) {
		for (let i = 0; i < foundSubTasks.length; i++) {

			let subTask = foundSubTasks[i];
			container.innerHTML += /*HTML*/ `
   
   <li  class="subtask-container">
    <div class="subtask-text-container">
      <span>${subTask.description}</span>
    </div>
    <div class="subtask-button-container">
      <img src="../assets/img/contact/delete.svg" alt="Delete" class="subtask-button" onclick="deleteSubTaskPopup(${i}, ${id})">
    </div>
  </li> 
       

    
     `;
		}
	}
}


async function deleteSubTaskPopup(i, id){
	const task = todos.find((t) => t.taskID === id);
	 task.subtasks.splice(i, 1);

	for (let i = 0; i < todos.length; i++) {
		if (todos[i].taskID === task.taskID) {
			todos[i] = task;
		}
	}
	await saveToServer('tasks', todos);
	loadFromServer('tasks', todos);
	updateHTML();
	openPopup(id)
}

async function saveEditedTask(id) {
	const todo = todos.find((t) => t.taskID === id);

	todo.title = document.getElementById('edit-title-input').value;
	todo.description = document.getElementById('edit-description-input').value;
	todo.dueDate = document.getElementById('edit-date-input').value;
	let prio = getPrioFromEditPopup();
	todo.prio = prio;

	let subtasksTexts = getSubtasks();
	const subtasks = subtasksTexts.map((text, index) => ({
		description: text,
		state: todo.subtasks[index].state,
	  }));
	todo.subtasks = subtasks;

	todo.assignedTo =  getContactsIds();

	for (let i = 0; i < todos.length; i++) {
		if (todos[i].taskID === todo.taskID) {
			todos[i] = todo;
		}
	}
	todos[0].assignedTo = []
	await saveToServer('tasks', todos);
	updateHTML();
	closePopupEdit();
}

function getContactsIds(){
	let container = document.getElementById("add-task-selected-contact"); 
    let buttons = container.querySelectorAll(".logo-contacts"); 

    let contacts = []; 

    buttons.forEach(function(button) {
        let id = button.id; 
        let number = id.match(/\d+$/);
        if (number) {
            contacts.push(number[0]); 
        }
    });

    return contacts;
}

function getPrioFromEditPopup() {
	let btn1 = document.getElementById('add-task-prio-1');
	let btn2 = document.getElementById('add-task-prio-2');
	let btn3 = document.getElementById('add-task-prio-3');

	if (btn1.classList.contains('selected')) {
		return 1;
	} else if (btn2.classList.contains('selected')) {
		return 2;
	} else if (btn3.classList.contains('selected')) {
		return 3;
	}
}

function fillContactsToAssign(id) {
	const task = todos.find((t) => t.taskID == id);

	contactsToAssign;

	task.assignedTo.forEach((contactId) => {
		const foundContact = contacts.find(
			(contact) => String(contact.id) === String(contactId)
		);

		if (foundContact) {
			contactsToAssign.push(String(foundContact.id));
		}
	});
}

function closePopupEdit(event) {
	let taskPopup = document.getElementById('edit-task-popup-container');

	if (taskPopup) {
		taskPopup.classList.toggle('d-none');

		updateHTML();
		contactsToAssign = [];
	}
}
