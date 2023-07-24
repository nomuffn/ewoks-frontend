<template>
    <div
        class="createJobModal modal-card"
        style="width: auto; min-width: 400px"
    >
        <header class="modal-card-head">
            <p class="modal-card-title">Create new job</p>
        </header>
        <section class="modal-card-body">
            <div class="flex flex-col">
                <p>Map hash</p>
                <InputText
                    type="text"
                    v-model="job.songHash"
                    placeholder="Map hash"
                    class="mt-1 mb-2"
                />
                <p>Mode</p>
                <InputText
                    type="text"
                    v-model="job.mode"
                    placeholder="Mode"
                    class="mt-1 mb-2"
                />
                <p>Difficulty</p>
                <InputText
                    type="text"
                    v-model="job.diff"
                    placeholder="Diff"
                    class="mt-1 mb-2"
                />
            </div>
        </section>
        <footer class="modal-card-foot">
            <Button
                label="Close"
                class="mx-2 ml-auto p-button-secondary"
                @click="$emit('close')"
                :disabled="loading"
            />
            <Button
                label="Submit"
                @click="submit()"
                :disabled="submitReady || loading"
            />
        </footer>
    </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
    props: {},
    data() {
        return {
            job: {
                songHash: '',
                mode: 'Standard', // TODO Dropdown
                diff: 'ExpertPlus', // TODO Dropdown
            },
            loading: false,
        }
    },
    created() {},
    methods: {
        async load() {},
        async submit() {
            this.loading = true
            try {
                const result = await this.$crrApi.post('job', this.job, {
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                })
                this.$toast.add({
                    severity: 'success',
                    summary: 'Job created jupijej',
                    life: 3000,
                })
            } catch (e) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Something went wrong :(',
                    life: 3000,
                })
                console.log(e)
            } finally {
                this.loading = false
                this.$emit('close')
            }
        },
    },
    computed: {
        submitReady() {
            return (
                Object.values(this.job).filter((i) => i.length > 0).length != 3
            )
        },
    },
}
</script>

<style lang="scss">
</style>
