<template>
    <input type="text" v-model="userName" placeholder="nume">
    <input type="password" v-model="userPas" placeholder="parola">
    <input type="email" v-model="userEmail" placeholder="Email">
    <p className="error">{{ error }}</p>
    <button @click="sendData()">trimite</button>

    <div v-if="users.length == 0" className="user">
        nu amev users
    </div>
    <div v-else-if="users.length == 1" className="user">
        doar 1 element
    </div>

    <div v-for="(el, index) in users" :key="index" className="user">
        <h3>{{ el.name }}</h3>
        <p>{{ el.email }} - <b>{{ el.pass }}</b></p>
    </div>
</template>

<script>
export default{
    data(){
        return{
            users: [],
            error: '',
           userName: '',
           userPas: '',
           userEmail: ''
        }
    },
    methods: {
       sendData(){
         if(this.userName == '') {
            this.error = 'problema ';
            return
         } else if( this.userEmail == '') {
            this.error  = 'emailul nu e ';
            return;
         }else if( this.userPas == '') {
            this.error  = 'parolanu e ';
            return;
         }

         this.error = '';

        this.users.push({
            name: this.userName,
            pass: this.userPas,
            email: this.userEmail
        })
       }
    }
}
</script>

<style scoped>
input {
    display: block;
    margin-bottom: 10px;
    border-radius: 3px;
    border: 1px solid silver;
    outline: none;
    padding: 10px 15px;
    background: #fafafa;
    color: #333;
}

button {
    border: 0;
    border-radius: 5px;
    outline: none;
    padding: 10px 15px;
    background: #6cd670;
    color: #167f3d;
    font-weight: bold;
    cursor: pointer;
    transition: transform 500ms ease;
}

.user{ 
    width: 500px;
    margin-top: 20px;
    border: 1px solid silver;
    background: #e3e3e3;
    color: #222;
    padding: 20px;
    border-radius: 5px;
}
</style>