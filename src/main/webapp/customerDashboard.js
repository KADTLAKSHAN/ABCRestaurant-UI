window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");

  document.getElementById("welcomeMessage").innerText = `Welcome, ${userName}!`;
};
