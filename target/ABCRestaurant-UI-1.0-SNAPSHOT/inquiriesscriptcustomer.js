document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const url = `http://localhost:8080/ABCRestaurant/resources/inquiry/findinquiry/${userName}`;

  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch inquiry data");
    }

    const inquiries = await response.json();
    setInquiriesData(inquiries);
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "index.html";
  }

  //add new reservation

  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentDate = getCurrentDate();

    const inquiry = {
      inquireType: document.getElementById("inquireType").value,
      inquireDescription: document.getElementById("inquireDescription").value,
      inquireReply: "No",
      inquireDate: currentDate,
      userName: userName,
    };

    try {
      const addurl =
        "http://localhost:8080/ABCRestaurant/resources/inquiry/addinquiry/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inquiry),
      };

      const response = await fetch(addurl, options);

      if (!response.ok) {
        throw new Error("Failed to add inquiry");
      }

      await Swal.fire({
        icon: "success",
        title: "inquiry added successfully!",
      });

      const inquiriesResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!inquiriesResponse.ok) {
        throw new Error("Failed to fetch updated inquiry");
      }

      const inquiries = await inquiriesResponse.json();
      setInquiriesData(inquiries);
    } catch (error) {
      console.error("Error adding inquiry:", error);

      await Swal.fire({
        icon: "error",
        title: "Add inquiry Failed",
        text: "Unable to add inquiry. Please try again later.",
      });
    }
  });

  //Add to values to table

  function setInquiriesData(inquiries) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    inquiries.forEach((inquiry) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${inquiry.inquireID}</td>
          <td>${inquiry.userName}</td>
          <td>${inquiry.inquireType}</td>
          <td>${inquiry.inquireDescription}</td>
          <td>${inquiry.inquireFeedback}</td>
          <td>${inquiry.inquireReply}</td>
          <td>${inquiry.inquireDate}</td>
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

  //Current Date function
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
});
