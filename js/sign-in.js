// toggle the password from hint to show
function showSignInPassword() {
  let password = document.getElementById("sign-in-password-input");
  if (password.value.length > 1) {
    if (password.type == "password") {
      password.type = "text";
      document.getElementById("sign-in-img-lock").src =
        "./assets/img/login/visibility.svg";
    } else {
      password.type = "password";
      document.getElementById("sign-in-img-lock").src =
        "./assets/img/login/visibility_off.svg";
    }
  }
}
// toggle the confirm password from hint to show
function showConfirmPassword() {
  let password = document.getElementById("confirm-password-input");
  if (password.value.length > 1) {
    if (password.type == "password") {
      password.type = "text";
      document.getElementById("confirm-img-lock").src =
        "./assets/img/login/visibility.svg";
    } else {
      password.type = "password";
      document.getElementById("confirm-img-lock").src =
        "./assets/img/login/visibility_off.svg";
    }
  }
}
// changes the img from the lock to the eye
let signInPwInput = document.getElementById("sign-in-password-input");
let signInlockImg = document.getElementById("sign-in-img-lock");
signInPwInput.addEventListener("input", () => {
  if (signInPwInput.value.length > 0) {
    signInlockImg.src = "./assets/img/login/visibility_off.svg";
  } else {
    signInlockImg.src = "./assets/img/login/input-lock.svg";
  }
});

// changes the confirm img from the lock to the eye
let confirmPwInput = document.getElementById("confirm-password-input");
let confirmLockImg = document.getElementById("confirm-img-lock");
confirmPwInput.addEventListener("input", () => {
  if (confirmPwInput.value.length > 0) {
    confirmLockImg.src = "./assets/img/login/visibility_off.svg";
  } else {
    confirmLockImg.src = "./assets/img/login/input-lock.svg";
  }
});

// toggles the img of the checkbox img
function toggleButton() {
  let box = document.getElementById("accept-checkbox").checked;
  if (!box) {
    document.getElementById("sign-in-btn").style.display = "flex";
  } else {
    document.getElementById("sign-in-btn").style.display = "none";
  }
}

// closes the contact information card
function goBack() {
  document.getElementById("log-in-container").style.display = "flex";
  document.getElementById("sign-in-container").style.display = "none";
  document.getElementById("sign-up-container").style.display = "flex";
  setCursor()
}

// check if the password is right
let passwordCheck = document.getElementById("confirm-password-input");
passwordCheck.addEventListener("input", () => {
  if (
    document.getElementById("sign-in-password-input").value !=
    passwordCheck.value
  ) {
    document.getElementById("sign-in-password-match").style.opacity = 1;
    document.getElementById("confirm-password-input").style.borderColor = "red";
  } else {
    document.getElementById("sign-in-password-match").style.opacity = 0;
    document.getElementById("confirm-password-input").style.borderColor = "#d1d1d1";
  }
});

// functions for saving
async function saving() {
  let name = document.getElementById("sign-in-name").value;
  let email = document.getElementById("sign-in-email-input").value.toLowerCase();
  let password = document.getElementById("sign-in-password-input").value;
  await getItem("users");
  let userdata = {
    name: name,
    email: email,
    password: password,
  };
  if (checkForEmail(userdata)) {
    allUsersData.push(userdata);
    await setItem("users", allUsersData);
    setTimeout(() => {
      window.location.href ="index.html"
    },3000);
    document.getElementById("sign-up-successfully").style.opacity = 1;
    allUsersData = "";
    clearBoard();
  } else {
    document.getElementById("email-in-use").classList.add('fading-out');
    setTimeout(() => {
      document.getElementById("email-in-use").classList.remove('fading-out');
    }, 5000);
  }
}

// is used in saving. proofs if the user has an email for login
function checkForEmail(currentUser) {
    const allEmails = allUsersData.map(userData => userData['email']);
    return !allEmails.includes(currentUser.email);
  }

// save function 
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return await fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => response.json());
}

// clears the sign-in-form
function clearBoard() {
  document.getElementById("sign-in-name").value = "";
  document.getElementById("sign-in-email-input").value = "";
  document.getElementById("sign-in-password-input").value = "";
  document.getElementById("confirm-password-input").value = "";
  document.getElementById("sign-up-successfully").classList.add("fading-out");
  document.getElementById("sign-up-successfully").style.opacity = 0;
}


