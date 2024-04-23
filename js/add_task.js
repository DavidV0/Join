//relevante Variablen
let tasks = [];
let nextTaskID;
let prio = 2; //Urgent = 1, Medium = 2, Low = 3
let contactsToAssign = [];
const form = document.getElementById("add-task-form");

//relevante Daten initialisieren
async function initTasks() {
  await loadFromServer("contacts", contacts);
  await loadFromServer("tasks", tasks);
  await loadTaskIdFromServer('taskId');
  renderAssignToContacts("add-task-assign-select", contacts);
  setDefaultPriority(prio);
}



//Namen auslesen
function getTitle() {
  const titleInput = document.getElementById("add-task-title-input");
  return titleInput.value.trim();
}

//Description auslesen
function getDescription() {
  const descriptionInput = document.getElementById(
    "add-task-description-input"
  );
  return descriptionInput.value.trim();
}

//Kontakte rendern
function renderAssignToContacts(selectID, allContacts) {
  const selectElement = document.getElementById(selectID);
  const defaultOption = document.createElement("option");

  selectElement.innerHTML = "";
  defaultOption.text = "Select contacts to assign";
  selectElement.add(defaultOption);

  allContacts.forEach((contact) => {
    const option = document.createElement("option");

    option.value = String(contact.id);
    option.text = `${contact["first-name"]} ${contact["last-name"]}`;

    if (!contactsToAssign.includes(String(contact.id))) {
      selectElement.appendChild(option);
    }
  });
}

//Kontakte array zuweisen
function getAssignedContacts() {
  const selectElement = document.getElementById("add-task-assign-select");
  const selectedContactId = selectElement.value;

  if (
    selectedContactId !== "Select contacts to assign" &&
    !contactsToAssign.includes(selectedContactId)
  ) {
    contactsToAssign.push(selectedContactId);
    displayAssignedContacts();
    removeAssignedContactFromMenu(selectedContactId);
    renderAssignToContacts("add-task-assign-select", contacts);
  }
}

// Kontakt aus dem Dropdown-Menü entfernen und Standardwert wieder hinzufügen
function removeAssignedContactFromMenu(contactId) {
  const selectElement = document.getElementById("add-task-assign-select");
  const optionToRemove = selectElement.querySelector(`[value="${contactId}"]`);

  if (optionToRemove) {
    selectElement.removeChild(optionToRemove);
  }
}

//ausgewählte Kontakte anzeigen
function displayAssignedContacts() {
  const selectedContactDiv = document.getElementById(
    "add-task-selected-contact"
  );

  selectedContactDiv.innerHTML = "";

  contactsToAssign.forEach((contactId) => {
    const foundContact = contacts.find(
      (c) => String(c.id) === String(contactId)
    );

    const circleButton = document.createElement("button");
    circleButton.classList.add("logo-contacts");
    circleButton.id = `assigned-contact-${contactId}`;
    circleButton.setAttribute(
      "onclick",
      `deleteAssignedContacts('${contactId}')`
    );

    const backgroundColor = foundContact ? foundContact["badgeColor"] : "#fff";
    circleButton.style.backgroundColor = backgroundColor;
    circleButton.style.border = "2px solid #000";

    const initialsSpan = document.createElement("span");
    initialsSpan.innerText = getContactInitials(foundContact);
    circleButton.appendChild(initialsSpan);

    selectedContactDiv.appendChild(circleButton);
  });
}

function getContactInitials(contact) {
  if (!contact) return "";

  const firstName = contact["first-name"];
  const lastName = contact["last-name"];

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  } else if (firstName) {
    return firstName.charAt(0);
  } else if (lastName) {
    return lastName.charAt(0);
  } else {
    return "";
  }
}

//zuvor ausgewählte Kontakte wieder entfernen
function deleteAssignedContacts(contactId) {
  const indexToDelete = contactsToAssign.indexOf(String(contactId));

  if (indexToDelete !== -1) {
    contactsToAssign.splice(indexToDelete, 1);

    displayAssignedContacts();
    renderAssignToContacts("add-task-assign-select", contacts);
  }
}

//Datum auslesen
function getDueDate() {
  const dateInput = document.getElementById("add-task-date-input");
  const dueDate = dateInput.value;

  return dueDate;
}

