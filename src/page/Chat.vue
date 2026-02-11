<template>
    <div class="wrap">
        <div class="header">
            <div class="title">
               {{ room }}
            </div>            
            <div class="users">
                0 users in this room
            </div>
            <button class="left" @click="leftRoom()"> 
                <!-- aici trebuie sa fac sa iasa din chat -->
                left the room
            </button>
        </div>
        <!-- mesaje -->
          <div class="messages">
            <div 
              v-for="m in messages" 
              :key="m.id"
              class="message"
              :class="{ own: m.userName === name }"
            >
              <div class="bubble">
                <div class="meta">
                  <span class="author">{{ m.userName }}</span>
                  <span class="time">{{ m.time }}</span>
                </div>
                <div class="text">{{ m.text }}</div>
              </div>
            </div>
          </div>

         <form class="form" @submit.prevent="semdMessage">
                <div class="input">
                    <input 
                        type="text"
                        name="message"
                        placeholder="What do you want to say?" 
                        class="input"
                        autocomplete="off"
                        v-model="text"
                    >
                </div>
                <div class="emojies">
                    <img src="/src/image/emoji.png" 
                    alt="emoji"
                    @click="toggleEmojiPicker"
                    >
                    <div class="picker">
                        <EmojiPicker v-if="open" @select="addEmoji" />
                    </div>
                </div>
                <div class="button">
                    <input type="submit" value="Send a message">
                </div>
         </form>
    </div> 
</template>

<script lang="ts" setup>
type ChatMessage = {
  id: number;
  text: string;
  userName: string;
  time: string;
};
import { onMounted, onBeforeUnmount, watch } from "vue";
import { io, type Socket } from "socket.io-client";
import { ref, computed  } from "vue";
import { useRoute, useRouter } from "vue-router"
import EmojiPicker from "vue3-emoji-picker"
import "vue3-emoji-picker/css"

const router = useRouter();

const socket = ref<Socket | null>(null);

const open = ref(false);
const text = ref("");
const messages = ref<ChatMessage[]>([]);

const route = useRoute()

const name = computed(() => String(route.query.name || ""))
const room = computed(() => String(route.query.room || ""))

console.log(name.value,room.value);

const leftRoom=() => {
  socket.value?.emit("leaveRoom", {
    room: room.value,
    userName: name.value,
  });

  socket.value?.disconnect();
  socket.value = null;

  router.push("/");
};

const toggleEmojiPicker = () => {
    open.value = !open.value
}

const addEmoji = (emoji: any) => {
    text.value += emoji.i
    open.value = false
}

const semdMessage = () => {
    const msg = text.value.trim();
    if(!msg) return;
  
    messages.value.push({
      id: Date.now(),
      text: msg,
      userName: name.value,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    socket.value?.emit("roomMessage", {
      room: room.value,
      userName: name.value,
      message: msg
    })

    console.log("Send:", msg);
    text.value = ""
}

const connectSocket = () => {
  socket.value = io("ws://localhost:4000", {
    transports: ["websocket"],
  });

  socket.value.on("connect", () => {
    console.log("Socket connected:", socket.value?.id);

    socket.value?.emit("joinRoom", {
      room: room.value,
      userName: name.value,
    });
  });

  socket.value.on("roomMessage", (payload: { room: string; userName: string; message: string}) => {
    if (payload.userName === name.value) return;
    if(payload.room !== room.value) return;

    messages.value.push({
      id: Date.now(),
      text: payload.message,
      userName: payload.userName,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.value.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

onMounted(() => {
  if(!name.value || !room.value) return;
  connectSocket();
});

onBeforeUnmount(() => {
  socket.value?.disconnect();
  socket.value = null;
});


</script>

<style scoped>
.wrap {
    min-height: 100vh;
    width: 100%;
    background: #086815;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
}

.wrap > .header,
.wrap > .messages,
.wrap > .form {
  width: 100%;
  max-width: 1100px;              
}

.header {
    height: 56px;
    background: #3f3f3f;
    border-radius: 6px 6px 0 0;
    display: grid;
    grid-template-columns: 80px 1fr 160px;
    align-items: center;
    padding: 0 18px;
    box-sizing: border-box;
    color: #eaeaea;
}

.users {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #eaeaea
}

.left {
    justify-content: end;
    border: 0;
    background: #ff4d4f;
    color: #fff;
    font-weight: 700;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.08s ease;
}

.left:hover {
    filter: brightness(1.05);
}
.left:active {
  transform: translateY(1px);
}

.messages {
    height: 520px;
    background: #1f1f1f;
    border-radius: 0 0 0 0;
    padding: 18px;
    box-sizing: border-box;
    color: #fff;
    overflow-y: auto;
}

.form {
    height: 60px;
    background: #3f3f3f;
    border-radius: 0 0 6px 6px;
    display: grid;
    grid-template-columns: 1fr 44px 160px;
    gap: 10px;
    align-items: center;
    padding: 10px 14px;
    box-sizing: border-box;
}

.form .input {
    width: 100%;
}

.form .input input,
.form input.input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #2b2b2f;
  color: #fff;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.form .input input::placeholder,
.form input.input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form .input input:focus,
.form input.input:focus {
  border-color: rgba(59, 130, 246, 0.85);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.22);
}

.emojies {
  width: 44px;
  height: 40px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.08s ease;
}

.emojies:hover {
  filter: brightness(1.06);
}
.emojies:active {
  transform: translateY(1px);
}

.emojies img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  opacity: 0.95;
}

.button {
  display: flex;
  justify-content: flex-end;
}

.button input[type="submit"] {
  height: 40px;
  width: 160px;
  border: 0;
  border-radius: 8px;
  background: #2f6bff;            
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.08s ease;
}

.button input[type="submit"]:hover {
  filter: brightness(1.06);
}
.button input[type="submit"]:active {
  transform: translateY(1px);
}

.emojies {
  position: relative;
  overflow: visible;
}

.picker {
  position: absolute;
  bottom: 52px; 
  right: 0;
  z-index: 9999;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
  justify-content: flex-start;
}

.message.own {
  justify-content: flex-end;
}

.bubble {
  max-width: 70%;
  background: #2b2b2f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 10px 12px;
  color: #fff;
}

.message.own .bubble {
  background: #2f6bff;
  border-color: rgba(255,255,255,0.12);
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  opacity: 0.85;
  font-size: 12px;
}

.author {
  font-weight: 700;
}

.time {
  opacity: 0.8;
}


.text {
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
  white-space: pre-wrap;
}

</style>