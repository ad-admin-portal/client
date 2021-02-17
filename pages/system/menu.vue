<template>
    <div>
        <CRow>
            <CCol sm="4">
                <CCard>
                    <!-- <CCardHeader>
                    <strong>메뉴관리</strong>
                </CCardHeader> -->
                    <CCardBody>
                        <tree ref="tree" :data="treeData" :options="treeOptions" @node:clicked="selectNode">
                            <span slot-scope="{ node }" class="tree-text">
                                <template v-if="!node.data.enabled">
                                    <fa-icon icon="ban" />
                                    {{ node.text }}
                                </template>
                                <template v-else>
                                    {{ node.text }}
                                </template>
                            </span>
                        </tree>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol sm="8">
                <CCard class="position-sticky" style="top: 90px">
                    <CCardBody>
                        <CRow>
                            <CCol sm="12">
                                <CInput
                                    v-model="$v.form.name.$model"
                                    label="Name"
                                    :lazy="false"
                                    :is-valid="checkIfValidate('name')"
                                    invalid-feedback="Menu Name의 입력값의 길이는 2~32 입니다."
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm="12">
                                <CInput
                                    v-model="$v.form.path.$model"
                                    label="Path"
                                    :lazy="false"
                                    :is-valid="checkIfValidate('path')"
                                    invalid-feedback="반드시 입력해야 합니다."
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm="12">
                                <CInput
                                    v-model="$v.form.icon.$model"
                                    label="Icon"
                                    :lazy="false"
                                    :is-valid="checkIfValidate('icon')"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm="12">
                                <CSelect
                                    :value.sync="$v.form.enabled.$model"
                                    label="Enabled"
                                    :lazy="false"
                                    :is-valid="checkIfValidate('enabled')"
                                    :options="trueFalseOptions"
                                    invalid-feedback="반드시 값을 선택해야 합니다."
                                    @click.stop=""
                                />
                            </CCol>
                        </CRow>
                        <CRow v-if="mode === 'edit'">
                            <CCol v-if="selectedMenu.id !== null" sm="3">
                                <CButton size="sm" color="success" @click="readyChildMenu"
                                    ><fa-icon icon="plus" /><span class="ml-1">하위 메뉴 추가</span>
                                </CButton>
                            </CCol>
                            <CCol v-if="selectedMenu.parentId !== null" sm="9" class="text-right">
                                <CButton
                                    size="sm"
                                    color="primary"
                                    :disabled="!isValid || !isDirty"
                                    @click.stop="handleUpdate"
                                >
                                    <fa-icon :icon="['far', 'edit']" />
                                    <span class="ml-1">수정</span>
                                </CButton>

                                <CButton size="sm" color="danger" @click.stop="handleDelete">
                                    <fa-icon :icon="['far', 'trash-alt']" />
                                    <span class="ml-1">삭제</span>
                                </CButton>
                            </CCol>
                        </CRow>
                        <CRow v-else>
                            <CCol class="text-right">
                                <CButton
                                    size="sm"
                                    color="primary"
                                    :disabled="!isValid || !isDirty"
                                    @click="createChildMenu"
                                >
                                    <fa-icon :icon="['far', 'save']" />
                                    <span class="ml-1">저장</span>
                                </CButton>
                                <CButton size="sm" color="dark" @click="cancelChildMenuCreation">
                                    <fa-icon icon="undo" />
                                    <span class="ml-1">취소</span>
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardBody>
                    <CCardFooter v-if="childMenus.length > 0">
                        <OrderList v-model="childMenus" data-key="id">
                            <template #header>하위 메뉴 순서</template>
                            <template #item="slotProps">
                                <span>{{ slotProps.item.name }}</span>
                            </template>
                        </OrderList>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
        <CustomModal
            type="info"
            modal-title="확인"
            modal-content="메뉴를 수정하시겠습니까?"
            :show-modal="showUpdateConfirmDialog"
            @close="closeDialog"
            @confirm="updateMenu"
        />
        <CustomModal
            type="danger"
            modal-title="주의"
            modal-content="메뉴를 삭제하시겠습니까?"
            :show-modal="showDeleteConfirmDialog"
            @close="closeDialog"
            @confirm="deleteMenu"
        />
    </div>
</template>

