<template>
    <div class="jobViewModal modal-card" style="width: auto; min-width: 400px; max-width: 700px">
        <header class="modal-card-head">
            <p class="modal-card-title">Job details</p>
        </header>
        <section class="modal-card-body">
            <div v-for="(attribute, index) of job" :key="index" class="flex flex-col my-2">
                <p class="font-bold">
                    {{ attribute[0] }}
                </p>
                <p style="margin-top: 0">
                    {{ attribute[1] || 'n/a' }}
                </p>
            </div>
        </section>
        <footer class="modal-card-foot">
            <Button label="Aight" class="ml-auto" @click="$emit('close')" />
        </footer>
    </div>
</template>

<script>
export default {
    props: ['job'],
    data() {
        return {}
    },
    created() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
</style>
