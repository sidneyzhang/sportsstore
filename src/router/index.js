import Vue from "vue";
import Vuerouter from "vue-router";

import Store from "../components/Store";
import ShoppingCart from "../components/ShoppingCart";
import Checkout from "../components/Checkout";
import OrderThanks from "../components/OrderThanks";

Vue.use(Vuerouter);

export default new Vuerouter({
    mode: "history",
    routes: [
        {path: "/", component: Store},
        {path: "/cart", component: ShoppingCart},
        {path: "/checkout",component:Checkout},
        {path: "/thanks/:id",component:OrderThanks},
        {path: "*", redirect: "/"}
    ]
})
