function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
};

function hostRoom() {
  const name = document.getElementById("hostName").value.trim();
  if (name) {
    window.location.href = "website/pages/game.html";
    // TODO: Replace with backend integration
  } else {
    alert("Please enter your name to host a room.");
  }
};