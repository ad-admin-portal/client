<template>
    <div>
        <div>
            <CDataTable
                :items="rolesData"
                :fields="fields"
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                table-filter
                cleaner
                clickable-rows
                @row-clicked="rowClicked"
            >
                <template #enabled="{ item }">
                    <td>
                        <CSwitch
                            color="success"
                            shape="pill"
                            :checked.sync="item.enabled"
                            v-bind="switchTxt"
                            @update:checked="handleSwitchUpdate(item)"
                        />
                    </td>
                </template>
                <template #details="{ item }">
                    <CCollapse :show="item._toggled" :duration="collapseDuration">
                        <CCardBody>
                            <CForm>
                                <CRow>
                                    <CCol md="3">
                                        <CInput
                                            v-model="updateWork.name"
                                            placeholder="Role Name"
                                            :lazy="false"
                                            :is-valid="checkIfValidate('name')"
                                            :value.sync="$v.form.name.$model"
                                            invalid-feedback="This is a required field and must be at least 2 characters"
                                            @click.stop=""
                                        />
                                    </CCol>
                                    <CCol md="5">
                                        <CInput
                                            v-model="updateWork.description"
                                            placeholder="Role Description"
                                            :lazy="false"
                                            :is-valid="checkIfValidate('description')"
                                            :value.sync="$v.form.description.$model"
                                            invalid-feedback="This is a required field and must be at least 1 characters"
                                            @click.stop=""
                                        />
                                    </CCol>

                                    <CCol md="4">
                                        <CSelect
                                            :lazy="false"
                                            :value.sync="$v.form.enabled.$model"
                                            :options="trueFalseOptions"
                                            :is-valid="checkIfValidate('enabled')"
                                            invalid-feedback="This is a required field"
                                            @click.stop=""
                                        />
                                    </CCol>
                                </CRow>
                            </CForm>
                            <CRow>
                                <CCol sm="12" class="text-right">
                                    <CButton
                                        size="sm"
                                        color="primary"
                                        :disabled="!isValid || !isDirty"
                                        @click.stop="updateWork.modal = true"
                                    >
                                        <fa-icon :icon="['far', 'edit']" />
                                        <span class="ml-1">수정</span>
                                    </CButton>
                                    <CButton size="sm" color="danger" @click.stop="deleteWork.modal = true">
                                        <fa-icon :icon="['far', 'trash-alt']" />
                                        <span class="ml-1">삭제</span>
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCollapse>
                </template>
            </CDataTable>
        </div>
        <CustomModal
            :type="updateWork.type"
            :modal-title="updateWork.modalTitle"
            :modal-content="updateWork.modalContent"
            :show-modal="updateWork.modal"
            @close="
                () => {
                    updateWork.modal = false;
                    $v.$reset();
                }
            "
            @confirm="roleUpdate"
        />
        <CustomModal
            :type="deleteWork.type"
            :modal-title="deleteWork.modalTitle"
            :modal-content="deleteWork.modalContent"
            :show-modal="deleteWork.modal"
            @close="
                () => {
                    deleteWork.modal = false;
                    $v.$reset();
                }
            "
            @confirm="roleDelete"
        />
        <CustomModal
            type="info"
            modal-title="확인"
            modal-content="Role 상태를 변경하시겠습니까?"
            :show-modal="showEnableConfirmDialog"
            @close="cancelRoleEnable()"
            @confirm="updateRoleEnable()"
        />
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

const fields = [
    { key: "id", filter: false, sorter: false },
    { key: "name", label: "권한" },
    { key: "description", label: "설명" },
    { key: "enabled", label: "상태" },
];

