import Vue from "vue";
import Vuerouter from "vue-router";

import Store from "../components/Store";
import ShoppingCart from "../components/ShoppingCart";
import Checkout from "../components/Checkout";
import OrderThanks from "../components/OrderThanks";
import Authentication from "../components/admin/Authentication";
import Admin from "../components/admin/Admin";
import ProductAdmin from "../components/admin/ProductAdmin";
import OrderAdmin from "../components/admin/OrderAdmin";

import dataStore from "../store";

Vue.use(Vuerouter);

export default new Vuerouter({
    mode: "history",
    routes: [
        {path: "/", component: Store},
        {path: "/cart", component: ShoppingCart},
        {path: "/checkout", component: Checkout},
        {path: "/thanks/:id", component: OrderThanks},
        {
            path: "/admin", component: Admin,
            beforeEnter(to, from, next) {
                if (dataStore.state.auth.authenticated) {
                    next();
                } else {
                    next("/login");
                }
            },
            children: [
                {path: "products", component: ProductAdmin},
                {path: "orders", component: OrderAdmin},
                {path: "", redirect: "/admin/products"}
            ]
        },
        {path: "/login", component: Authentication},
        {path: "*", redirect: "/"}
    ]
})
