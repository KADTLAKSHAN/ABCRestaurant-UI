document.addEventListener("DOMContentLoaded", () => {
  const addToCartButton = document.querySelectorAll(".add-to-cart");
  const cartItemCount = document.querySelector(".cart-icon span");
  const cartItemsList = document.querySelector(".cart-item");
  const cartTotal = document.querySelector(".cart-total");
  const cartIcon = document.querySelector(".cart-icon");
  const slideBar = document.getElementById("slidebar");
  const homeButton = document.querySelector(".burger--icon");
  const categoryList = document.querySelector(".menu--list");
  const cardList = document.querySelector(".card--list");
  const searchInput = document.getElementById("searchInput");

  let cartItems = [];
  let totalAmount = 0;
  let products = [];
  let categories = [];

  //fetch categories

  async function fetchCategories() {
    const url = "http://localhost:8080/ABCRestaurant/resources/category";

    try {
      const response = await fetch(url);
      categories = await response.json();
      displayCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function displayCategories() {
    categoryList.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.classList.add("menu--item");
    allButton.setAttribute("data-id", "");
    allButton.textContent = "All";
    allButton.addEventListener("click", () => {
      fetchProducts();
    });
    categoryList.appendChild(allButton);

    categories.forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.classList.add("menu--item");
      categoryButton.setAttribute("data-id", category.categoryID);
      categoryButton.textContent = category.categoryName;
      categoryButton.addEventListener("click", () => {
        fetchProducts(category.categoryID);
      });
      categoryList.appendChild(categoryButton);
    });

    fetchProducts();
  }

  //fetch and display data

  async function fetchProducts(categoryID = "") {
    const url = categoryID
      ? `http://localhost:8080/ABCRestaurant/resources/product?categoryID=${encodeURIComponent(
          categoryID
        )}`
      : "http://localhost:8080/ABCRestaurant/resources/product";

    try {
      const response = await fetch(url);
      products = await response.json();
      displayProducts();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function displayProducts() {
    cardList.innerHTML = "";

    products.forEach((product) => {
      const image = `data:image/png;base64,${product.productImage}`;
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `<img src="${
        image || "assests/dishesforproduction.png"
      }" alt="item" /> <h4 class="card--title">${
        product.productName
      }</h4> <div class="card--price">
          <div class="price">$${product.productPrice.toFixed(2)}</div>
          <i class="fa-solid fa-plus add-to-cart" data-name="${
            product.productName
          }" data-price="${product.productPrice}"></i>
        </div>`;

      cardList.appendChild(card);
    });

    //Add event listners to add to cart buttons

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        const item = {
          name: name,
          price: price,
          quantity: 1,
        };

        const existingItem = cartItems.find(
          (cartItem) => cartItem.name === item.name
        );

        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItems.push(item);
        }

        totalAmount += item.price;

        updateCartUI();
      });
    });
  }

  function updateCartUI() {
    updateCartItemCount(cartItems.length);
    updateCartItemList();
    updateCartTotal();
  }

  function updateCartItemCount(count) {
    cartItemCount.textContent = count;
  }

  function updateCartItemList() {
    cartItemsList.innerHTML = "";
    cartItems.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item", "individual-cart-item");

      cartItem.innerHTML = `<span>(${item.quantity}x)${item.name}</span>
              <span class="cart-item-price">$${(
                item.price * item.quantity
              ).toFixed(2)}
              <button class="remove-item" data-index="${index}"><i class="fa-solid fa-x"></i></button></span>`;

      cartItemsList.append(cartItem);
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        removeItemFromCart(index);
      });
    });
  }

  function removeItemFromCart(index) {
    const removedItem = cartItems.splice(index, 1)[0];
    totalAmount -= removedItem.price * removedItem.quantity;
    updateCartUI();
  }

  function updateCartTotal() {
    cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
  }

  cartIcon.addEventListener("click", () => {
    slideBar.classList.add("open");
  });

  const closeButton = document.querySelector(".slidebar-close");
  closeButton.addEventListener("click", () => {
    slideBar.classList.remove("open");
  });

  homeButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  //Add event listner for search

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchProduct(searchInput.value);
    }
  });

  async function searchProduct(query) {
    const url = `http://localhost:8080/ABCRestaurant/resources/product/searchproduct/${query}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (data) {
          displaySearchResult(data);
        } else {
          Swal.fire({
            icon: "info",
            title: "No Results",
            text: "No product matches your search criteria.",
          });
        }
      } else if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Product Not Found",
          text: "Oops! We couldn't find any items that match your search. Please try again with different keywords.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was a problem with your search. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An unexpected error occurred. Please try again. " + error,
      });
    }
  }

  function displaySearchResult(product) {
    cardList.innerHTML = ""; // Clear previous results

    const image = `data:image/png;base64,${product.productImage}`;
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `<img src="${
      image || "assests/dishesforproduction.png"
    }" alt="item" /> <h4 class="card--title">${
      product.productName
    }</h4> <div class="card--price">
        <div class="price">$${product.productPrice.toFixed(2)}</div>
        <i class="fa-solid fa-plus add-to-cart" data-name="${
          product.productName
        }" data-price="${product.productPrice}"></i>
      </div>`;

    cardList.appendChild(card);

    // Add event listener to the add-to-cart button
    document.querySelector(".add-to-cart").addEventListener("click", () => {
      const name = document
        .querySelector(".add-to-cart")
        .getAttribute("data-name");
      const price = parseFloat(
        document.querySelector(".add-to-cart").getAttribute("data-price")
      );

      const item = {
        name: name,
        price: price,
        quantity: 1,
      };

      const existingItem = cartItems.find(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push(item);
      }

      totalAmount += item.price;

      updateCartUI();
    });
  }

  fetchCategories();
});
