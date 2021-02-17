<template>
    <div>
        <CCard>
            <CCardBody>
                <CForm>
                    <CRow>
                        <CCol sm="4" lg="2">
                            <CInput
                                placeholder="User ID"
                                :lazy="false"
                                :is-valid="checkIfValidate('userId')"
                                :value.sync="$v.form.userId.$model"
                                invalid-feedback="User ID의 입력값은 4~32자 입니다."
                            />
                            <!-- <CInput class="sm" label="User ID" placeholder="user id" :value.sync="newUser.userId" /> -->
                        </CCol>
                        <CCol sm="4" lg="2">
                            <CInput
                                placeholder="User Name"
                                :lazy="false"
                                :is-valid="checkIfValidate('userName')"
                                :value.sync="$v.form.userName.$model"
                                invalid-feedback="User Name의 입력값은 2~64자 입니다."
                            />
                        </CCol>
                        <CCol sm="4" lg="2">
                            <CInput
                                type="password"
                                :lazy="false"
                                :is-valid="checkIfValidate('password')"
                                placeholder="Password"
                                :value.sync="$v.form.password.$model"
                                invalid-feedback="Password는 반드시 입력해야 합니다."
                            />
                        </CCol>
                        <CCol sm="4" lg="2">
                            <CInput
                                type="password"
                                :lazy="false"
                                :is-valid="checkIfValidate('password2')"
                                placeholder="Confirm Password"
                                :value.sync="$v.form.password2.$model"
                                invalid-feedback="Password와 같은 값을 입력해주세요."
                            />
                        </CCol>
                        <CCol sm="4" lg="2">
                            <CSelect
                                :lazy="false"
                                :is-valid="checkIfValidate('groupId')"
                                :value.sync="$v.form.groupId.$model"
                                :options="getGroups"
                                invalid-feedback="반드시 선택해야 합니다."
                            />
                        </CCol>
                        <CCol sm="4" lg="2">
                            <CSelect
                                :lazy="false"
                                :is-valid="checkIfValidate('roleId')"
                                :value.sync="$v.form.roleId.$model"
                                :options="getRoles"
                                invalid-feedback="반드시 선택해야 합니다."
                            />
                        </CCol>
                    </CRow>
                </CForm>
                <CRow style="margin-top: -5px">
                    <CCol sm="12" class="text-right">
                        <CButton size="sm" color="primary" :disabled="!isValid" @click="createUser"
                            ><fa-icon :icon="['far', 'save']" /><span class="ml-1">저장</span></CButton
                        >
                        <CButton size="sm" color="dark" @click="reset"
                            ><fa-icon icon="undo" /><span class="ml-1">리셋</span></CButton
                        >
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
        <CCard>
            <CCardBody>
                <CDataTable
                    :items="mixedUsers"
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
                    <template #details="{ item }">
                        <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
                            <UserInfo
                                :user="copiedSelectedUser"
                                :is-toggled="selectedUser._toggled"
                                @update="handleUserUpdateEvent"
                                @delete="handleUserDeleteEvent"
                            />
                        </CCollapse>
                    </template>
                </CDataTable>
            </CCardBody>
        </CCard>
        <CustomModal
            type="info"
            modal-title="확인"
            modal-content="유저 정보를 수정하시겠습니까?"
            :show-modal="showUpdateConfirmDialog"
            @close="showUpdateConfirmDialog = false"
            @confirm="updateUser"
        />
        <CustomModal
            type="danger"
            modal-title="주의"
            modal-content="유저 정보를 삭제하시겠습니까?"
            :show-modal="showDeleteConfirmDialog"
            @close="showDeleteConfirmDialog = false"
            @confirm="deleteUser"
        />
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, sameAs } from "vuelidate/lib/validators";

