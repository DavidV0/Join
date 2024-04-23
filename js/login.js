let allUsersData = [];

// function toggle password von hidden to shown
function showPassword() {
  let password = document.getElementById("password-input");
  if (password.value.length > 1) {
    if (password.type == "password") {
      password.type = "text";
      document.getElementById("img-lock").src =
        "assets/img/login/visibility.svg";
    } else {
      password.type = "password";
      document.getElementById("img-lock").src =
        "assets/img/login/visibility_off.svg";
    }
  }
}

// function proofs if there is an input in the input field and then changes images
let pwInput = document.getElementById("password-input");
let lockImg = document.getElementById("img-lock");
pwInput.addEventListener("input", () => {
  if (pwInput.value.length > 0) {
    lockImg.src = "assets/img/login/visibility_off.svg";
  } else {
    lockImg.src = "assets/img/login/input-lock.svg";
  }
});

//function for loading
async function getItem(key) {
  const url = /*html*/ `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  const response = await fetch(url);
  if (response.ok) {
    let responseData = await response.json();
    allUsersData = JSON.parse(responseData.data.value);
  } else {
    console.error(
      "Failed to fetch data:",
      response.status,
      response.statusText
    );
  }
}

// function proofs if the name and password is right, then logging user in
async function logIn() {
  await getItem("users");
  let useremail = document.getElementById("email-input").value.toLowerCase();
  let userpassword = document.getElementById("password-input").value;
  saveCurrentUser(useremail, userpassword);
  if (isInDataBase()) {
    saveCurrentUserToLocalStorage(currentUser);
    window.location.href = "html/summary.html";
    allUsersData = "";
  } else {
    document.getElementById("wrong-password").style.display = "block";
    document.getElementById("password-input").style.borderColor = "red";
  }
}

//generate data for the current user
function saveCurrentUser(email, password) {
  currentUser = {
    email: email,
    password: password,
    name: "",
    initials: "",
  };
}

// proofs if the currentUser is in allUserData (has allready fullfilled sign-in)
function isInDataBase() {
  for (let index = 0; index < allUsersData.length; index++) {
    const userData = allUsersData[index];
    if (
      currentUser.password === userData["password"] &&
      currentUser.email === userData["email"]
    ) {
      currentUser.name = userData["name"];
      proofUserNameForInitials()    
      currentUser.password = "";
      return true;
    }
  }
}

// saves the current user to local storage if checkbox is checked. so he will be automatically fullfilled after site is refreshed
function saveCurrentUserToLocalStorage(currentUser) {
  if (document.getElementById('checkbox').checked) {
    localStorage.setItem("localSafedUser", JSON.stringify(currentUser));
  } else {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

// use the name (from sign-in) and check if it is one name or surname+name and then use the first character for the initials
function proofUserNameForInitials() {
  let spaceIndex = currentUser.name.indexOf(" ");
      if (spaceIndex !== -1) {
        let firstCharacter = currentUser.name.charAt(0).toUpperCase();
        let afterSpaceCharacter = currentUser.name.charAt(spaceIndex + 1).toUpperCase();
        currentUser.initials = firstCharacter + afterSpaceCharacter;
      } else {
        currentUser.initials = currentUser.name.charAt(0).toUpperCase();
      }
}


function guestLogIn() {
  currentUser = {
    "name":"Guest",
    "initials":"Guest",
  }
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "html/summary.html";
}


function signUp() {
  document.getElementById("log-in-container").style.display = "none";
  document.getElementById("sign-in-container").style.display = "flex";
  document.getElementById("sign-up-container").style.display = "none";
  setCursor();
}

//sets the cursor automatically on the first input field
function setCursor() {
  if (document.getElementById('email-input')) {
    document.getElementById('email-input').select();
  }if (document.getElementById('sign-in-name')){
    document.getElementById('sign-in-name').select();
  }
}

function initLogIn() {
    let currentUserToText = localStorage.getItem('localSafedUser');
    currentUser = JSON.parse(currentUserToText)
    if (!currentUser == "") {
      document.getElementById('email-input').value = currentUser.email;
      document.getElementById('checkbox').checked = true;
  }
}