import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // 👇 Automatically join a workspace room (simulate a user viewing workspace)
  const workspaceId = "68f26ab228ff769f4977257f"; // replace with an actual _id from DB
  const userId = "68ef64a891068e37ca878a91";
  socket.emit("joinWorkspace", workspaceId);
  console.log(`🧩 Joined workspace room: ${workspaceId}`);

  // 👇 Simulate userOnline event
  socket.emit("userOnline", { userId, workspaceId });

  // Simulate user update after 5 seconds
  setTimeout(() => {
    socket.emit("userUpdated", {
      userId,
      workspaceId,
      updatedFields: { name: "Miracle Updated", role: "member" },
    });
  }, 5000);

  // Simulate user going offline after 10 seconds
  setTimeout(() => {
    socket.emit("userOffline", { userId, workspaceId });
    socket.disconnect();
  }, 10000);
});


// Handle all workspace events
socket.on("workspaceCreated", (data) => console.log("🆕 workspaceCreated:", data));
socket.on("workspaceUpdated", (data) => console.log("✏️ workspaceUpdated:", data));
socket.on("workspaceDeleted", (data) => console.log("🗑️ workspaceDeleted:", data));
socket.on("memberAdded", (data) => console.log("👥 memberAdded:", data));
socket.on("memberRemoved", (data) => console.log("🚫 memberRemoved:", data));
socket.on("roleUpdated", (data) => console.log("🔑 roleUpdated:", data));

// Handle all board events
socket.on("boardCreated", (data) => console.log("🆕 Board created:", data));
socket.on("boardUpdated", (data) => console.log("✏️ Board updated:", data));
socket.on("boardDeleted", (data) => console.log("🗑️ Board deleted:", data));

// Handle all list events
socket.on("listCreated", (data) => console.log("🆕 listCreated:", data));
socket.on("listUpdated", (data) => console.log("✏️ listUpdated:", data));
socket.on("listDeleted", (data) => console.log("🗑️ listDeleted:", data));

// Handle all card events
socket.on("cardCreated", (data) => console.log("🆕 cardCreated:", data));
socket.on("cardUpdated", (data) => console.log("✏️ cardUpdated:", data));
socket.on("cardDeleted", (data) => console.log("🗑️ cardDeleted:", data));

// Handle all comment events
socket.on("commentCreated", (data) => console.log("🆕 commentCreated:", data));
socket.on("commentUpdated", (data) => console.log("✏️ commentUpdated:", data));
socket.on("commentDeleted", (data) => console.log("🗑️ commentDeleted:", data));


socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
