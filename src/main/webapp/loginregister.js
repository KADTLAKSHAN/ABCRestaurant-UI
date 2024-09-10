document.querySelector("#user-btn").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("activepop");
});

//staf login popup
document
  .getElementById("btn-staff-login")
  .addEventListener("click", function () {
    document.querySelector(".staff-popup").classList.add("activepop");
  });
document
  .querySelector(".staff-popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".staff-popup").classList.remove("activepop");
  });

document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("activepop");
  });

document
  .querySelector("#user-register-link")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("activepop");
    document.querySelector(".register-popup").classList.add("activepop");
  });

document
  .querySelector(".register-popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".register-popup").classList.remove("activepop");
  });

function scrollToReservationSection() {
  document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
}

//staff login

async function staffLogin() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/userlogin";

  const userName = document.getElementById("txtStaffUserName").value;
  const userPassword = document.getElementById("txtStaffPassword").value;
  const userType = document.getElementById("user-role").value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userPassword, userType }),
  };

  const response = await fetch(url, options);

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userType", data.userType);

    if (userType == "Admin") {
      window.location.href = "adminDashboard.html";
    }

    if (userType == "Manager") {
      window.location.href = "managerDashboard.html";
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid username or password. Please try again.",
    });

    document.getElementById("txtLoginUserName").value = "";
    document.getElementById("txtLoginPassword").value = "";
  }
}

//Register Function

async function userRegister() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/users/customerregister/";

  const customer = {
    userName: document.getElementById("txtRegisterUserName").value,
    userFirstName: document.getElementById("txtFirstName").value,
    userLastName: document.getElementById("txtLastName").value,
    userEmail: document.getElementById("txtEmail").value,
    userAddress: document.getElementById("txtAddress").value,
    userAge: document.getElementById("txtAge").value,
    userPhoneNumber: document.getElementById("txtPhoneNumber").value,
    userPassword: document.getElementById("txtRegisterPassword").value,
    userType: "Customer",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Welcome to ABC Restaurant!",
        text: "Thank you for registering with us. We’re excited to have you join our community! You can now explore our menu, make reservations, and stay updated with our latest offers.",
      });

      document.getElementById("txtRegisterUserName").value = "";
      document.getElementById("txtFirstName").value = "";
      document.getElementById("txtLastName").value = "";
      document.getElementById("txtEmail").value = "";
      document.getElementById("txtAddress").value = "";
      document.getElementById("txtAge").value = "";
      document.getElementById("txtPhoneNumber").value = "";
      document.getElementById("txtRegisterPassword").value = "";

      document.querySelector(".register-popup").classList.remove("activepop");
      document.querySelector(".popup").classList.add("activepop");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again.",
    });
  }
}

async function userLogin() {
  const url = "http://localhost:8080/ABCRestaurant/resources/users/userlogin";

  const userName = document.getElementById("txtLoginUserName").value;
  const userPassword = document.getElementById("txtLoginPassword").value;
  const userType = "Customer";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userPassword, userType }),
  };

  const response = await fetch(url, options);

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userName", data.userName);

    window.location.href = `customerPanel.html?username=${encodeURIComponent(
      userName
    )}`;
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid username or password. Please try again.",
    });

    document.getElementById("txtLoginUserName").value = "";
    document.getElementById("txtLoginPassword").value = "";
  }
}

// Generate reservation ID
async function getGeneratedReservationID() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/getGenerateID/";

  const userName = document.getElementById("txtReservationUser").value;

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

//Payment

async function makePayment() {
  const resID = await getGeneratedReservationID();

  if (!resID) {
    return;
  }

  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/makepayment";

  const payment = {
    userName: document.getElementById("txtReservationUser").value,
    id: resID.generatedReservationID,
    cardNumber: document.getElementById("cardNumber").value,
    cardName: document.getElementById("cardName").value,
    expiryDate: document.getElementById("expiryDate").value,
    cvv: document.getElementById("cvv").value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payment),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      makeReservation(resID);
    } else {
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "We’re sorry, but there was an issue processing your payment. Please check the details you entered and try again. If the problem persists, you can contact us directly at (+94) 123-321-234 or abcrestuarnt@mail.com for assistance.",
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

//reservation

async function makeReservation(resID) {
  const id = await resID.generatedReservationID;

  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/makereservation";

  let date = document.getElementById("dateReservation").value;
  let time = document.getElementById("timeReservation").value;

  const reservation = {
    reservationID: id,
    userName: document.getElementById("txtReservationUser").value,
    reservationEmail: document.getElementById("txtReservationUserEmail").value,
    reservationDate: document.getElementById("dateReservation").value,
    reservationTime: document.getElementById("timeReservation").value,
    reservationPeople: document.getElementById("people").value,
  };

  const token = localStorage.getItem("authToken");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reservation),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Reservation Confirmed!",
        text: `Thank you for choosing ABC Restaurant. Your reservation has been successfully received and confirmed. We look forward to welcoming you on ${date} at ${time}.`,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Reservation Error",
        text: "We’re sorry, but there was an issue processing your reservation. Please check the details you entered and try again. If the problem persists, you can contact us directly at (+94) 123-321-234 or abcrestuarnt@mail.com for assistance.",
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

//Disable not available times and dates

async function fetchAvailableDateAndTimes() {
  try {
    const response = await fetch(
      "http://localhost:8080/ABCRestaurant/resources/reservations/getDisabledates"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching availability data:", error);
    return {};
  }
}

async function setupDateTimeInputs() {
  const disableDates = await fetchAvailableDateAndTimes();
  const dateInput = document.getElementById("dateReservation");
  const timeSelector = document.getElementById("timeReservation");

  //change format to YYYY MM DD
  const today = new Date().toISOString().split("T")[0];

  //disable dates before today
  dateInput.setAttribute("min", today);

  dateInput.addEventListener("change", (event) => {
    const selectedDate = event.target.value;

    // Check and disable times based on the selected date
    Array.from(timeSelector.options).forEach((option) => {
      const timeKey = `${selectedDate}:${option.value}`;
      option.disabled = disableDates[timeKey] === false;
    });

    // Reset time input if the selected time is disabled
    if (timeInput.options[timeInput.selectedIndex]?.disabled) {
      timeInput.value = "";
    }
  });

  // Disable dates with unavailable times
  Array.from(dateInput.options).forEach((option) => {
    const date = option.value;
    const dateUnavailable =
      disableDates[`${date}:10 AM`] === false &&
      disableDates[`${date}:1 PM`] === false;

    option.disabled = dateUnavailable;
  });

  // Initial setup to handle any preselected date
  const initialDate = dateInput.value;
  if (initialDate) {
    Array.from(timeSelector.options).forEach((option) => {
      const timeKey = `${initialDate}:${option.value}`;
      option.disabled = disableDates[timeKey] === false;
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupDateTimeInputs();
  const userName = localStorage.getItem("userName") || "";
  document.getElementById("txtReservationUser").value = userName;
});

// Get modal elements
const modal = document.getElementById("paymentModal");
const openModalBtn = document.getElementById("btnReservation");
const closeModalBtn = document.getElementById("closeModalBtn");

// Open modal
openModalBtn.onclick = function () {
  modal.style.display = "block";
};

// Close modal
closeModalBtn.onclick = function () {
  modal.style.display = "none";
};

// Close modal if user clicks outside of the modal
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
