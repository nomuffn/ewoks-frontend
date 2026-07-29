<template>
    <div class="createJobModal bg-[#18191c] border border-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-auto space-y-6 text-gray-100 font-sans">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl">
                    <i class="bx bx-plus-circle"></i>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-100">Create Replay Request</h3>
                    <p class="text-xs text-gray-400">Analyze Beat Saber replay accuracy & mistakes</p>
                </div>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
                <i class="bx bx-x text-xl"></i>
            </button>
        </div>

        <!-- Form Body -->
        <div class="space-y-4">
            <!-- Map Identifier -->
            <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-300 flex items-center justify-between">
                    <span>Map Identifier</span>
                    <span class="text-[11px] text-gray-400 font-normal">Hash, BSR code, or Discord .zip link</span>
                </label>
                <div class="flex items-center gap-2">
                    <input
                        type="text"
                        v-model="job.songHash"
                        placeholder="e.g. 25f0c, hash, or zip URL"
                        class="flex-1 bg-[#121315] text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
                    />
                    <button
                        v-if="showFetch"
                        @click="fetchMap"
                        :disabled="!job.songHash.length"
                        class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
                    >
                        <i class="bx bx-search text-base"></i>
                        <span>Fetch</span>
                    </button>
                </div>
            </div>

            <!-- Mode Selection -->
            <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-300 block">Game Mode</label>
                <Dropdown
                    v-model="job.mode"
                    :options="computedModes"
                    placeholder="Select Mode"
                    :editable="true"
                    appendTo="body"
                    class="w-full p-inputtext-sm"
                />
            </div>

            <!-- Difficulty Selection -->
            <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-300 block">Difficulty</label>
                <Dropdown
                    v-model="job.diff"
                    :options="diffs"
                    placeholder="Select Difficulty"
                    :editable="true"
                    appendTo="body"
                    class="w-full p-inputtext-sm"
                />
            </div>

            <!-- Warning Alert -->
            <div class="relative overflow-hidden rounded-xl border-2 border-red-500 bg-red-950 p-4 shadow-2xl shadow-red-500/40">
                <!-- Diagonal danger tape stripes -->
                <div class="pointer-events-none absolute inset-0 opacity-10" style="background: repeating-linear-gradient(45deg, #ff0000 0px, #ff0000 10px, transparent 10px, transparent 20px);"></div>
                <!-- Pulsing glow ring -->
                <div class="pointer-events-none absolute inset-0 rounded-xl animate-pulse" style="box-shadow: inset 0 0 20px rgba(239,68,68,0.4);"></div>

                <div class="relative flex items-start gap-3">
                    <div class="shrink-0 text-3xl animate-bounce">☠️</div>
                    <div class="space-y-2">
                        <p class="text-base font-black uppercase tracking-widest text-red-400" style="text-shadow: 0 0 12px rgba(239,68,68,0.9);">
                            🚨 ATTENTION, BELOVED USER 🚨
                        </p>
                        <p class="text-sm font-bold text-red-200 leading-snug">
                            Submitting a <span class="text-red-400 font-black line-through">cursed</span> <span class="text-red-400 font-black">V3 map</span>, <span class="text-red-400 font-black">Noodle Extensions</span>, or <span class="text-red-400 font-black">Mapping Extensions</span> will cause an immediate,
                            catastrophic, <span class="underline decoration-wavy decoration-red-400">violent</span> failure. The server will cry. The database will weep.
                            You may experience <strong>mild to severe death</strong>. Side effects include job errors, existential dread, and regretting your life choices.
                        </p>
                        <p class="text-xs font-semibold text-red-400/80 italic">
                            † muffnlabs accepts no liability for user demise resulting from unsupported map submissions. Please update your will before proceeding.
                        </p>
                    </div>
                    <div class="shrink-0 text-3xl animate-bounce" style="animation-delay: 150ms;">☠️</div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 border-t border-gray-800 pt-4">
            <button
                @click="$emit('close')"
                :disabled="loading"
                class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-xs transition-colors"
            >
                Cancel
            </button>
            <button
                @click="submit()"
                :disabled="submitReady || loading"
                class="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
                <ProgressSpinner v-if="loading" style="width: 16px; height: 16px" strokeWidth="4" />
                <span v-else>Submit Request</span>
            </button>
        </div>
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
                mode: 'Standard',
                diff: 'ExpertPlus',
            },
            modes: [],
            loading: false,
        }
    },
    created() {},
    methods: {
        async fetchMap() {
            try {
                const type = this.isBsrCode ? 'id' : 'hash'
                const map = (await this.$http.get(`https://api.beatsaver.com/maps/${type}/${this.job.songHash}`)).data

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
            } catch (e) {
                return this.$toast.add({
                    severity: 'error',
                    summary: `Couldn't find map`,
                    life: 3000,
                })
            }
        },
        async submit() {
            if (this.job.songHash.includes('http') && !this.job.songHash.includes('https://cdn.discordapp.com/'))
                return this.$toast.add({
                    severity: 'error',
                    summary: `Invalid custom map zip link! Only discord attachments ending on .zip supported!`,
                    life: 3000,
                })

            this.loading = true
            try {
                let headers = {
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                }

                await this.$crrApi.post('create_job', this.job, headers)
                this.$toast.add({
                    severity: 'success',
                    summary: `CyberRamen job created!`,
                    life: 3000,
                })
                this.$emit('close')
            } catch (e) {
                this.$toast.add({
                    severity: 'error',
                    summary: `Job creation failed`,
                    life: 3000,
                })
            } finally {
                this.loading = false
            }
        },
    },
    computed: {
        computedModes() {
            if (Object.keys(this.modes).length) return Object.keys(this.modes)
            return ['Standard', 'OneSaber', 'NoArrows', '360Degree', '90Degree', 'Lightshow', 'Lawless']
        },
        diffs() {
            if (this.modes[this.job.mode]) return this.modes[this.job.mode]
            return ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus']
        },
        isBsrCode() {
            return this.job.songHash.length < 7
        },
        showFetch() {
            return (
                (this.job.songHash.length > 0 && this.job.songHash.length < 8) ||
                this.job.songHash.length == 40
            )
        },
        submitReady() {
            return !this.job.songHash.length
        },
    },
}
</script>

<style lang="scss" scoped>
.createJobModal {
    width: 100%;
}
</style>
