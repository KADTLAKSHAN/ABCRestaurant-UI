document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  }

  document.getElementById("logout").addEventListener("click", () => {
    console.log("clicked");

    localStorage.removeItem("authToken");
    localStorage.clear();
    window.location.href = "index.html";
  });
});
