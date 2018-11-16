<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col bg-dark text-white">
                <a class="navbar-brand">SPORTS STORE</a>
                <cart-summary/>
            </div>
        </div>
        <div class="row">
            <div class="col-3 bg-info p-2">
                <CategoryControls class="mb-5" />
                <button class="btn btn-block btn-warning mt-5"
                        v-on:click="setShowSearch(true)">
                    Search
                </button>
            </div>
            <div class="col-9 p-2">
                <ProductList/>
                <Search />
            </div>
        </div>
    </div>
</template>

<script>
    import ProductList from "@/components/ProductList";
    import CategoryControls from "@/components/CategoryControls";
    import CartSummary from "./CartSummary";
    import {mapMutations} from "vuex"
    import Search from "./Search";

    export default {
        name: "Store",
        components: {CartSummary, ProductList, CategoryControls,Search},
        methods:{
            ...mapMutations(["setShowSearch"])
        }

    }
</script>