export default {
    name: "User",
    mixins: [validationMixin],
    data() {
        return {
            users: [],
            fields: [
                { key: "userId", label: "ID" },
                { key: "userName", label: "Name" },
                { key: "roleName", label: "Role" },
                { key: "groupName", label: "Group" },
            ],
            collapseDuration: 300,
            selectedUser: {},
            targetUser: {},
            form: this.getEmptyForm(),
            switchTxt: {
                labelOn: "yes",
                labelOff: "no",
            },
            showUpdateConfirmDialog: false,
            showDeleteConfirmDialog: false,
        };
    },
    computed: {
        mixedUsers() {
            return this.users.map((user) => {
                if (!user.groupId) return user;
                const role = this.$store.state.role.roles.find((role) => {
                    return role.id === user.roleId;
                });
                const group = this.$store.state.group.groups.find((group) => {
                    return group.id === user.groupId;
                });
                console.log(role);
                return Object.assign({}, user, {
                    groupName: group ? group.name : "",
                    roleName: role ? role.name : "",
                    _toggled: false,
                });
            });
        },
        getGroups() {
            return [{ value: null, label: "Select Group" }].concat(
                this.$store.state.group.groups.map((group) => {
                    return { value: group.id, label: group.name };
                })
            );
        },
        getRoles() {
            return [{ value: null, label: "Select Role" }].concat(
                this.$store.state.role.roles.map((role) => {
                    return { value: role.id, label: role.roleId };
                })
            );
        },
        copiedSelectedUser() {
            const copiedUser = Object.assign({}, this.selectedUser);
            return copiedUser;
        },
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
    },
    created() {
        this.$axios.get("/api/user").then((response) => {
            if (response.status === 200) {
                this.users = response.data;
            }
        });
    },
    methods: {
        rowClicked(item, index, column, e) {
            if (this.selectedUser && item.id !== this.selectedUser.id) {
                this.selectedUser._toggled = false;
            }
            item._toggled = !item._toggled;
            this.selectedUser = item;
        },
        reset() {
            this.form = this.getEmptyForm();
            this.$v.$reset();
        },
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },
        formString() {
            return JSON.stringify(this.form, null, 4);
        },
        createUser() {
            this.$axios
                .post("/api/user", this.form)
                .then((response) => {
                    if (response.status === 200) {
                        this.users.unshift(response.data);
                        // this.users.push(response.data);
                        this.reset();
                    }
                })
                .catch((response) => {
                    // eslint-disable-next-line no-console
                    console.error(response);
                });
        },
        updateUser() {
            this.showUpdateConfirmDialog = false;
            this.selectedUser._toggled = false;
            this.$axios
                .put("/api/user/" + this.targetUser.id, this.targetUser)
                .then((response) => {
                    if (response.status === 200) {
                        const receivedUser = response.data;
                        const index = this.users.findIndex((_user) => _user.id === receivedUser.id);
                        if (index >= 0) {
                            this.users.splice(index, 1, receivedUser);
                        }
                    }
                })
                .finally(() => {
                    this.targetUser = {};
                });
        },
        deleteUser() {
            this.showDeleteConfirmDialog = false;
            this.$axios
                .delete("/api/user/" + this.targetUser.id)
                .then((response) => {
                    if (response.status === 200) {
                        // this.users = this.users.filter((user) => user.id !== this.selectedUser.id);
                        const index = this.users.findIndex((_user) => _user.id === this.targetUser.id);
                        this.users.splice(index, 1);
                    }
                })
                .finally(() => {
                    this.targetUser = {};
                });
        },
        handleUserUpdateEvent(user) {
            this.showUpdateConfirmDialog = true;
            this.targetUser = user;
        },
        handleUserDeleteEvent(user) {
            this.showDeleteConfirmDialog = true;
            this.targetUser = user;
        },
        getEmptyForm() {
            return {
                userId: null,
                userName: null,
                password: null,
                password2: null,
                groupId: null,
                roleId: null,
                active: true,
            };
        },
        handleSwitchUpdate(item) {
            // forceEval, evaluator, active
            this.$axios
                .put("/api/user/" + item.id, item)
                .then((response) => {
                    if (response.status === 200) {
                        // eslint-disable-next-line no-console
                        // console.log(response.data);
                    } else {
                        // eslint-disable-next-line no-console
                        console.error(response);
                    }
                })
                .catch((response) => {
                    // eslint-disable-next-line no-console
                    console.error(response);
                });
        },
    },
    validations: {
        form: {
            userId: {
                required,
                minLength: minLength(4),
                maxLength: maxLength(32),
            },
            userName: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(64),
            },
            password: {
                required,
            },
            password2: {
                required,
                sameAsPassword: sameAs("password"),
            },
            groupId: {
                required,
            },
            roleId: {
                required,
            },
        },
    },
};
</script>

<style scoped></style>