export default {
    name: "ManageRole",
    mixins: [validationMixin],
    data() {
        return {
            deleteWork: {
                modal: false,
                modalTitle: "Role 정보 삭제",
                modalContent: "",
                type: "danger",
            },
            updateWork: {
                modal: false,
                modalTitle: "Role 정보 수정",
                modalContent: "",
                name: "",
                description: "",
                enabled: true,
                type: "info",
            },
            roles: [],
            fields,
            details: [],
            collapseDuration: 300,
            selectedItem: {},
            form: {},
            previousSelectedItem: {},
            switchTxt: {
                labelOn: "yes",
                labelOff: "no",
            },
            showEnableConfirmDialog: false,
            targetRole: {},
        };
    },
    computed: {
        trueFalseOptions() {
            return [
                { value: null, label: "Select" },
                { value: true, label: "Y" },
                { value: false, label: "N" },
            ];
        },
        rolesData() {
            return this.roles.map((item, index) => {
                // item.enabledValue = item.enabled ? "Y" : "N";
                return { ...item, index };
            });
        },
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
    },
    watch: {
        selectedItem(role) {
            this.deleteWork.modalContent = role.name + "를 삭제 하시겠습니까?";
            this.updateWork.modalContent = role.name + "를 수정 하시겠습니까?";
        },
    },
    created() {
        this.fetchRole();
        this.$nuxt.$on("update-role", (e) => {
            const newData = {};
            newData.id = e.id;
            newData.name = e.name;
            newData.description = e.description;
            newData.enabled = true;
            newData.index = this.rolesData.length;
            this.rolesData.push(newData);
            this.$nuxt.$emit("reset-role");
        });
    },
    beforeDestroy() {
        this.$nuxt.$off("update-role");
    },
    methods: {
        roleDelete() {
            this.$axios.delete("/system/role", this.selectedItem.id).then((response) => {
                if (response.status === 200) {
                    this.rolesData.splice(this.selectedItem.index, 1);
                    this.selectedItem._toggled = false;
                }
            });
            this.deleteWork.modal = false;
        },
        roleUpdate() {
            // eslint-disable-next-line no-console
            // console.log(this.form);
            this.$axios.put("/api/system/role/" + this.form.id, this.form).then((response) => {
                // eslint-disable-next-line no-console
                // console.log(response.data);
                if (response.status === 200) {
                    const receivedRole = response.data;
                    const index = this.roles.findIndex((_user) => _user.id === receivedRole.id);
                    if (index >= 0) {
                        this.roles.splice(index, 1, receivedRole);
                    }
                }
            });
            this.updateWork.modal = false;
            this.$v.$reset();
        },
        fetchRole() {
            this.$axios.get("/api/system/role").then((response) => {
                this.roles = response.data;
            });
        },
        rowClicked(item) {
            if (this.selectedItem && item.id !== this.selectedItem.id) {
                this.selectedItem._toggled = false;
            }

            this.selectedItem = item;
            this.form = { ...item };
            this.updateWork.name = item.name;
            this.updateWork.description = item.description;
            this.updateWork.enabled = item.enabled;
            this.$set(this.rolesData[item.index], "_toggled", !item._toggled);
        },
        handleSwitchUpdate(role) {
            this.showEnableConfirmDialog = true;
            this.targetRole = role;
        },
        cancelRoleEnable() {
            this.showEnableConfirmDialog = false;
            const role = this.rolesData.find((role) => role.id === this.targetRole.id);
            role.enabled = !this.targetRole.enabled;
            this.targetRole = {};
        },
        updateRoleEnable() {
            this.showEnableConfirmDialog = false;
            if (this.targetRole.enabled) {
                this.$axios.put("/api/system/role/" + this.targetRole.id, this.targetRole).then((response) => {
                    if (response.status === 200) {
                        // eslint-disable-next-line no-console
                        // console.log(response.data);
                    }
                });
            } else {
                this.$axios
                    .delete("/api/system/role/" + this.targetRole.id)
                    .then((response) => {
                        if (response.status === 200) {
                            // eslint-disable-next-line no-console
                            console.log(response.data);
                        }
                    })
                    .finally(() => {
                        this.targetRole = {};
                    });
            }
        },
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },
    },
    validations: {
        form: {
            name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(64),
            },
            description: {},
            enabled: {
                required,
            },
        },
    },
};
</script>
