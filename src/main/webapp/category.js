document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;

  fetchAllCategory();
});

function fetchAllCategory() {
  const url = "http://localhost:8080/ABCRestaurant/resources/category";

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
    const tdcategoryID = document.createElement("td");
    tdcategoryID.textContent = row.categoryID;

    const tdcategoryName = document.createElement("td");
    tdcategoryName.textContent = row.categoryName;

    tr.appendChild(tdcategoryID);
    tr.appendChild(tdcategoryName);
    tableBody.appendChild(tr);
  });
}

//Add Category function

async function addCategory() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/category/addcategory";

  const categoryID = document.getElementById("addtxtCategoryID").value;
  const categoryName = document.getElementById("addtxtCategoryName").value;

  const category = {
    categoryID: categoryID,
    categoryName: categoryName,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Category added successfully!",
      });

      window.location.href = "manageCategory.html";
    } else {
      await Swal.fire({
        icon: "error",
        title: "Unable to add category. Please try again later.",
      });
    }
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An unexpected error occurred. Please try again. " + error,
    });
  }
}

//Delete Category---------------------------------

async function deleteCategory() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/category/deletecategory/";

  const categoryID = document.getElementById("txtEnter").value;

  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url + categoryID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Category deleted successfully!",
      });
      window.location.href = "manageCategory.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to delete category. Please try again later.",
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

let searchImageFromDB;

async function searchCategory() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/category/searchcategory/";

  const categoryID = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + categoryID, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("txtSearchCategoryID").value =
            data.categoryID;
          document.getElementById("txtSearchCategoryName").value =
            data.categoryName;
        } else {
          Swal.fire({
            icon: "error",
            title: "Unable to search category. Please try again later.",
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

//Update Category---------------------------------

async function categoryUpdate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/category/updatecategory/";

  const categoryID = document.getElementById("txtEnter").value;

  const category = {
    categoryID: categoryID,
    categoryName: document.getElementById("txtSearchCategoryName").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(category),
  };

  try {
    const response = await fetch(url + categoryID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Category update successfully!",
      });

      window.location.href = "manageCategory.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update category. Please try again later.",
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
