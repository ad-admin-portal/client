<template>
    <CCard>
        <CCardBody>
            <tree ref="tree" :data="treeData" :options="treeOptions" @node:clicked="selectNode">
                <span slot-scope="{ node }" class="tree-text">
                    <div class="node-text">
                        <template v-if="node.data.type === 'category'">
                            <fa-icon
                                v-if="node.children.length > 0 && node.states.expanded"
                                :icon="['far', 'folder-open']"
                            />
                            <fa-icon v-else :icon="['far', 'folder']" />
                        </template>
                        <fa-icon v-else :icon="['fas', 'archive']" />
                        {{ node.text }}
                    </div>
                </span>
            </tree>
        </CCardBody>
    </CCard>
</template>

<script>
import LiquorTree from "liquor-tree";
export default {
    name: "ProductTree",
    components: {
        tree: LiquorTree,
    },
    data() {
        return {
            treeOptions: {
                parentSelect: true,
                checkbox: false,
                dnd: false,
                multiple: false,
            },
            treeData: [],
            selectedNode: {},
        };
    },
    created() {
        this.$axios
            .get("/api/category")
            .then((response) => {
                if (response.status === 200) {
                    this.categories = response.data;
                    this.categories.forEach((category) => {
                        const parent = this.findNode(category.parentId, "category");
                        if (parent) {
                            this.$refs.tree.append(parent, {
                                text: category.categoryName,
                                data: { ...category, type: "category" },
                                state: { expanded: true, selectable: false },
                            });
                            parent.expand();
                        } else {
                            this.$refs.tree.append({
                                text: category.categoryName,
                                data: { ...category, type: "category" },
                                state: { expanded: true, selectable: false },
                            });
                        }
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.error(response);
                }
            })
            .then(() => {
                this.$axios.get("/api/product").then((response) => {
                    if (response.status === 200) {
                        this.products = response.data.map((product) => {
                            const category = this.categories.find((category) => category.id === product.insuranceType);
                            const parent = response.data.find((parent) => parent.id === product.parentId);
                            let parentName = "";
                            if (parent) {
                                parentName = parent.productName;
                            }
                            return { ...product, insuranceName: category.categoryName, parentName };
                        });
                        this.products.forEach((product) => {
                            const parent = this.findNode(product.insuranceType, "category");
                            if (parent) {
                                this.$refs.tree.append(parent, {
                                    text: product.productName,
                                    data: { ...product, type: "product" },
                                });
                                // parent.expand();
                            }
                        });
                    }
                });
            })
            .catch((response) => {
                // eslint-disable-next-line no-console
                console.error(response);
            });
    },
    methods: {
        findNode(id, type) {
            const selection = this.$refs.tree.find({ data: { id, type } });
            if (selection.length > 0) return selection[0];
            return null;
        },
        selectNode(node) {
            this.selectedNode = node.data;
            this.$emit("selectNode", this.selectedNode);
        },
    },
};
</script>

<style>
</style>