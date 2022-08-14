<template>
    <div class="guess">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Guessing game
                    </h2>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="flex flex-col mt-4 items-center flex-grow">
                <div class="my-4 font-bold text-2xl">
                    Points on this run: {{ points }}
                </div>

                <div v-if="score" class="twitch-embed">
                    <iframe
                        :src="
                            `https://player.twitch.tv/?parent=muffnlabs.de&video=${videoId}&${timestamp}`
                        "
                        height="720"
                        width="1280"
                    >
                    </iframe>
                </div>

                <InputNumber
                    v-model="rank"
                    placeholder="Guess the rank"
                    class="my-4"
                />

                <Dropdown
                    v-model="hmd"
                    :options="hmds"
                    optionLabel="value"
                    placeholder="Guess the hardware"
                    class="mb-4"
                />

                <Button label="Submit" @click="submit" />
            </div>
            <div v-if="result"></div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    watch: {
        page(newValue, oldValue) {
            this.loadScores()
            return null
        },
    },
    async mounted() {
        this.load()
    },
    data() {
        return {
            score: null,
            hmd: null,
            rank: null,
            loading: true,
            points: 0,

            hmds: [
                { value: 'Unknown' },
                { value: 'Oculus Rift CV1' },
                { value: 'Vive' },
                { value: 'Vive Pro' },
                { value: 'Windows Mixed Reality' },
                { value: 'Rift S' },
                { value: 'Oculus Quest' },
                { value: 'Valve Index' },
                { value: 'Vive Cosmos' },
            ],
        }
    },

    methods: {
        async load() {
            this.loading = true
            this.score = await this.$mapttsApi.$get('randomScore')

            this.loading = false
        },
        async submit() {},
    },
    computed: {
        videoId() {
            return this.score?.twitchUrl
                .split('https://www.twitch.tv/videos/')[1]
                .split('?')[0]
        },
        timestamp() {
            return this.score?.twitchUrl
                .split('https://www.twitch.tv/videos/')[1]
                .split('?')[1]
        },
    },
}
</script>

<style lang="scss" scoped>
.guess {
}
</style>
