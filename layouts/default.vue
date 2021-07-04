<template>
    <div>
        <div class="navbar">
            <h2 class="title">Ewoks</h2>
        </div>

        <vs-sidebar square v-model="active" open v-if="pages">
            <vs-sidebar-item
                v-for="page in pages.Tree"
                :key="page.page.id"
                :to="`/${page.page.Link}`"
                :id="`/${page.page.Link}`"
            >
                <template #icon>
                    <i :class="page.page.IconName"></i>
                </template>
                {{ page.page.Title }}
            </vs-sidebar-item>
        </vs-sidebar>

        <Nuxt keep-alive />

        <vs-button class="discord" primary gradient>
            <i class="bx bxl-discord bx-sm"></i>muffn#2345
        </vs-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: "",
            pages: null,
        };
    },
    async fetch() {
        this.pages = await this.$strapi.$structure.find();
    },
    async created() {
        this.active = this.$route.path;
    },
};
</script>

<style></style>
