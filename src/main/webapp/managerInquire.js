document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;
  fetchAllInquires();
});

function fetchAllInquires() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/inquiry/sortedInquiriesformanager";

  const options = {
    method: "GET",
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        inquireTable(data);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function inquireTable(data) {
  const tableBody = document.querySelector("#userTable tbody");
  // tableBody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");
    const tdinquireID = document.createElement("td");
    tdinquireID.textContent = row.inquireID;

    const tduserName = document.createElement("td");
    tduserName.textContent = row.userName;

    const tdinquireType = document.createElement("td");
    tdinquireType.textContent = row.inquireType;

    const tdinquireDescription = document.createElement("td");
    tdinquireDescription.textContent = row.inquireDescription;

    const tdinquireFeedback = document.createElement("td");
    tdinquireFeedback.textContent = row.inquireFeedback;

    const tdinquireReply = document.createElement("td");
    tdinquireReply.textContent = row.inquireReply;

    const tdinquireDate = document.createElement("td");
    tdinquireDate.textContent = row.inquireDate;

    tr.appendChild(tdinquireID);
    tr.appendChild(tduserName);
    tr.appendChild(tdinquireType);
    tr.appendChild(tdinquireDescription);
    tr.appendChild(tdinquireFeedback);
    tr.appendChild(tdinquireReply);
    tr.appendChild(tdinquireDate);

    tableBody.appendChild(tr);
  });
}

async function searchInquiry() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/inquiry/searchinquiry/";

  const inquiryid = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + inquiryid, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("txtSearchUsername").value = data.userName;
          document.getElementById("dplSearchInquireType").value =
            data.inquireType;
          document.getElementById("txtSearchDescription").value =
            data.inquireDescription;
          document.getElementById("txtSearchFeedback").value =
            data.inquireFeedback;
          document.getElementById("dplSearchReply").value = data.inquireReply;
          document.getElementById("txtSearchDate").value = data.inquireDate;
        } else {
          Swal.fire({
            icon: "error",
            title: "Unable to search inquiry. Please try again later.",
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

//Update Inquiry---------------------------------

async function inquryUpdate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/inquiry/updateinquiry/";

  const inquiryid = document.getElementById("txtEnter").value;

  const inquiry = {
    inquireID: inquiryid,
    userName: document.getElementById("txtSearchUsername").value,
    inquireType: document.getElementById("dplSearchInquireType").value,
    inquireDescription: document.getElementById("txtSearchDescription").value,
    inquireFeedback: document.getElementById("txtSearchFeedback").value,
    inquireReply: document.getElementById("dplSearchReply").value,
    inquireDate: document.getElementById("txtSearchDate").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(inquiry),
  };

  try {
    const response = await fetch(url + inquiryid, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Inquiry update successfully!",
      });

      window.location.href = "manageInquires.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update Inquiry. Please try again later.",
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

//Current Date function
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

//logout
document.getElementById("logout").addEventListener("click", () => {
  console.log("clicked");

  localStorage.removeItem("authToken");
  localStorage.removeItem("userName");
  localStorage.clear();
  window.location.href = "index.html";
});
