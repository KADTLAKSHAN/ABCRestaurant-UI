document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const url = `http://localhost:8080/ABCRestaurant/resources/reservations/findreservations/${userName}`;

  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch reservation data");
    }

    const reservations = await response.json();
    setReservationData(reservations);
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "index.html";
  }

  //add new reservation

  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const resID = await getGeneratedReservationID();

    const reservation = {
      reservationID: resID,
      reservationEmail: document.getElementById("reservationEmail").value,
      reservationDate: document.getElementById("reservationDate").value,
      reservationTime: document.getElementById("reservationTime").value,
      reservationPeople: document.getElementById("reservationPeople").value,
      userName: userName,
    };

    try {
      const addurl =
        "http://localhost:8080/ABCRestaurant/resources/reservations/makereservation/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservation),
      };

      const response = await fetch(addurl, options);

      if (!response.ok) {
        throw new Error("Failed to add reservation");
      }

      await Swal.fire({
        icon: "success",
        title: "Reservation added successfully!",
      });

      const reservationsResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!reservationsResponse.ok) {
        throw new Error("Failed to fetch updated reservations");
      }

      const reservations = await reservationsResponse.json();
      setReservationData(reservations);
    } catch (error) {
      console.error("Error adding reservation:", error);

      await Swal.fire({
        icon: "error",
        title: "Add Reservation Failed",
        text: "Unable to add reservation. Please try again later.",
      });
    }
  });

  //Add to values to table

  function setReservationData(reservations) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    reservations.forEach((reservation) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${reservation.reservationID}</td>
        <td>${reservation.reservationEmail}</td>
        <td>${reservation.reservationDate}</td>
        <td>${reservation.reservationTime}</td>
        <td>${reservation.reservationPeople}</td>
      `;

      tbody.appendChild(row);
    });
  }

  document.getElementById("logout").addEventListener("click", () => {
    console.log("clicked");

    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.clear();
    window.location.href = "index.html";
  });
});

// Generate reservation ID
async function getGeneratedReservationID() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/reservations/getGenerateID/";

  const userName = localStorage.getItem("userName");

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
