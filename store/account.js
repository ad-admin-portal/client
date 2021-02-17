export const state = () => ({
    userInfo: {
        userId: null,
        userName: null,
        token: null,
        roleId: null,
        roleName: null,
        userMenuAuthInfo: null,
        departmentId: null,
        evaluatorYn: null,
    },
});

export const mutations = {
    login(state, data) {
        sessionStorage.setItem("token", data.token);
        state.userInfo = data;
    },

    logout(state) {
        sessionStorage.removeItem("token");
        state.userInfo = {
            userId: null,
            userName: null,
            token: null,
            roleId: null,
            roleName: null,
            userMenuAuthInfo: null,
            departmentId: null,
            evaluatorYn: null,
        };
    },
};
