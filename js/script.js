const STORAGE_TOKEN = "L7BJUS4H2WWHL5T7UPQJMLVPWOMQIJS3HDQN0S44";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
let currentUser;

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  if (typeof callback === "function") {
    callback();
  }
}

function openMenu(event) {
  // remove class from the menu
  let submenu = document.getElementById("submenu");
  if (submenu) {
    submenu.classList.toggle("d-none");
    event.stopPropagation();
    document.documentElement.addEventListener("click", closeMenuOnBodyClick);
  }
}

function closeMenu() {
  // add class to the menu to make it hidden
  document.getElementById("submenu").classList.add("d-none");
  // add event listener to the html element
  document.documentElement.removeEventListener("click", closeMenuOnBodyClick);
}

function closeMenuOnBodyClick(event) {
  // get the event path
  const path = event.composedPath();
  // check if it has the menu element
  if (path.some((elem) => elem.id === "submenu")) {
    // terminate this function if it does
    return;
  }
  closeMenu();
}

async function saveToServer(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return await fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => response.json());
}

async function loadFromServer(key, placeToSave) {
  const url = /*html*/ `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  if (response.ok) {
    let responseData = await response.json();
    Object.assign(placeToSave, JSON.parse(responseData.data.value));
  } else {
    console.error(
      "Failed to fetch data:",
      response.status,
      response.statusText
    );
  }
}

async function loadIdFromServer(key) {
  const url = /*html*/ `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  if (response.ok) {
    let responseData = await response.json();
    contactId = JSON.parse(responseData.data.value);
  } else {
    console.error(
      "Failed to fetch data:",
      response.status,
      response.statusText
    );
  }
}

async function loadTaskIdFromServer(key) {
  const url = /*html*/ `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  if (response.ok) {
    let responseData = await response.json();
    nextTaskID = JSON.parse(responseData.data.value);
  } else {
    console.error(
      "Failed to fetch data:",
      response.status,
      response.statusText
    );
  }
}

function loadCurrentUser() {
  let currentUserToText = localStorage.getItem("currentUser");
  currentUser = JSON.parse(currentUserToText);
  if (!currentUser == "") {
    if (document.getElementById("display-user")) {
      document.getElementById("display-user").innerHTML = currentUser.name;
    }
    setTimeout(() => {
      changeCredential();
    }, 500);
  }
}

function changeCredential() {
  let credential = document.getElementById("user-credentials");
  let mobileCredential = document.getElementById("mobile-credential");
  credential.innerHTML = `<span>${currentUser.initials}</span>`;
  mobileCredential.innerHTML = `<span style="font-size:10px; display:flex;">${currentUser.initials}</span>`;
}