//Prio festlegen
function setDefaultPriority(value) {
  prio = value;
  selectButton(prio);
}

//Prio-CSS manipullieren
function togglePrioButton(id) {
  const button = document.getElementById(`add-task-prio-${id}`);

  const currentPrio = prio;

  if (button.classList.contains("selected")) {
    deselectButton(currentPrio);
    prio = 0;
  } else {
    deselectButton(currentPrio);
    prio = id;
    selectButton(id);
  }
}

//Button aus/abwählen
function selectButton(id) {
  const button = document.getElementById(`add-task-prio-${id}`);
  if (button) {
    button.classList.add("selected");
    switchButton(button, id);
  }
}

function switchButton(button, id) {
  switch (id) {
    case 1:
      button.classList.add("urgent");
      button.classList.remove("medium", "low");
      break;
    case 2:
      button.classList.add("medium");
      button.classList.remove("urgent", "low");
      break;
    case 3:
      button.classList.add("low");
      button.classList.remove("urgent", "medium");
      break;
    default:
      break;
  }
}

function deselectButton(id) {
  const button = document.getElementById(`add-task-prio-${id}`);
  if (button) {
    button.classList.remove("selected", "urgent", "medium", "low");
  }
}

//Kategorie auswählen
function getSelectedCategory() {
  const categorySelect = document.getElementById("add-task-category-select");
  const selectedCategory = categorySelect.value;

  return selectedCategory;
}

//Subtasks
// Funktionen zum Hinzufügen eines Subtasks
function addSubtaskToBoard() {
  const subtaskInput = document.getElementById("edit-subtask-input");
  const subtaskList = document.getElementById("edit-subtask-list");

  if (subtaskInput.value.trim() !== "") {
    const subtaskText = subtaskInput.value.trim();
    const subtaskElement = createSubtaskElement(subtaskText);
    subtaskList.appendChild(subtaskElement);
    subtaskInput.value = "";
  }
}

function enableSubtaskEditing(subtaskElement) {
  subtaskElement.addEventListener("dblclick", function () {
    editSubtask(subtaskElement);
  });
}

function editSubtask(subtaskElement) {
  const subtaskTextSpan = subtaskElement.querySelector(
    ".subtask-text-container span"
  );
  const subtaskText = subtaskTextSpan.innerText;

  const editableSubtaskElement = createEditableSubtaskElement(subtaskText);
  subtaskElement.replaceWith(editableSubtaskElement);

  const inputField = editableSubtaskElement.querySelector("input");
  inputField.focus();
}

function createEditableSubtaskElement(subtaskText) {
  const subtaskElement = document.createElement("li");
  subtaskElement.classList.add("subtask-container", "editing");

  const textContainer = document.createElement("div");
  textContainer.classList.add("subtask-text-container");

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = subtaskText;
  inputField.setAttribute("data-original-text", subtaskText);

  textContainer.appendChild(inputField);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("subtask-button-container");

  const saveButton = createButton(
    "../assets/img/add_task/done.svg",
    "Save",
    function () {
      saveSubtask(subtaskElement);
    }
  );

  const cancelButton = createButton(
    "../assets/img/contact/delete.svg",
    "Cancel",
    function () {
      cancelEdit(subtaskElement);
    }
  );

  buttonContainer.appendChild(saveButton);
  buttonContainer.appendChild(cancelButton);

  subtaskElement.appendChild(textContainer);
  subtaskElement.appendChild(buttonContainer);

  return subtaskElement;
}

function cancelEdit(subtaskElement) {
  const originalSubtaskText = subtaskElement
    .querySelector("input")
    .getAttribute("data-original-text");
  const updatedSubtaskElement = createSubtaskElement(originalSubtaskText);
  subtaskElement.replaceWith(updatedSubtaskElement);
}

function saveSubtask(subtaskElement) {
  const inputField = subtaskElement.querySelector("input");
  const subtaskText = inputField.value;

  const updatedSubtaskElement = createSubtaskElement(subtaskText);
  subtaskElement.replaceWith(updatedSubtaskElement);
}

