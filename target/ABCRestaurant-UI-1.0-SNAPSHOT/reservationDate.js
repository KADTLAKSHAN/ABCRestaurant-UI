let userType = "";
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  userType = localStorage.getItem("userType");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;
  fetchAllDate();
});

function fetchAllDate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/getAllDisableDates";

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
    const tdDate = document.createElement("td");
    tdDate.textContent = row.date;

    const tdTime = document.createElement("td");
    tdTime.textContent = row.time;

    tr.appendChild(tdDate);
    tr.appendChild(tdTime);
    tableBody.appendChild(tr);
  });
}

//Add Reservation Date

async function AddReservationDate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/addDate";

  const dateobj = {
    date: document.getElementById("addDate").value,
    time: document.getElementById("ddladdTime").value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dateobj),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Date added successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "adminManageReservationDate.html";
      }

      if (userType == "Manager") {
        window.location.href = "manageReservationDates.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to add date. Please try again later.",
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

//Delete Reservation Date---------------------------------

async function deleteReservationDate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/deleteDate/";

  const date = document.getElementById("txtEnter").value;

  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url + date, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "date deleted successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "adminManageReservationDate.html";
      }

      if (userType == "Manager") {
        window.location.href = "manageReservationDates.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to delete date. Please try again later.",
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

//Search Reservation Date---------------------------------

async function searchReservationDate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/searchDate/";

  const date = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + date, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("dateSearchReservation").value = data.date;
          document.getElementById("dplSearchTime").value = data.time;
        } else {
          Swal.fire({
            icon: "error",
            title: "Unable to search date. Please try again later.",
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

//Update Reservation Date---------------------------------

async function updateReservationDate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/updateDate/";

  const date = document.getElementById("txtEnter").value;

  const dateobj = {
    date: date,
    time: document.getElementById("dplSearchTime").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(dateobj),
  };

  try {
    const response = await fetch(url + date, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Date update successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "adminManageReservationDate.html";
      }

      if (userType == "Manager") {
        window.location.href = "manageReservationDates.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update date. Please try again later.",
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
