import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
    createPersistedState({
        key: "userInfo",
        paths: ["account.userInfo"],
    })(store);
};
