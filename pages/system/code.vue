<template>
    <div>
        <CCard>
            <CCardBody>
                <CRow>
                    <CCol sm="4">
                        <CInput
                            type="text"
                            :lazy="false"
                            :is-valid="checkIfValidate('name')"
                            placeholder="Name"
                            :value.sync="$v.form.name.$model"
                            invalid-feedback="Name의 입력값은 4~32자 입니다.."
                        />
                    </CCol>
                    <CCol sm="4">
                        <CInput
                            type="text"
                            :lazy="false"
                            :is-valid="checkIfValidate('description')"
                            placeholder="Description"
                            :value.sync="$v.form.description.$model"
                            invalid-feedback="Description 의 입력값은 최대 512자 입니다."
                        />
                    </CCol>
                    <CCol sm="4">
                        <CSelect :value.sync="$v.form.parentId.$model" :options="getParentCodes" />
                    </CCol>
                </CRow>
                <CRow style="margin-top: -5px">
                    <CCol sm="12" class="text-right">
                        <CButton size="sm" color="primary" :disabled="!isValid" @click="createCode"
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
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="fixed-10"></th>
                            <th>Name</th>
                            <th>Description</th>
                            <th class="text-center" style="width: 50px">Enabled</th>
                            <th class="text-center" style="width: 130px">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="code in treeCodeData">
                            <code-table-row
                                :key="code.id"
                                :code="code"
                                @toggleChildren="toggleChildren"
                                @updateCode="readyToUpdate"
                                @editMode="toggleEditMode"
                                @enabledToggle="updateChildrenEnabled"
                                @deleteCode="readyToDelete"
                            />
                            <template v-if="code.hasChildren && code.showChildren">
                                <code-table-row
                                    v-for="child in code.children"
                                    :key="child.id"
                                    :code="child"
                                    :is-child="true"
                                    @updateCode="readyToUpdate"
                                    @editMode="toggleEditMode"
                                    @deleteCode="readyToDelete"
                                />
                            </template>
                        </template>
                    </tbody>
                </table>
            </CCardBody>
        </CCard>
        <CustomModal
            type="info"
            modal-title="확인"
            modal-content="코드 정보를 수정하시겠습니까?"
            :show-modal="showUpdateConfirmDialog"
            @close="showUpdateConfirmDialog = false"
            @confirm="updateCode"
        />
        <CustomModal
            type="warning"
            modal-title="확인"
            modal-content="코드 정보를 삭제하시겠습니까?"
            :show-modal="showDeleteConfirmDialog"
            @close="showDeleteConfirmDialog = false"
            @confirm="deleteCode"
        />
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
    name: "Code",
    mixins: [validationMixin],
    data() {
        return {
            codes: [],
            tempCode: {},
            showUpdateConfirmDialog: false,
            showDeleteConfirmDialog: false,
            form: this.getEmptyForm(),
        };
    },
    computed: {
        treeCodeData() {
            return this.codes
                .filter((_code) => _code.parentId === null)
                .map((parent) => {
                    parent.showChildren = true;
                    parent.children = this.codes.filter((child) => child.parentId === parent.id);
                    parent.hasChildren = parent.children.length > 0;
                    return parent;
                });
        },
        getParentCodes() {
            return [{ value: null, label: "Select Parent Code", disabled: true }].concat(
                this.codes
                    .filter((code) => code.parentId === null)
                    .map((code) => {
                        return { value: code.id, label: code.name };
                    })
            );
        },
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
    },
    created() {
        this.$axios
            .get("/api/code")
            .then((response) => {
                if (response.status === 200) {
                    this.codes = response.data.map((code) => {
                        return { ...code, rowEdit: false };
                    });
                }
            })
            .catch((response) => {
                // eslint-disable-next-line no-console
                console.error(response);
            });
    },
    methods: {
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },
        reset() {
            this.form = this.getEmptyForm();
            this.$v.$reset();
        },
        getEmptyForm() {
            return {
                id: null,
                name: null,
                description: null,
                parentId: null,
                active: true,
            };
        },
        createCode() {
            // eslint-disable-next-line no-console
            console.log(this.form);
            this.$axios.post("/api/code", this.form).then((response) => {
                if (response.status === 201) {
                    const receivedCode = response.data;
                    if (receivedCode.parentId) {
                        this.codes.push(receivedCode);
                        const parentCode = this.codes.find((code) => code.id === receivedCode.parentId);
                        if (parentCode) {
                            parentCode.hasChildren = true;
                            parentCode.showChildren = true;
                        }
                    } else {
                        this.codes.unshift(receivedCode);
                    }
                    this.reset();
                }
            });
        },
        toggleEditMode(code) {
            this.codes
                .filter((_code) => _code.id !== code.id)
                .forEach((code) => {
                    code.rowEdit = false;
                });
        },
        updateChildrenEnabled(code) {
            this.codes
                .filter((child) => child.parentId === code.id)
                .forEach((child) => {
                    child.enabled = code.enabled;
                });
        },
        readyToUpdate(code) {
            this.tempCode = code;
            this.showUpdateConfirmDialog = true;
        },
        updateCode() {
            this.showUpdateConfirmDialog = false;
            this.$axios.put("/api/code/" + this.tempCode.id, this.tempCode).then((response) => {
                if (response.status === 200) {
                    const receivedCode = response.data;
                    const index = this.codes.findIndex((code) => code.id === receivedCode.id);
                    if (index >= 0) {
                        this.codes.splice(index, 1, receivedCode);
                    }
                } else {
                    // eslint-disable-next-line no-console
                    console.error(response);
                }
            });
        },
        toggleChildren(code) {
            code.showChildren = !code.showChildren;
            this.$forceUpdate();
            // this.$set(code, "showChildren", !code.showChildren);
        },
        updateChildrenActive(code) {
            this.codes
                .filter((child) => child.parentId === code.id)
                .forEach((child) => {
                    child.active = code.active;
                });
        },
        readyToDelete(code) {
            this.tempCode = code;
            this.showDeleteConfirmDialog = true;
        },
        deleteCode() {
            this.showDeleteConfirmDialog = false;
            this.$axios.delete("/api/code/" + this.tempCode.id).then((response) => {
                if (response.status === 200) {
                    const index = this.codes.findIndex((code) => code.id === this.tempCode.id);
                    if (index >= 0) {
                        this.codes.splice(index, 1);
                    }
                } else {
                    // eslint-disable-next-line no-console
                    console.error(response);
                }
            });
        },
    },
    validations: {
        form: {
            name: {
                required,
                minLength: minLength(4),
                maxLength: maxLength(32),
            },
            description: {
                maxLength: maxLength(512),
            },
            parentId: {},
        },
    },
};
</script>

<style scoped>
</style>
