let colorsForBadge = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FC7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];
let contactId = 0;
let contacts = [];
let currenthighlighted = 0;

// function for adding a new contact
async function addNewContact() {
  document.body.classList.add("scrollable");
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone-number").value;
  let newContact = {
    "first-name": firstName.charAt(0).toUpperCase() + firstName.slice(1),
    "last-name": lastName.charAt(0).toUpperCase() + lastName.slice(1),
    email: email,
    phone: phone,
    badgeColor: createBadge(),
    initials: formatName(firstName, lastName),
    id: contactId,
  };
  contacts.push(newContact);
  contactId++;
  renderContact(contacts);
  saveToServer("contactId", contactId);
  saveToServer("contacts", contacts);
  contactCreateSuccess();
  cancelContactCreation();
}

// save the new user to server
async function saveToServer(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return await fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => response.json());
}

//open the contact information from the contact of the contact list
function showAddContact() {
  document.body.classList.add("scrollable");
  document.getElementById("add-contact").style.display = "flex";
  document.getElementById("contact-overlay").style.display = "block";
  setCursor();
}

// function for setting the curser in the input field
function setCursor() {
  document.getElementById("first-name").select();
}

//creates a badge-color randomly for the contact
function createBadge() {
  let number = Math.floor(Math.random() * colorsForBadge.length);
  let randomBadge = colorsForBadge[number];
  return randomBadge;
}

//format the name for contacts
function formatName(firstName, lastName) {
  let firstNameFirstLetter = firstName.charAt(0).toUpperCase();
  let lastNameLetter = lastName.charAt(0).toUpperCase();
  return firstNameFirstLetter + lastNameLetter;
}

function cancelContactCreation() {
  clearAdd();
  document.body.classList.remove("scrollable");
  document.getElementById("add-contact").style.display = "none";
  document.getElementById("contact-overlay").style.display = "none";
  if (document.getElementById("single-content-container-box")) {
    document.getElementById("single-content-container-box").style.display =
      "flex";
  }
}

async function deleteContact(i) {
  contacts.splice(i, 1);
  document.getElementById("single-contact-information").style.display = "none";
  saveToServer("contacts", contacts);
  renderContact(contacts);
  document.getElementById("edit-contact").style.display = "none";
  document.getElementById("contact-overlay").style.display = "none";
}

function editContact(z) {
  document.body.classList.add("scrollable");
  renderEditContainer(z);
  document.getElementById("single-content-container-box").style.display =
    "none";
  document.getElementById("edit-contact").style.display = "flex";
  document.getElementById("contact-overlay").style.display = "block";
  document.getElementById(
    "edit-first-name"
  ).value = `${contacts[z]["first-name"]}`;
  document.getElementById(
    "edit-last-name"
  ).value = `${contacts[z]["last-name"]}`;
  document.getElementById("edit-email").value = `${contacts[z]["email"]}`;
  document.getElementById(
    "edit-phone-number"
  ).value = `${contacts[z]["phone"]}`;
  document.getElementById(
    "edit-contact-logo"
  ).style.backgroundColor = `${contacts[z]["badgeColor"]}`;
  document.getElementById(
    "edit-initials"
  ).innerHTML = `${contacts[z]["initials"]}`;
}

function saveNewContactInformation(i) {
  contacts[i]["first-name"] = document.getElementById("edit-first-name").value;
  contacts[i]["last-name"] = document.getElementById("edit-last-name").value;
  contacts[i]["email"] = document.getElementById("edit-email").value;
  contacts[i]["phone"] = document.getElementById("edit-phone-number").value;
  renderContact(contacts);
  saveToServer("contacts", contacts);
  closeEditOverlay();
  document.getElementById("single-contact-information").style.display = "none";
}

function closeEditOverlay() {
  document.getElementById("edit-contact").style.display = "none";
  document.getElementById("contact-overlay").style.display = "none";
  document.body.classList.remove("scrollable");
}

function renderEditContainer(i) {
  document.getElementById("edit-contact").innerHTML = /*html*/ `
    <div class="contact-container-left-side">
                    <div>
                        <img src="../assets/img/contact/Capa 2.svg" id="image3">
                    </div>
                    <span >Edit contact</span>
                    <div>
                        <img src="../assets/img/contact/Vector 5.svg" id="image4">
                    </div>
                </div>
                <div class="contact-container-right-side">
                    <div>
                        <div class="contact-logo" id="edit-contact-logo">
                            <span id="edit-initials"></span>
                        </div>
                    </div>

                    <div> 
                        <form onsubmit="saveNewContactInformation(${i}); return false">
                            <div class="contact-input-fields">
                                <span onclick="closeEditOverlay()" style="font-size: 40px; font-weight:bold; z-index:999;">X</span>
                                <input type="text" required placeholder="First Name" id="edit-first-name">
                                <input type="text" required placeholder="Last Name" id="edit-last-name">
                                <input type="email" required placeholder="Email" id="edit-email">
                                <input type="tel" required placeholder="Phone" pattern="[0-9]+" title="Please enter only digits in the following Format XXXXX/XXXXX" id="edit-phone-number">
                            </div>
                            <div class="contact-button-fields">
                                <button id="delete-btn" onclick="deleteContact(${i})">Delete</button>
                                <button id="save-btn">Save contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    `;
}

function sortContactsByFirstName() {
  contacts.sort((a, b) => a["first-name"].localeCompare(b["first-name"]));
}

