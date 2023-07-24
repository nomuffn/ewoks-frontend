<template>
    <div class="newTaskModal modal-card" style="width: auto; min-width: 400px">
        <header class="modal-card-head">
            <p class="modal-card-title">Title</p>
        </header>
        <section class="modal-card-body"></section>
        <footer class="modal-card-foot">
            <Button label="Close" @click="$emit('close')" />
            <Button label="Save" @click="save" type="is-primary" />
        </footer>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {}
    },
    mounted() {},
    methods: {
        save() {},
    },
    watch: {},
    computed: {
        submitDisabled() {},
    },
}
</script>

<style lang="scss">
.editBlockModal {
    .modal-card-body {
        min-height: 25vh;
        min-width: 50vh;
        height: auto;
    }
    .modal-card-foot {
        justify-content: flex-end;
    }
}
</style>
