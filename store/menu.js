export const state = () => ({
    menus: [],
});

export const mutations = {
    set(state, menus) {
        state.menus = menus;
    },
    update(state, menu) {
        const index = state.menus.findIndex((_menu) => _menu.id === menu.id);
        if (index >= 0) {
            state.menus.splice(index, 1, menu);
        }
    },
    delete(state, id) {
        const index = state.menus.findIndex((_menu) => _menu.id === id);
        if (index >= 0) {
            state.menus.splice(index, 1);
        }
    },
};
