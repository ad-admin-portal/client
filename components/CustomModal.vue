<template>
    <CModal :title="modalTitle" :color="type" :show="showModal">
        <template #header>
            <h6 class="modal-title">{{ modalTitle }}</h6>
            <CButtonClose class="text-white" @click="$emit('close')" />
        </template>
        {{ modalContent }}
        <template #footer>
            <CButton size="sm" color="success" @click="$emit('confirm')">
                <CIcon name="cil-check-circle" />
                <span class="align-middle ml-1">확인</span>
            </CButton>
            <CButton size="sm" color="dark" @click="$emit('close')">
                <CIcon name="cil-ban" />
                <span class="align-middle ml-1">취소</span>
            </CButton>
        </template>
    </CModal>
</template>
<script>
export default {
    props: {
        modalTitle: {
            type: String,
            default: "Title",
        },
        modalContent: {
            type: String,
            default: "Content",
        },
        showModal: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            default() {
                return "info";
            },
            validator: (value) => {
                return ["primary", "secondary", "success", "warning", "danger", "info", "dark"].includes(value);
            },
        },
    },
    data() {
        return {};
    },

    methods: {},
};
</script>

<style></style>
