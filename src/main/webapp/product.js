let userType = "";

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  userType = localStorage.getItem("userType");

  const welcomenoteh4 = document.getElementById("user-greeting");
  welcomenoteh4.textContent = `Welcome ${userName}`;

  fetchAllProduct();
  fetchAllCategories();
});

async function fetchAllCategories() {
  const url = "http://localhost:8080/ABCRestaurant/resources/category";

  try {
    const response = await fetch(url);
    const categories = await response.json();

    addCategoryDropdownList(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function addCategoryDropdownList(categories) {
  const selectElements = [
    document.getElementById("txtSearchCategoryID"),
    document.getElementById("addtxtCategoryID"),
  ];

  selectElements.forEach((select) => {
    select.innerHTML = "";

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.categoryID;
      option.textContent = category.categoryName;
      select.appendChild(option);
    });
  });
}

function fetchAllProduct() {
  const url = "http://localhost:8080/ABCRestaurant/resources/product";

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
    const tdproductID = document.createElement("td");
    tdproductID.textContent = row.productID;

    const tdproductName = document.createElement("td");
    tdproductName.textContent = row.productName;

    const tdproductDescription = document.createElement("td");
    tdproductDescription.textContent = row.productDescription;

    const tdproductPrice = document.createElement("td");
    tdproductPrice.textContent = row.productPrice;

    const tdproductDiscountAvailability = document.createElement("td");
    tdproductDiscountAvailability.textContent = row.productDiscountAvailability;

    const tdproductDiscount = document.createElement("td");
    tdproductDiscount.textContent = row.productDiscount;

    const tdcategoryID = document.createElement("td");
    tdcategoryID.textContent = row.categoryID;

    tr.appendChild(tdproductID);
    tr.appendChild(tdproductName);
    tr.appendChild(tdproductDescription);
    tr.appendChild(tdproductPrice);
    tr.appendChild(tdproductDiscountAvailability);
    tr.appendChild(tdproductDiscount);
    tr.appendChild(tdcategoryID);
    tableBody.appendChild(tr);
  });
}

//Add Product function

async function addProduct() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/product/addproduct";

  const productID = document.getElementById("addtxtProductID").value;
  const productName = document.getElementById("addtxtProductName").value;
  const productDescription = document.getElementById(
    "addtxtProductDescription"
  ).value;
  const productPrice = parseFloat(
    document.getElementById("addtxtProductPrice").value
  );
  const productImage = document.getElementById("addFileProductImage").files[0];
  const productDiscountAvailability = document.getElementById(
    "dpaddlDiscountAvailability"
  ).value;
  const productDiscount = parseFloat(
    document.getElementById("addtxtProductDiscount").value
  );
  const categoryID = document.getElementById("addtxtCategoryID").value;

  if (!productImage) {
    Swal.fire({
      icon: "error",
      title: "No image selected",
      text: "Please select an image file.",
    });
    return;
  }

  const base64Image = await convertFileToBase64(productImage);

  const product = {
    productID: productID,
    productName: productName,
    productDescription: productDescription,
    productPrice: productPrice,
    productImage: base64Image,
    productDiscountAvailability: productDiscountAvailability,
    productDiscount: productDiscount,
    categoryID: categoryID,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Product added successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "manageProduct.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerProduct.html";
      }
    } else {
      await Swal.fire({
        icon: "error",
        title: "Unable to add product. Please try again later.",
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

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

//Delete Product---------------------------------

async function deleteProduct() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/product/deleteproduct/";

  const productID = document.getElementById("txtEnter").value;

  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url + productID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Product deleted successfully!",
      });
      if (userType == "Admin") {
        window.location.href = "manageProduct.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerProduct.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to delete product. Please try again later.",
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

async function searchProduct() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/product/searchproduct/";

  const productID = document.getElementById("txtEnter").value;

  const options = {
    method: "GET",
  };

  try {
    await fetch(url + productID, options)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          console.log(data);

          document.getElementById("txtSearchProductID").value = data.productID;
          document.getElementById("txtSearchProductName").value =
            data.productName;
          document.getElementById("txtSearchProductDescription").value =
            data.productDescription;
          document.getElementById("txtSearchPrice").value = data.productPrice;
          // document.getElementById("txtSearchImage").value = data.productImage;
          searchImageFromDB = data.productImage;
          document.getElementById("dplSearchDiscountAvailability").value =
            data.productDiscountAvailability;
          document.getElementById("txtSearchDiscount").value =
            data.productDiscount;
          document.getElementById("txtSearchCategoryID").value =
            data.categoryID;
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

//Update Product---------------------------------

async function productUpdate() {
  const url =
    "http://localhost:8080/ABCRestaurant/resources/product/updateproduct/";

  const productID = document.getElementById("txtEnter").value;

  const productImage = document.getElementById("txtSearchImage").files[0];

  let base64Image;

  if (productImage == null) {
    base64Image = searchImageFromDB;
  } else {
    base64Image = await convertFileToBase64(productImage);
  }

  const product = {
    productID: productID,
    productName: document.getElementById("txtSearchProductName").value,
    productDescription: document.getElementById("txtSearchProductDescription")
      .value,
    productPrice: parseFloat(document.getElementById("txtSearchPrice").value),
    productImage: base64Image,
    productDiscountAvailability: document.getElementById(
      "dplSearchDiscountAvailability"
    ).value,
    productDiscount: document.getElementById("txtSearchDiscount").value,
    categoryID: document.getElementById("txtSearchCategoryID").value,
  };

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(product),
  };

  try {
    const response = await fetch(url + productID, options);

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Product update successfully!",
      });

      if (userType == "Admin") {
        window.location.href = "manageProduct.html";
      }

      if (userType == "Manager") {
        window.location.href = "managerProduct.html";
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Unable to update product. Please try again later.",
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
