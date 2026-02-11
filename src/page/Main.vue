<template>
    <div class="wrap">
        <div class="container">
            <h1 class="heading">Join</h1>

            <form class="form">
                <div class="group">
                    <input 
                        type="text"
                        name="username"
                        placeholder="Username"
                        class="input" 
                        v-model="userName"
                        autocomplete="off"
                    >
                </div>
                <div class="group">
                    <input 
                        type="text"
                        name="room"
                        placeholder="Room" 
                        class="input" 
                        v-model="room"
                        autocomplete="off"
                    >
                </div>

                <button type="button" @click="sendData()" class="button">
                    Sing In
                </button>
            </form>
        </div>
        <p>{{ error }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return{
            user: [],
            userName: '',
            room: '',
            error: ''
        }
    }, 
    methods:{
        sendData(){
            if(this.userName == ''){
                this.error = 'Nu ati introdus Numele!';
                return
            } else if(this.room == ''){
                this.error = 'Nu ati introdus chat-ul';
                return;
            }

            this.error = ''

            this.$router.push({
                path: "/chat",
                query: {
                    name: this.userName,
                    room: this.room
                }
            })
        }
    }
}
</script>

<style scoped>
.wrap{ 
    min-height: 100vh;
    width: 100%;
    background: #086815;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
}

.cocontainern {
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.heading {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 22px;
    text-align: center;
}

.form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.group {
    width: 100%;
}

.input {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: #2b2b2f;
    color: #fff;
    outline: none;
    padding: 0 14px;
    font-size: 14px;   
}

.button {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 10px;
  background: #1e66f5;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.08s ease, filter 0.15s ease;
}

.wrap > p {
  margin-top: 14px;
  color: #ffd2d2;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  max-width: 360px;
}

</style>