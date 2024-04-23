let contacts = [];

function init() {
  loadFromServer("contacts", contacts);
  loadTaskIdFromServer("taskId");
}

function addTaskPopUp(status) {
  let givenStatus = String(status);

  closePopupTask(event);
  document.getElementById("task-pop-up").innerHTML = /*HTML*/ `
    <div class="pop-up-overlay">
	<section class="add-task-content" id="add-task-content">
		<h3 class="add-task-head">Add Task</h3>
		<img src="../assets/img/board/cancel.svg" class="btn-close" onclick="closePopupTask(event)" alt="Close" />
		<form class="add-task-form" id="add-task-form">
			<div class="add-task-input">
				<div class="add-task-input-left">
					<div class="input-container">
						<label for="add-task-title-input" class="add-task-label">Title<span
								class="add-task-req-star">*</span></label>
						<input class="add-task-label-input" required onchange="checkRequirements()"
							id="add-task-title-input" placeholder="Enter a title" />
						<div class="add-task-required">
							<span id="add-task-required" class="d-none">This field is requiered</span>
						</div>
					</div>
					<div class="input-container">
						<label class="add-task-label" for="add-task-description-input">Description</label>
						<textarea class="add-task-label-input" id="add-task-description-input"
							placeholder="Enter a Description"></textarea>
					</div>
					<div class="input-container">
						<label class="add-task-label" for="add-task-assign-select">Assigned to</label>
						<select class="select add-task-label-input" id="add-task-assign-select"
							onchange="getAssignedContacts()">
							<option type="option" , value="Select contacts to assign" disabled selected hidden>
								Select contacts to assign
							</option>
						</select>
					</div>
					<div id="add-task-selected-contact" class="add-task-selected-contact"></div>
				</div>
				<div class="add-task-divider"></div>
				<div class="add-task-input-right">
					<div class="input-container">
						<label for="add-task-date-input">Due date<span class="add-task-req-star">*</span></label>
						<input class="add-task-label-input" required onchange="checkRequirements()"
							placeholder="dd/mm/yyyy" type="date" id="add-task-date-input" />
						<div class="add-task-required">
							<span id="add-task-required" class="d-none">This field is requiered</span>
						</div>
					</div>
					<div class="input-container">
						<label for="add-task-prio-1" class="add-task-label" >Prio</label>
						<div class="button-container" id="add-task-prio-input">
							<button class="white" id="add-task-prio-1" onclick="togglePrioButton(1)" type="button">
								Urgent<img src="../assets/img/add_task/urgent.svg" alt="" />
							</button>
							<button class="white medium" id="add-task-prio-2" onclick="togglePrioButton(2)"
								type="button">
								Medium<img src="../assets/img/add_task/medium.svg" alt="" />
							</button>
							<button class="white" id="add-task-prio-3" onclick="togglePrioButton(3)" type="button">
								Low<img src="../assets/img/add_task/low.svg" alt="" />
							</button>
						</div>
					</div>
					<div class="input-container">
						<label for="add-task-category-select" class="add-task-label">Category<span
								class="add-task-req-star">*</span></label>
						<select type="select" , class="select" id="add-task-category-select" required
							onchange="checkRequirements()">
							<option value="" disabled selected hidden type="option">
								Select task category
							</option>
							<option value="technicalTask">Technical Task</option>
							<option value="userStory">User Story</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div class="input-container">
						<label class="edit-subtask-label" for="edit-subtask-input">Subtasks</label>
						<div class="edit-subtask-position">
							<input class="edit-subtask-input" type="text" id="edit-subtask-input"
								placeholder="Add new subtask" />
							<div class="edit-subtask-btn">
								<img class="edit-subtask-img" src="../assets/img/board/add.svg" alt=""
									onclick="addSubtaskToBoard()" />
							</div>
						</div>
						<ul id="edit-subtask-list" class="edit-subtask-list"></ul>
					</div>
				</div>
			</div>
			<div class="add-task-footer">
				<div class="add-class-legend">
					<div>
						<span class="add-task-req-star">*</span> This field is required
					</div>
					<div>
						<span class="add-task-req-star">*</span> Can't create tasks as
						guest
					</div>
				</div>
				<div class="add-task-create-task">
					<button class="add-task-kill-all-input-btn" type="button"
						onclick="disableButton('add-task-create-btn'); resetForm()">
						Clear
						<img src="../assets/img/add_task/cancel.svg" />
					</button>
					<button id="add-task-create-btn" class="add-task-create-btn"
						onclick="handleCreateTaskClick('${givenStatus}'); updateBoard()" disabled>
						Create Task<img src="../assets/img/add_task/check.svg" alt="" />
					</button>
				</div>
			</div>
		</form>
	</section>
</div>
</div>
  `;

  renderAssignToContacts("add-task-assign-select", contacts);
}

function closePopupTask(event) {
  let taskPopup = document.getElementById("task-pop-up");

  if (taskPopup) {
    taskPopup.classList.toggle("d-none");

    updateHTML();
  }
}
