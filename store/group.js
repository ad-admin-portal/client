export const state = () => ({
    groups: [],
});

export const mutations = {
    set(state, groups) {
        state.groups = groups;
    },
};