function createSubtaskElement(subtaskText) {
  const subtaskElement = document.createElement("li");
  subtaskElement.classList.add("subtask-container");

  const textContainer = document.createElement("div");
  textContainer.classList.add("subtask-text-container");

  const subtaskTextSpan = document.createElement("span");
  subtaskTextSpan.innerText = subtaskText;

  textContainer.appendChild(subtaskTextSpan);

  const buttonContainer = createButtonContainer(subtaskElement);

  subtaskElement.appendChild(textContainer);
  subtaskElement.appendChild(buttonContainer);

  enableSubtaskEditing(subtaskElement);

  return subtaskElement;
}

function createTextContainer(subtaskText) {
  const textContainer = document.createElement("div");
  textContainer.classList.add("subtask-text-container");

  const subtaskTextSpan = document.createElement("span");
  subtaskTextSpan.innerText = subtaskText;

  textContainer.appendChild(subtaskTextSpan);

  return textContainer;
}

function createButtonContainer(subtaskElement) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("subtask-button-container");

  const deleteButton = createButton(
    "../assets/img/contact/delete.svg",
    "Delete",
    function () {
      deleteSubtask(subtaskElement);
    }
  );

  const editButton = createButton(
    "../assets/img/contact/edit.svg",
    "Edit",
    function () {
      editSubtask(subtaskElement);
    }
  );

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  return buttonContainer;
}

function createButton(src, alt, clickHandler) {
  const button = document.createElement("img");
  button.src = src;
  button.alt = alt;
  button.classList.add("subtask-button");
  button.onclick = clickHandler;
  return button;
}

function getSubtasks() {
  const subtaskList = document.getElementById("edit-subtask-list");
  const subtaskItems = subtaskList.getElementsByTagName("li");

  const subtasks = [];

  for (let i = 0; i < subtaskItems.length; i++) {
    const subtaskText = subtaskItems[i]
      .querySelector("span")
      .textContent.trim();
    subtasks.push(subtaskText);
  }

  return subtasks;
}

// Funktion zum Löschen eines Subtasks
function deleteSubtask(subtaskElement) {
  const subtaskList = document.getElementById("edit-subtask-list");
  subtaskList.removeChild(subtaskElement);
}

//Task erschaffen
function checkRequirements() {
  document.getElementById("add-task-create-btn").disabled = true;
  /*if (!currentUser || currentUser.name === "Guest") {
    return false;
  }*/

  const title = getTitle();
  const dueDate = getDueDate();
  const category = getSelectedCategory();

  if (!title || !dueDate || !category) {
    return false;
  }

  document.getElementById("add-task-create-btn").disabled = false;
  return true;
}

function handleCreateTaskClick(status = "toDo") {
  let task = [];

  if (checkRequirements()) {
    task = createTask(status);
    addTaskToTasks(task);
  } else {
    alert("Please fill in the required information");
  }
}

function createTask(status) {
  const title = getTitle();
  const description = getDescription();
  const assignedTo = contactsToAssign;
  const dueDate = getDueDate();
  const category = getSelectedCategory();
  const subtasksTexts = getSubtasks();

  const subtasks = subtasksTexts.map((text) => ({
    description: text,
    state: "unchecked",
  }));

  const newTask = {
    taskID: nextTaskID,
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    prio: prio,
    category: category,
    status: status,
    subtasks: subtasks,
  };

  nextTaskID++;
  saveToServer('taskId', nextTaskID)
  return newTask;
}

function addTaskToTasks(newTask) {
  if (typeof todos === "undefined" || todos === null) {
    tasks.push(newTask);
  } else {
    todos.push(newTask);
  }

  saveToServer(
    "tasks",
    typeof todos === "undefined" || todos === null ? tasks : todos
  );
  resetForm();
}

//Form zurücksetzen
function resetForm() {
  const form = document.getElementById("add-task-form");

  if (form) {
    form.reset();
    setDefaultPriority();
    deselectButton(1);
    deselectButton(3);
    clearSubtasks();
    contactsToAssign = [];
    displayAssignedContacts();
  } else {
    console.error("Form element not found");
  }
}

function clearSubtasks() {
  const subtaskList = document.getElementById("edit-subtask-list");

  if (subtaskList) {
    subtaskList.innerHTML = "";
  }
}

function disableButton(id) {
  document.getElementById(id).disabled = true;
}
