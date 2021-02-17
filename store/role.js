export const state = () => ({
    roles: [],
});

export const mutations = {
    // init(state) {
    //     this.$axios.get("/api/system/role").then((response) => {
    //         state.roles = response.data;
    //     });
    // },
    set(state, roles) {
        state.roles = roles;
    },
};