function renderContact(contacts) {
  sortContactsByFirstName();
  const sortedData = {};

  for (let i = 0; i < contacts.length; i++) {
    const contactName = contacts[i]["first-name"];
    const letter = contactName[0].toUpperCase();
    if (!sortedData[letter]) {
      sortedData[letter] = [];
    }
    sortedData[letter].push(contacts[i]);
  }
  renderLetterDiv(sortedData);
}

function renderLetterDiv(sortedData) {
  document.getElementById("contacts-overview").innerHTML = "";
  for (let key in sortedData) {
    let letter = key;
    let contactsInLetters = sortedData[key];
    document.getElementById("contacts-overview").innerHTML += /*html*/ `
        <div class="contact-container" id="contact-container">
            <span> ${letter} </span>
            <img class="contact-container-img" src="../assets/img/contact/Vector 10.svg">
            <div id="contact-elements-${letter}"></div>
        </div>
        `;
    renderContactDiv(contactsInLetters, letter);
  }
}

function renderContactDiv(contactsInLetters, letter) {
  for (let i = 0; i < contactsInLetters.length; i++) {
    document.getElementById(
      `contact-elements-${letter}`
    ).innerHTML += /*html*/ `
            <div class="contact-box" id="${contactsInLetters[i]["id"]}" onclick="openContact(${contactsInLetters[i]["id"]})">
            <div class="logo-contacts" style="background-color: ${contactsInLetters[i]["badgeColor"]}">
                <span>${contactsInLetters[i]["initials"]}</span>
            </div>
            <div class="contact-names">
                <div>${contactsInLetters[i]["first-name"]} ${contactsInLetters[i]["last-name"]}</div>
                <a href="#">${contactsInLetters[i]["email"]}</a>
            </div>
        </div>    
        `;
  }
}
// render function for the contact information overlay
function openContact(i) {
  document.getElementById("add-contact-mobile").classList.add("d-none");
  document.body.classList.add("scrollable");
  document.getElementById("single-contact").style.display = "flex";
  document.getElementById("single-contact-information").style.display = "flex";
  for (let z = 0; z < contacts.length; z++) {
    let user = contacts[z];
    if (user["id"] === i) {
      document.getElementById(
        `single-contact-information`
      ).innerHTML = /*html*/ `
            <div class="single-content-container-box single-content-container-box-mobile" id="single-content-container-box">
                <div class="container-head">
                    <div class="single-container-logo" style="background-color: ${user["badgeColor"]}">
                        <span>${user["initials"]}</span>
                    </div>
                    <div>
                        <div class="single-container-name">${user["first-name"]} ${user["last-name"]}</div>
                        <div class="single-container-tools">
                            <div class="single-edit" onclick="editContact(${z})">
                                <img src="../assets/img/contact/edit.svg">
                                <span>edit</span>
                            </div>
                            <div class="single-delete" onclick="deleteContact(${z})">
                                <img src="../assets/img/contact/delete.svg">
                                <span>delete</span>
                            </div>
                            <div id="edit-menu-mobile" onclick="back()"><img src="../assets/img/contact/arrow-left-line.svg"></div>
                            <div class="headline-none" >
                                <span>Contacts</span>
                                <img src="../assets/img/contact/Vector 5.svg">
                                <span>Better with a team</span>
                            </div>
                  
                            <div id="mobile-edit-container">
                               <div>
                                  <img src="../assets/img/contact/edit.svg" onclick="editContact(${z})">
                                  <span>Edit</span>
                                </div>
                                <div>
                                  <img src="../assets/img/contact/delete.svg" onclick="deleteContact(${z})">
                                  <span>Delete</span>
                                </div>
                              </div>
                        </div>
                    </div>
                </div>
                <div class="contact-informations">
                    <span class="single-contact-contact-information">Contact Information</span>
                    <span class="single-contact-email">Email</span>
                    <a href="mailto:${user["email"]}">${user["email"]}</a>
                    <span class="single-contact-contact-phone">Phone</span>
                    <a href="tel:${user["phone"]}">${user["phone"]}</a>
                </div>
        </div>
      `;
      removeCurrentHighlighted();
      highlightContact(i);
    }
  }
}

//highligts contact in contact-list
async function highlightContact(i) {
  currenthighlighted = i;
  const contactBox = document.getElementById(i);
  contactBox.classList.add("selected");
}

async function removeCurrentHighlighted() {
  if (currenthighlighted > 0) {
    const contactBox = document.getElementById(currenthighlighted);
    try {
      contactBox.classList.remove("selected");
    } catch {}
  }
}

async function initContacts() {
  await loadFromServer("contacts", contacts);
  await loadIdFromServer("contactId");
  renderContact(contacts);
}

//clears the add overlay
function clearAdd() {
  document.getElementById("first-name").value = "";
  document.getElementById("last-name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone-number").value = "";
}

//shows a create field if a new contact is created
function contactCreateSuccess() {
  let contactCreate = document.getElementById("contact-create-success");
  contactCreate.classList.add("fading-out");
  setTimeout(() => {
    contactCreate.classList.remove("fading-out");
  }, "3000");
}

function back() {
  document.getElementById("add-contact-mobile").classList.remove("d-none");
  let element = document.getElementById("single-content-container-box");
  document.getElementById("single-contact").style.display = "none";
  document.body.classList.remove("scrollable");
  element.style.display = "none";
}
