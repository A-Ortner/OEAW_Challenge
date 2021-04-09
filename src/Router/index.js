import Vue from 'vue'
import Router from 'vue-router'
import Search from "@/components/Search";
import Details from "@/components/Details";

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', component: Search },
        { path: '/details/:id', component: Details }
    ]
})