<script>
import LiquorTree from "liquor-tree";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
    components: {
        tree: LiquorTree,
    },
    mixins: [validationMixin],
    data() {
        return {
            mode: "edit",
            menus: [],
            treeData: [],
            treeOptions: {
                parentSelect: true,
                checkbox: false,
                dnd: false,
                multiple: false,
            },
            form: {},
            selectedMenu: {},
            showUpdateConfirmDialog: false,
            showDeleteConfirmDialog: false,
            trueFalseOptions: [
                { value: "empty", label: "Select" },
                { value: true, label: "Y" },
                { value: false, label: "N" },
            ],
        };
    },
    computed: {
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
        childMenus: {
            get() {
                return this.menus
                    .filter((menu) => menu.parentId === this.selectedMenu.id)
                    .sort((firstEl, secondEl) => {
                        return firstEl.sort - secondEl.sort;
                    });
            },
            set(menus) {
                menus.forEach((menu, index) => {
                    menu.sort = index + 1;
                    this.$axios.put("/api/menu/" + menu.id, menu).then((response) => {
                        if (response.status === 200) {
                            this.$store.commit("menu/update", response.data);
                            // const node = this.findNode(response.data.id);
                            // if (node) {
                            //     // eslint-disable-next-line no-console
                            //     console.log(node.parent);
                            // }
                            this.$refs.tree.sortTree((node1, node2) => {
                                if (node1.sort === node2.sort) return 0;
                                else if (node1.sort > node2.sort) return 1;
                                return -1;
                            });
                        }
                    });
                });
            },
        },
    },
    created() {
        this.$axios.get("/api/system/menu").then((response) => {
            if (response.status === 200) {
                this.menus = response.data;
                this.menus
                    // .filter((menu) => menu.parentId !== null) // Home menu 제외
                    .forEach((menu) => {
                        const parent = this.findNode(menu.parentId);
                        if (parent) {
                            this.$refs.tree.append(parent, { text: menu.name, data: menu });
                            parent.expand();
                        } else {
                            this.$refs.tree.append({ text: menu.name, data: menu });
                        }
                    });
            } else {
                // TODO default menu?
            }
        });
        // }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.tree.tree.model.forEach((node) => node.expand());
            // this.$refs.tree.tree.model[0].select();
        });
    },
    methods: {
        test(event) {
            // eslint-disable-next-line no-console
            console.log(event);
        },
        getChildren(node) {
            return this.$store.state.menu.menus
                .filter((menu) => menu.parentId === node.id)
                .map((menu) => {
                    return {
                        text: menu.name,
                        data: menu,
                        children: this.getChildren(menu),
                    };
                });
        },
        selectNode(node) {
            this.mode = "edit";
            this.$v.$reset();
            this.selectedMenu = { ...node.data };
            this.form = { ...node.data };
            console.log(this.selectedMenu);
        },
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },
        handleUpdate() {
            this.showUpdateConfirmDialog = true;
        },
        updateMenu() {
            this.$axios
                .put("/api/menu/" + this.form.id, this.form)
                .then((response) => {
                    if (response.status === 200) {
                        const receivedMenu = response.data;
                        const index = this.menus.findIndex((menu) => menu.id === receivedMenu.id);
                        if (index >= 0) {
                            this.menus.splice(index, 1, receivedMenu);
                        }
                        const node = this.findNode(this.form.id);
                        if (node) {
                            node.data = receivedMenu;
                            node.text = receivedMenu.name;
                        }
                        // this.$store.commit("menu/update", receivedMenu);
                        // TODO 메뉴 변경 시 실시간 적용은 SSE를 사용해서 모든 client 에 적용
                    }
                })
                .finally(() => {
                    this.showUpdateConfirmDialog = false;
                    this.$v.$reset();
                });
        },
        handleDelete() {
            this.showDeleteConfirmDialog = true;
        },
        deleteMenu() {
            this.closeDialog();
            this.$axios
                .delete("/api/menu/" + this.form.id)
                .then((response) => {
                    if (response.status === 200) {
                        const index = this.menus.findIndex((menu) => menu.id === this.form.id);
                        if (index >= 0) {
                            this.menus.splice(index, 1);
                        }
                        const selection = this.$refs.tree.remove({ state: { selected: true } });
                        if (selection.length > 0) {
                            if (this.form.parentId) {
                                const parentNode = this.findNode(this.form.parentId);
                                if (parentNode) {
                                    parentNode.select();
                                    this.selectNode(parentNode);
                                }
                            }
                        }
                        // this.$store.commit("menu/delete", this.form.id);
                        // TODO 메뉴 변경 시 실시간 적용은 SSE를 사용해서 모든 client 에 적용
                    }
                })
                .finally(() => {
                    this.showDeleteConfirmDialog = false;
                    this.$v.$reset();
                });
        },
        closeDialog() {
            this.showUpdateConfirmDialog = false;
            this.showDeleteConfirmDialog = false;
            this.$v.$reset();
            this.form = { ...this.selectedMenu };
        },
        readyChildMenu() {
            this.mode = "create";
            this.form = {
                name: "",
                path: "",
                icon: "",
                parentId: this.selectedMenu.id,
                enabled: true,
            };
        },
        createChildMenu() {
            // eslint-disable-next-line no-console
            console.log(this.form);
            this.$axios.post("/api/menu", this.form).then((response) => {
                if (response.status === 200) {
                    const receivedMenu = response.data;
                    this.menus.push(receivedMenu);
                    const parentNode = this.findNode(receivedMenu.parentId);
                    this.$refs.tree.append(parentNode, {
                        text: receivedMenu.name,
                        data: receivedMenu,
                    });
                    parentNode.expand();
                    const node = this.findNode(receivedMenu.id);
                    node.select();

                    this.mode = "edit";
                    this.$v.$reset();
                }
            });
        },
        cancelChildMenuCreation() {
            this.mode = "edit";
            this.form = { ...this.selectedMenu };
        },
        findNode(_id) {
            const selection = this.$refs.tree.find({ data: { id: _id } });
            if (selection.length > 0) return selection[0];
            return null;
        },
    },
    validations: {
        form: {
            name: {
                minLength: minLength(2),
                maxLength: maxLength(32),
            },
            path: {
                required,
            },
            icon: {},
            enabled: {
                required,
                valueCheck: (val) => {
                    return typeof val === "boolean";
                },
            },
        },
    },
};
</script>

<style></style>
