<template>
    <tr>
        <td class="fixed-10">
            <template v-if="code.hasChildren">
                <template v-if="code.showChildren">
                    <span style="cursor: pointer" @click.stop="toggleChildren(code)">
                        <CIcon name="cil-minus" />
                    </span>
                </template>
                <template v-else>
                    <span style="cursor: pointer" @click.stop="toggleChildren(code)">
                        <CIcon name="cil-plus" />
                    </span>
                </template>
            </template>
        </td>
        <td :class="{ indent: isChild }">
            <template v-if="code.rowEdit">
                <InputText
                    ref="codeNameTextField"
                    v-model.trim="$v.form.name.$model"
                    class="form-control"
                    :class="{ 'p-invalid': !checkIfValidate('name') }"
                />
                <div v-if="!$v.form.name.required" class="p-error">Field is required</div>
                <div v-if="!$v.form.name.minLength" class="p-error">
                    Name must have at least
                    {{ $v.form.name.$params.minLength.min }} letters.
                </div>
                <div v-if="!$v.form.name.maxLength" class="p-error">
                    Name must have at most
                    {{ $v.form.name.$params.maxLength.max }} letters.
                </div>
            </template>
            <template v-else>
                {{ code.name }}
            </template>
        </td>
        <td>
            <template v-if="code.rowEdit">
                <div class="p-field">
                    <InputText
                        v-model.trim="$v.form.description.$model"
                        class="form-control"
                        :class="{ 'p-invalid': !checkIfValidate('description') }"
                    />
                    <div v-if="!$v.form.description.maxLength" class="p-error">
                        Name must have at most
                        {{ $v.form.description.$params.maxLength.max }} letters.
                    </div>
                </div>
            </template>
            <template v-else>
                {{ code.description }}
            </template>
        </td>
        <td class="text-center">
            <CSwitch
                color="success"
                shape="pill"
                :checked.sync="code.enabled"
                v-bind="switchTxt"
                @update:checked="handleSwitchUpdate(code)"
            />
        </td>
        <td class="text-center">
            <template v-if="code.rowEdit">
                <CButton size="sm" color="primary" :disabled="!isValid || !isDirty" @click.stop="updateCode"
                    ><fa-icon :icon="['far', 'save']" />
                </CButton>
                <CButton size="sm" color="dark" @click.stop="toReadMode(code)"
                    ><fa-icon :icon="['fas', 'undo']" />
                </CButton>
                <CButton size="sm" color="danger" @click.stop="deleteCode">
                    <fa-icon :icon="['far', 'trash-alt']" />
                </CButton>
            </template>
            <template v-else>
                <CButton size="sm" color="secondary" @click.stop="toEditMode(code)"
                    ><fa-icon :icon="['far', 'edit']"
                /></CButton>
            </template>
        </td>
    </tr>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
    mixins: [validationMixin],
    props: { code: Object, isChild: Boolean },
    data() {
        return {
            switchTxt: {
                labelOn: "yes",
                labelOff: "no",
            },
            form: {},
        };
    },
    computed: {
        isValid() {
            return !this.$v.form.$invalid;
        },
        isDirty() {
            return this.$v.form.$anyDirty;
        },
    },
    methods: {
        checkIfValidate(fieldName) {
            const field = this.$v.form[fieldName];
            if (!field.$dirty) {
                return true;
            }
            return !(field.$invalid || field.$model === "");
        },
        toggleChildren(code) {
            // eslint-disable-next-line no-console
            console.log(code.showChildren);
            this.$emit("toggleChildren", code);
        },
        handleSwitchUpdate(code) {
            this.$axios
                .put(`/api/code/${code.id}/enabled/${code.enabled}`)
                .then((response) => {
                    if (response.status === 200) {
                        this.$emit("enabledToggle", code);
                    }
                })
                .catch((response) => {
                    // eslint-disable-next-line no-console
                    console.error(response);
                });
        },
        toEditMode(code) {
            this.$emit("editMode", code);
            this.$set(code, "rowEdit", true);
            this.form = { ...code };
            this.$nextTick(() => {
                if (this.$refs.codeIdTextField) {
                    // eslint-disable-next-line no-console
                    // console.log(this.$refs.codeIdTextField);
                    this.$refs.codeIdTextField.$el.focus();
                }
            });
        },
        toReadMode(code) {
            this.$set(code, "rowEdit", false);
            this.$v.$reset();
        },
        updateCode() {
            this.$emit("updateCode", this.form);
            this.toReadMode(this.code);
        },
        deleteCode() {
            this.$emit("deleteCode", this.code);
            this.toReadMode(this.code);
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
        },
    },
};
</script>

<style scoped>
.fixed-10 {
    width: 10px !important;
}

.indent {
    padding-left: 32px;
}
</style>