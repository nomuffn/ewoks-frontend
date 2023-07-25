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
                <p class="mb-1">Enter map</p>
                <p class="mb-1 opacity-75">
                    hash, bsr code, discord link ending on .zip
                </p>
                <div class="flex">
                    <InputText
                        type="text"
                        v-model="job.songHash"
                        placeholder="Map"
                        class="flex-1"
                    />
                    <my-button
                        nomargin
                        label="Fetch"
                        @click="fetchMap"
                        :disabled="!job.songHash.length"
                    />
                </div>
                <p class="mt-2 mb-1">Mode</p>
                <Dropdown
                    v-model="job.mode"
                    :options="computedModes"
                    placeholder="Mode"
                    :editable="true"
                    appendTo="body"
                />
                <p class="mt-2 mb-1">Difficulty</p>
                <Dropdown
                    v-model="job.diff"
                    :options="diffs"
                    placeholder="Difficulty"
                    :editable="true"
                    appendTo="body"
                />

                <div class="mt-4">
                    <InlineMessage class="w-full" severity="warn"
                        >V3, NE and ME not supported!</InlineMessage
                    >
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <Button
                label="Close"
                class="p-button-secondary"
                @click="$emit('close')"
                :disabled="loading"
            />
            <Button
                style="margin-left: auto"
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
            modes: [],
            loading: false,
        }
    },
    created() {},
    methods: {
        async fetchMap() {
            const type = this.isBsrCode ? 'id' : 'hash'

            const map = (
                await this.$http.get(
                    `https://api.beatsaver.com/maps/${type}/${this.job.songHash}`,
                )
            ).data

            this.job.songHash = map.versions[0].hash

            let modes = {}
            map.versions[0].diffs.forEach((i) => {
                if (!modes[i.characteristic]) {
                    modes[i.characteristic] = map.versions[0].diffs
                        .filter((ii) => ii.characteristic == i.characteristic)
                        .map((ii) => ii.difficulty)
                }
            })
            this.modes = modes
            this.job.mode = this.computedModes[0]
        },
        async submit() {
            if (
                this.job.songHash.includes('http') &&
                !this.job.songHash.includes('https://cdn.discordapp.com/')
            )
                return this.$toast.add({
                    severity: 'error',
                    summary: `Only links from discord are allowed`,
                    life: 3000,
                })

            if (this.isBsrCode)
                return this.$toast.add({
                    severity: 'error',
                    summary: `You entered a bsr code, please click fetch`,
                    life: 3000,
                })

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
                    summary: `${e.response.statusText} ${e.response.status}`,
                    life: 3000,
                })
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
        isBsrCode() {
            return this.job.songHash.length > 0 && this.job.songHash.length <= 6
        },
        computedModes() {
            return Object.keys(this.modes)
        },
        diffs() {
            return this.modes[this.job.mode]
        },
    },
}
</script>

<style lang="scss">
</style>
