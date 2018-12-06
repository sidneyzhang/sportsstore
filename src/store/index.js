import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
import OrderModule from "./orders";
import AuthModule from "./auth";

Vue.use(Vuex);

const baseUrl = "http://localhost:3500";
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;


export default new Vuex.Store({
    strict: true,
    modules: {cart: CartModule, order: OrderModule, auth: AuthModule},
    state: {
        //products: [],
        categoriesData: [],
        //productsTotal: 0,
        currentPage: 1,
        pageSize: 4,
        currentCategory: "All",
        pages: [],
        serverPageCount: 0,
        searchTerm: "",
        showSearch: false
    },
    getters: {
        // productsFilteredByCategory: state => {
        //     return state.products.filter(p => state.currentCategory === "ALL"
        //         || p.category === state.currentCategory);
        // },

        // processedProducts: (state, getters) => {
        //     let index = (state.currentPage - 1) * state.pageSize;
        //     return getters.productsFilteredByCategory.slice(index, index + state.pageSize);
        // },
        // pageCount: (state, getters) => Math.ceil(getters.productsFilteredByCategory.length / state.pageSize),
        // categories: state => ["ALL", ...state.categoriesData]
        processedProducts: (state) => {
            return state.pages[state.currentPage];
        },
        pageCount: (state) => state.serverPageCount,
        categories: (state) => ["All",...state.categoriesData],
        productById:(state) => (id) => {
            return state.pages[state.currentPage].find(p => p.id == id);
        }
    },
    mutations: {
        _setCurrentPage(state, page) {
            state.currentPage = page;
        },
        _setPageSize(state, size) {
            state.pageSize = size;
            state.currentPage = 1;
        },
        _setCurrentCategory(state, category) {
            state.currentCategory = category;
            state.currentPage = 1;
        },
        // setData(state, data) {
        //     state.products = data.pdata;
        //     state.productsTotal = data.pdata.length;
        //     state.categoriesData = data.cdata.sort();
        // }
        addPage(state,page){
            for (let i = 0; i < page.pageCount; i++) {
                Vue.set(state.pages,page.number + i,page.data.slice(i * state.pageSize,
                    (i * state.pageSize) + state.pageSize));
            }
        },
        clearPages(state){
            state.pages.splice(0,state.pages.length);
        },
        setCategories(state, categories){
            state.categoriesData = categories;
        },
        setPageCount(state,count){
            state.serverPageCount = Math.ceil(Number(count) / state.pageSize);
        },
        setShowSearch(state,show){
            state.showSearch = show;
        },
        setSearchTerm(state,term){
            state.searchTerm = term;
            state.currentPage = 1;
        },
        _addProduct(state, product){
            state.pages[state.currentPage].unshift(product);
        },
        _updateProduct(state,product){
            let page = state.pages[state.currentPage];
            let index = state.findIndex(p => p.id === product.id);
            Vue.set(page,index,product);
        },
    },
    actions: {
        async getData(context) {
            await context.dispatch("getPage",4);
            context.commit("setCategories", (await Axios.get(categoriesUrl)).data);
        },
        async getPage(context, getPageCount = 1){
            let url = `${productsUrl}?_page=${context.state.currentPage}`
                + `&_limit=${context.state.pageSize * getPageCount}`;
            if ( context.state.currentCategory !== "All"){
                url += `&category=${context.state.currentCategory}`;
            }
            if (context.state.searchTerm !== ""){
                url += `&q=${context.state.searchTerm}`;
            }
            let response = await Axios.get(url);
            context.commit("setPageCount",response.headers["x-total-count"]);
            context.commit("addPage", { number: context.state.currentPage,data:response.data,
            pageCount: getPageCount});
        },
        setCurrentPage(context,page){
            context.commit("_setCurrentPage",page);
            if( !context.state.pages[page]){
                context.dispatch("getPage");
            }
        },
        setPageSize(context, size) {
            context.commit("clearPages");
            context.commit("_setPageSize", size);
            context.dispatch("getPage", 4);
        },
        setCurrentCategory(context, category) {
            context.commit("clearPages");
            context.commit("_setCurrentCategory", category);
            context.dispatch("getPage", 4);
        },
        search(context,term){
            context.commit("setSearchTerm",term);
            context.commit("clearPages");
            context.dispatch("getPage",2);
        },
        clearSearchTerm(context){
            context.commit("setSearchTerm","");
            context.commit("clearPages");
            context.dispatch("getPage",2);
        },
        async addProduct(context, product){
            let data = (await context.getters.authenticatedAxios.post(productsUrl, product)).data;
            product.id = data.id;
            context.commit("_addProduct",product);
        },
        async removeProduct(context,product){
            await context.getters.authenticatedAxios.delete(`${productsUrl}/${product.id}`);
            context.commit("clearPages");
            context.dispatch("getPage",1);
        },
        async updateProduct(context,product){
            await context.getters.authenticatedAxios.put(`${productsUrl}/${product.id}`,product);
            context.commit("_updateProduct",product);
        }
    }
})

