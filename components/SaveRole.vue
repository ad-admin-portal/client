<template>
    <div>
        <CForm>
            <CRow>
                <CCol md="3">
                    <CInput
                        :lazy="false"
                        :value.sync="$v.form.roleId.$model"
                        placeholder="Role ID"
                        :is-valid="checkIfValid('roleId')"
                        autocomplete="given-name"
                        invalid-feedback="This is a required field and must be at least 2 characters"
                    />
                </CCol>
                <CCol md="3">
                    <CInput
                        :value.sync="$v.form.roleName.$model"
                        :lazy="false"
                        :is-valid="checkIfValid('roleName')"
                        placeholder="Role Name"
                        autocomplete="family-name"
                        invalid-feedback="This is a required field and must be at least 1 character"
                    />
                </CCol>
                <CCol md="6">
                    <CInput
                        :value.sync="$v.form.roleDescription.$model"
                        :lazy="false"
                        placeholder="Role Description"
                        autocomplete="family-name"
                        invalid-feedback="This is a required field and must be at least 1 character"
                    />
                </CCol>
            </CRow>
        </CForm>
        <CRow style="margin-top: -5px">
            <CCol sm="12" class="text-right">
                <CButton size="sm" color="primary" :disabled="!isValid || submitted" @click="submit"
                    ><fa-icon :icon="['far', 'save']" /><span class="ml-1">저장</span></CButton
                >
                <CButton size="sm" color="dark" @click="reset"
                    ><fa-icon icon="undo" /><span class="ml-1">리셋</span></CButton
                >
            </CCol>
        </CRow>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
    name: "SaveRole",
    mixins: [validationMixin],
    data() {
        return {
            form: this.getEmptyForm(),
            submitted: false,
        };
    },
    computed: {
        // formString() {
        //     return JSON.stringify(this.form, null, 4);
        // },
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
    },
    created() {
        this.$nuxt.$on("reset-role", () => {
            this.reset();
        });
    },
    methods: {
        checkIfValid(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },

        submit() {
            if (this.isValid) {
                // eslint-disable-next-line no-console
                // console.log(this.formString);
                this.$axios.post("/api/system/role", this.form).then((response) => {
                    if (response.status === 200) {
                        this.$nuxt.$emit("update-role", response.data);
                    }
                });
            }
        },

        validate() {
            this.$v.$touch();
        },

        reset() {
            this.form = this.getEmptyForm();
            this.submitted = false;
            this.$v.$reset();
        },

        getEmptyForm() {
            return {
                roleId: "",
                roleName: "",
                roleDescription: "",
            };
        },
    },
    validations: {
        form: {
            roleId: {
                required,
                minLength: minLength(5),
                maxLength: maxLength(100),
                isRoleId: (value) => {
                    return "ROLE_".includes(value) !== -1;
                },
            },
            roleName: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(100),
            },
            roleDescription: {},
        },
    },
};
</script>

<style>
</style>