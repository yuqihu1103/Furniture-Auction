document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("userList");
  const chatHistory = document.getElementById("chatHistory");
  const messageInput = document.getElementById("messageInput");
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  let selectedUser = null;

  // Fetch user list from the backend
  fetch("/users")
    .then((response) => response.json())
    .then((users) => {
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<button>${user.username}</button>`;
        listItem.addEventListener("click", () => {
          selectedUser = user.username;
          displayChatHistory(selectedUser);
        });
        userList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching user list:", error));

  // Function to display chat history
  function displayChatHistory(receiverUsername) {
    chatHistory.innerHTML = ""; // Clear previous chat history
    fetch(`/chat_history?receiverUsername=${receiverUsername}`)
      .then((response) => response.json())
      .then((messages) => {
        chatHistory.innerHTML = "<h2>Chat History</h2>";
        if (messages.length === 0) {
          chatHistory.innerHTML +=
            "<p>No chat History Yet. Start chatting now</p>";
        } else {
          messages.forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${message.sender}: ${message.content}`;
            chatHistory.appendChild(messageElement);
          });
        }
      })
      .catch((error) => console.error("Error fetching chat history:", error));
  }

  // Event listener for sending messages
  sendMessageBtn.addEventListener("click", () => {
    if (!selectedUser) {
      console.log("none selected");
      return;
    } // No user selected, do nothing
    const content = messageInput.value.trim();
    if (content === "") {
      console.log("none sent");
      return;
    }

    fetch("/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverUsername: selectedUser,
        content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          messageInput.value = ""; // Clear input field after sending message
          displayChatHistory(selectedUser); // Refresh chat history after sending message
        }
      })
      .catch((error) => console.error("Error sending message:", error));
  });
});
