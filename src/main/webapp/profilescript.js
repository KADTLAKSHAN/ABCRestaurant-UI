document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const url = `http://localhost:8080/ABCRestaurant/resources/users/searchuser/${userName}`;

    const options = {
      method: "GET",
      header: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();
    setProfileData(user);
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  }

  function setProfileData(user) {
    document.getElementById("username").value = user.userName;
    document.getElementById("firstName").value = user.userFirstName;
    document.getElementById("lastName").value = user.userLastName;
    document.getElementById("email").value = user.userEmail;
    document.getElementById("address").value = user.userAddress;
    document.getElementById("age").value = user.userAge;
    document.getElementById("phoneNumber").value = user.userPhoneNumber;
    document.getElementById("password").value = user.userPassword;
  }

  document.getElementById("logout").addEventListener("click", () => {
    console.log("clicked");

    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.clear();
    window.location.href = "index.html";
  });
});

document
  .getElementById("userProfileForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    const user = {
      userName: document.getElementById("username").value,
      userFirstName: document.getElementById("firstName").value,
      userLastName: document.getElementById("lastName").value,
      userEmail: document.getElementById("email").value,
      userAddress: document.getElementById("address").value,
      userAge: document.getElementById("age").value,
      userPhoneNumber: document.getElementById("phoneNumber").value,
      userPassword: document.getElementById("password").value,
    };

    try {
      const url =
        "http://localhost:8080/ABCRestaurant/resources/users/updatecustomer";
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      await Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
      });
    } catch (error) {
      console.log(error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update profile. Please try again later.",
      });
    }
  });
