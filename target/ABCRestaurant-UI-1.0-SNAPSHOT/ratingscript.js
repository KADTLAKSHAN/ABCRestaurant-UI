document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const url = `http://localhost:8080/ABCRestaurant/resources/rates/findrate/${userName}`;

  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch rate data");
    }

    const rates = await response.json();
    setRateData(rates);
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "index.html";
  }

  //add new reservation

  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const rate = {
      rateTitle: document.getElementById("ratingTitle").value,
      rateDescription: document.getElementById("ratingDescription").value,
      userName: userName,
    };

    try {
      const addurl =
        "http://localhost:8080/ABCRestaurant/resources/rates/addrate/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rate),
      };

      const response = await fetch(addurl, options);

      if (!response.ok) {
        throw new Error("Failed to add rate");
      }

      await Swal.fire({
        icon: "success",
        title: "Rate added successfully!",
      });

      const rateResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!rateResponse.ok) {
        throw new Error("Failed to fetch updated rate");
      }

      const rates = await rateResponse.json();
      setRateData(rates);
    } catch (error) {
      console.error("Error adding rate:", error);

      await Swal.fire({
        icon: "error",
        title: "Add Rate Failed",
        text: "Unable to add rate. Please try again later.",
      });
    }
  });

  //Add to values to table

  function setRateData(rates) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    rates.forEach((rate) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${rate.rateTitle}</td>
          <td>${rate.rateDescription}</td>
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
