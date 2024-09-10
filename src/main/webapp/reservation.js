let userType = "";
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  userType = localStorage.getItem("userType");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;
  fetchAllReservation();
});

function fetchAllReservation() {
  const url = "http://localhost:8080/ABCRestaurant/resources/reservations";

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
    const tdReservationID = document.createElement("td");
    tdReservationID.textContent = row.reservationID;

    const tdreservationEmail = document.createElement("td");
    tdreservationEmail.textContent = row.reservationEmail;

    const tdreservationDate = document.createElement("td");
    tdreservationDate.textContent = row.reservationDate;

    const tdreservationTime = document.createElement("td");
    tdreservationTime.textContent = row.reservationTime;

    const tdreservationPeople = document.createElement("td");
    tdreservationPeople.textContent = row.reservationPeople;

    const tduserName = document.createElement("td");
    tduserName.textContent = row.userName;

    tr.appendChild(tdReservationID);
    tr.appendChild(tdreservationEmail);
    tr.appendChild(tdreservationDate);
    tr.appendChild(tdreservationTime);
    tr.appendChild(tdreservationPeople);
    tr.appendChild(tduserName);
    tableBody.appendChild(tr);
  });
}

// Generate reservation ID
async function getGeneratedReservationID() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/getGenerateID/";

  const userName = document.getElementById("addtxtUsernamer").value;

  try {
    const response = await fetch(url + encodeURIComponent(userName));
    const data = await response.json();

    const id = data;
    return id;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again. " + error,
    });
    return null;
  }
}

//Add Reservation

async function AddReservation() {
  const resID = await getGeneratedReservationID();

  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/makereservation/";

  const reservation = {
    reservationID: resID,
    reservationEmail: document.getElementById("addtxtEmail").value,
    reservationDate: document.getElementById("addDate").value,
    reservationTime: document.getElementById("dpladdTime").value,
    reservationPeople: document.getElementById("dpladdPeople").value,
    userName: document.getElementById("addtxtUsernamer").value,
  };

  console.log(reservation);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservation),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Reservation added successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "manageReservation.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerDashboard.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to add reservation. Please try again later.",
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

//Delete Reservation---------------------------------

async function deleteReservation() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/deletereservations/";

  const reservationID = document.getElementById("txtEnter").value;

  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url + reservationID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Reservation deleted successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "manageReservation.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerDashboard.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to delete reservation. Please try again later.",
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

//Search Reservation---------------------------------

async function searchReservation() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/searchreservation/";

  const reservationID = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + reservationID, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("txtSearchEmail").value =
            data.reservationEmail;
          document.getElementById("dateSearchReservation").value =
            data.reservationDate;
          document.getElementById("dplSearchPeople").value =
            data.reservationPeople;
          document.getElementById("dplSearchTime").value = data.reservationTime;
          document.getElementById("txtSearchUsername").value = data.userName;
        } else {
          Swal.fire({
            icon: "error",
            title: "Unable to search reservation. Please try again later.",
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

//Update Reservation---------------------------------

async function updateReservation() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/updatereservation/";

  const reservationID = document.getElementById("txtEnter").value;

  const reservation = {
    reservationID: reservationID,
    reservationEmail: document.getElementById("txtSearchEmail").value,
    reservationDate: document.getElementById("dateSearchReservation").value,
    reservationTime: document.getElementById("dplSearchTime").value,
    reservationPeople: document.getElementById("dplSearchPeople").value,
    userName: document.getElementById("txtSearchUsername").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(reservation),
  };

  try {
    const response = await fetch(url + reservationID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Reservation update successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "manageReservation.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerDashboard.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update reservation. Please try again later.",
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
