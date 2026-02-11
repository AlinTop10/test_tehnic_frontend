import { createRouter, createWebHashHistory } from "vue-router";
import mainPage from "./page/mainPage.vue";
import Main from "./page/Main.vue";
import Chat from "./page/Chat.vue";


export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: Main},
        {path: '/chat', component: Chat},
    ]
})