export const state = () => ({
    codes: [],
});

export const mutations = {
    set(state, codes) {
        state.codes = codes;
    },
};
