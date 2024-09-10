//Admin Table

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  const userType = localStorage.getItem("userType");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;

  fetchAllUsers();
});

function fetchAllUsers() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users";

  const options = {
    method: "GET",
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        userTable(data);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function userTable(data) {
  const tableBody = document.querySelector("#userTable tbody");
  // tableBody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");
    const tdUsername = document.createElement("td");
    tdUsername.textContent = row.userName;

    const tdFirstname = document.createElement("td");
    tdFirstname.textContent = row.userFirstName;

    const tdLastname = document.createElement("td");
    tdLastname.textContent = row.userLastName;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = row.userEmail;

    const tdAddress = document.createElement("td");
    tdAddress.textContent = row.userAddress;

    const tdAge = document.createElement("td");
    tdAge.textContent = row.userAge;

    const tdPhoneNumber = document.createElement("td");
    tdPhoneNumber.textContent = row.userPhoneNumber;

    const tdPassword = document.createElement("td");
    tdPassword.textContent = row.userPassword;

    const tdUserType = document.createElement("td");
    tdUserType.textContent = row.userType;

    tr.appendChild(tdUsername);
    tr.appendChild(tdFirstname);
    tr.appendChild(tdLastname);
    tr.appendChild(tdEmail);
    tr.appendChild(tdAddress);
    tr.appendChild(tdAge);
    tr.appendChild(tdPhoneNumber);
    tr.appendChild(tdPassword);
    tr.appendChild(tdUserType);
    tableBody.appendChild(tr);
  });
}

//Add User---------------------------------

async function AddUser() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/adduser/";

  const user = {
    userName: document.getElementById("addtxtUserName").value,
    userFirstName: document.getElementById("addtxtFirstName").value,
    userLastName: document.getElementById("addtxtLastName").value,
    userEmail: document.getElementById("addtxtEmail").value,
    userAddress: document.getElementById("addtxtAddress").value,
    userAge: document.getElementById("addtxtAge").value,
    userPhoneNumber: document.getElementById("addtxtPhoneNumber").value,
    userPassword: document.getElementById("addtxtPassword").value,
    userType: document.getElementById("dpaddlUserType").value,
  };

  console.log(user);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "User added successfully!",
      });

      window.location.href = "adminDashboard.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to add user. Please try again later.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again." + error,
    });
  }
}

//Delete User---------------------------------

async function deleteUser() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/deleteuser/";

  const userName = document.getElementById("txtEnter").value;

  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url + userName, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "User deleted successfully!",
      });
      window.location.href = "adminDashboard.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to delete user. Please try again later.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again." + error,
    });
  }
}

async function searchUser() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/searchuser/";

  const userName = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + userName, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("txtSearchFirstName").value =
            data.userFirstName;
          document.getElementById("txtSearchLastName").value =
            data.userLastName;
          document.getElementById("txtSearchEmail").value = data.userEmail;
          document.getElementById("txtSearchAddress").value = data.userAddress;
          document.getElementById("txtSearchAge").value = data.userAge;
          document.getElementById("txtSearchPassword").value =
            data.userPassword;
          document.getElementById("txtSearchPhoneNumber").value =
            data.userPhoneNumber;
          document.getElementById("dplSearchUserType").value = data.userType;
        } else {
          Swal.fire({
            icon: "error",
            title: "Unable to search user. Please try again later.",
          });
        }
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again." + error,
    });
  }
}

//Update User---------------------------------

async function userUpdate() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/updateuser/";

  const userName = document.getElementById("txtEnter").value;

  const user = {
    userName: userName,
    userFirstName: document.getElementById("txtSearchFirstName").value,
    userLastName: document.getElementById("txtSearchLastName").value,
    userEmail: document.getElementById("txtSearchEmail").value,
    userAddress: document.getElementById("txtSearchAddress").value,
    userAge: document.getElementById("txtSearchAge").value,
    userPhoneNumber: document.getElementById("txtSearchPhoneNumber").value,
    userPassword: document.getElementById("txtSearchPassword").value,
    userType: document.getElementById("dplSearchUserType").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(user),
  };

  try {
    const response = await fetch(url + userName, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "User update successfully!",
      });

      window.location.href = "adminDashboard.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update user. Please try again later.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again." + error,
    });
  }
}

//Hide search/update

function myFunction() {
  var x = document.getElementById("formrHide");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }

  console.log("clicked!");
}

//logout
document.getElementById("logout").addEventListener("click", () => {
  console.log("clicked");

  localStorage.removeItem("authToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("userType");
  localStorage.clear();
  window.location.href = "index.html";
});
