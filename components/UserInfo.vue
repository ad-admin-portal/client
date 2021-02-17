<template>
    <div>
        <!-- <CCardBody class="shadow p-3 m-2 bg-white rounded"> -->
        <CCardBody>
            <CForm>
                <CRow>
                    <CCol sm="4">
                        <CInput
                            label="User Name"
                            placeholder="User Name"
                            :lazy="false"
                            :is-valid="checkIfValidate('userName')"
                            :value.sync="$v.form.userName.$model"
                            invalid-feedback="User Name의 입력값은 2~64자 입니다."
                            @click.stop=""
                        />
                    </CCol>
                    <CCol sm="4">
                        <CSelect
                            label="Group"
                            :lazy="false"
                            :is-valid="checkIfValidate('groupId')"
                            :value.sync="$v.form.groupId.$model"
                            :options="getGroups"
                            invalid-feedback="반드시 선택해야 합니다."
                            @click.stop=""
                        />
                    </CCol>
                    <CCol sm="4">
                        <CSelect
                            label="Role"
                            :lazy="false"
                            :is-valid="checkIfValidate('roleId')"
                            :value.sync="$v.form.roleId.$model"
                            :options="getRoles"
                            invalid-feedback="반드시 선택해야 합니다."
                            @click.stop=""
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="4">
                        <CInput
                            type="password"
                            placeholder="Password"
                            :lazy="false"
                            :is-valid="checkIfValidate('password')"
                            :value.sync="$v.form.password.$model"
                            @click.stop=""
                        />
                    </CCol>
                    <CCol sm="4">
                        <CInput
                            type="password"
                            placeholder="Confirm Password"
                            :lazy="false"
                            :is-valid="checkIfValidate('password2')"
                            :value.sync="$v.form.password2.$model"
                            invalid-feedback="Password와 같은 값을 입력해주세요."
                            @click.stop=""
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12" class="text-right">
                        <CButton size="sm" color="primary" :disabled="!isValid || !isDirty" @click.stop="handleUpdate">
                            <fa-icon :icon="['far', 'edit']" />
                            <span class="ml-1">수정</span>
                        </CButton>
                        <CButton size="sm" color="danger" @click.stop="handleDelete">
                            <fa-icon :icon="['far', 'trash-alt']" />
                            <span class="ml-1">삭제</span>
                        </CButton>
                    </CCol>
                </CRow>
            </CForm>
        </CCardBody>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, sameAs } from "vuelidate/lib/validators";

export default {
    mixins: [validationMixin],
    props: ["user", "isToggled"],
    data() {
        return {
            form: null,
        };
    },
    computed: {
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
                    return { value: role.id, label: role.name };
                })
            );
        },
        isValid() {
            // eslint-disable-next-line no-console
            // console.log("is valid " + !this.$v.form.$invalid);
            return !this.$v.form.$invalid;
        },
        isDirty() {
            // eslint-disable-next-line no-console
            // console.log("is dirty " + this.$v.form.$anyDirty);
            return this.$v.form.$anyDirty;
        },
    },
    watch: {
        user() {
            this.form = this.normalizedUser();
        },
        isToggled() {
            if (!this.isToggled) {
                this.$v.$reset();
            }
        },
    },
    methods: {
        handleUpdate() {
            this.$emit("update", this.form);
            this.$v.$reset();
        },
        handleDelete() {
            this.$emit("delete", this.form);
            this.$v.$reset();
        },
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },
        normalizedUser() {
            return {
                id: this.user.id,
                userId: this.user.userId,
                userName: this.user.userName,
                password: null,
                password2: null,
                groupId: this.user.groupId,
                roleId: this.user.roleId,
            };
        },
    },
    validations: {
        form: {
            userName: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(64),
            },
            password: {},
            password2: {
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

<style></style>
