let tasksForSummary = [];

async function initSummary() {
  await loadFromServer('tasks', tasksForSummary); 
  let toDo = tasksForSummary.filter((t) => t.status === 'toDo').length;
  let done = tasksForSummary.filter((t) => t.status === 'done').length;
  let inProgress = tasksForSummary.filter((t) => t.status === 'inProgress').length;
  let awaitFB = tasksForSummary.filter((t) => t.status === 'awaitFeedback').length;
  let urgent = tasksForSummary.filter((t) => t.prio === 1).length;
  let amountTasks = tasksForSummary.length;
  updateSummaryCointainer(toDo, done, inProgress, awaitFB, urgent,amountTasks);
}


function updateSummaryCointainer(toDo, done, inProgress, awaitFB, urgent,amountTasks){
  document.getElementById('amount-toDo').innerHTML = `${toDo}`
  document.getElementById('amount-done').innerHTML = `${done}`
  document.getElementById('bottom-middle-amount').innerHTML = `${inProgress}`
  document.getElementById('bottom-right-amount').innerHTML = `${awaitFB}`
  document.getElementById('urgent-amount').innerHTML = `${urgent}`
  document.getElementById('bottom-left-amount').innerHTML = `${amountTasks}`
}



const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function changeWhiteImage(id) {
  let image = document.getElementById(id);
  image.src = "../assets/img/summary/" + id + "-white.svg"; // Hier den Pfad zum zweiten Bild angeben
}

function changeBlackImage(id) {
  let image = document.getElementById(id);
  image.src = "../assets/img/summary/" + id + ".svg"; // Hier den Pfad zum zweiten Bild angeben
}

function changeTaskAmounts() {
  let urgentAmount = document.getElementById('urgent-amount');
  let calenderValue = document.getElementById('calender-value');
  let bottomLeftAmount = docuemnt.getElementById('bottom-right-amount');
  let bottomMiddleAmount = docuemnt.getElementById('bottom-middle-amount');
  let bottomRightAmount = docuemnt.getElementById('bottom-right-amount');
  //hier müssen noch die Pfade des Json eingetragen werden
  // zusätzlich muss noch geprüft werden ob bei urgent etwas vorhanden ist, wenn nicht, wird der container ausgeblendet
  
  urgentAmount.innerHTML = ""; 
  bottomLeftAmount.innerHTML = "";
  bottomMiddleAmount.innerHTML = "";
  bottomRightAmount.innerHTML = "";
}

function changeSalution() {
  let salution = document.getElementById('good-morning');
  let date = new Date();
  date = date.getHours();
  if (date >= 0 && date < 13) {
    salution.innerHTML = "Good morning"
  } else if (date >= 13 && date <= 19) {
    salution.innerHTML = "Good day"
  } else if (date >= 19 && date <= 24) {
    salution.innerHTML = "Good evening"
  }
}

function linkToAddTasks() {
  window.location.href = "board.html"
}



function generateDate() {
  const currentDate = new Date()
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;
  document.getElementById("calender-value").innerHTML = formattedDate;
}
