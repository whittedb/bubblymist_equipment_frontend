import Vue from "vue"
import VueRouter from "vue-router"
import Login from "@/components/Login";
import MachineList from "@/components/MachineList";
import EditMachine from "@/components/EditMachine";
import EditRepairLog from "@/components/EditRepairLog";


Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login,
            meta: {ignoreAuth: true}
        },
        {
            path: "/machinelist",
            name: "MachineList",
            component: MachineList
        },
        {
            path: "/editmachine/:id",
            name: "EditMachine",
            component: EditMachine,
            props: true
        },
        {
            path: "/createmachine",
            name: "CreateMachine",
            component: EditMachine,
            props: true
        },
        {
            path: "/editrepairlog/:id",
            name: "EditRepairLog",
            component: EditRepairLog,
            props: true
        },
        {
            path: "/createrepairlog",
            name: "CreateRepairLog",
            component: EditRepairLog,
            props: true
        },
    ],
    mode: 'history',
    history: true,
    hashbang: false,
    root: '/'
})
