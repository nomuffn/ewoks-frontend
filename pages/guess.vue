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

        <!-- <InputNumber v-model="one" />
        <InputNumber v-model="two" />
        <p>
            {{
                Math.round(10 * Math.max(1 - Math.abs(one - two) / one, 0) ** 2)
            }}
        </p> -->

        <div class="content">
            <div class="flex flex-col mt-4 items-center flex-grow">
                <div class="my-4 font-bold text-2xl">
                    Current run: {{ points }}pts ({{ guesses }} guesses)
                </div>
                <template v-if="loading">
                    <Loading />
                </template>
                <template v-else-if="!showResult">
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
                        v-model="rankGuess"
                        placeholder="Guess the rank"
                        class="my-4"
                    />

                    <Dropdown
                        v-model="hmdGuess"
                        :options="hmds"
                        optionLabel="value"
                        placeholder="Guess the hardware"
                        class="mb-4"
                    />

                    <Button
                        label="Submit"
                        :disabled="!hmdGuess || !rankGuess"
                        @click="submit"
                    />
                    <Button
                        style="margin-top: 1rem"
                        label="Skip"
                        @click="next"
                    />
                </template>
                <template v-else>
                    <div class="flex flex-col mt-4">
                        <p class="self-center font-bold text-2xl">Result</p>

                        <div class="my-4 flex">
                            <img
                                class="rounded-full w-24"
                                :src="playerData.player.profilePicture"
                            />
                            <div class="flex flex-col ml-4 justify-center">
                                <p class="font-bold text-2xl">
                                    {{ playerData.player.name }}
                                </p>
                                <a
                                    :href="
                                        `https://scoresaber.com/u/${playerData.player.id}`
                                    "
                                    target="_blank"
                                    >Scoresaber</a
                                >
                                <a
                                    :href="
                                        `https://twitch.tv/${score.twitchName}`
                                    "
                                    target="_blank"
                                    >Twitch</a
                                >
                            </div>
                        </div>

                        <div class="my-4 flex flex-col">
                            <span
                                >Gussed rank:
                                <strong>#{{ rankGuess }}</strong></span
                            >
                            <span
                                >Actual rank:
                                <strong>#{{ actualRank }}</strong></span
                            >
                            <p class="font-bold">
                                => +{{ rankGuessPoints }} points
                            </p>
                        </div>

                        <div class="my-4 flex flex-col">
                            <span
                                >Gussed hmd:
                                <strong>{{
                                    hmdGuess && hmdGuess.value
                                }}</strong></span
                            >
                            <span
                                >Actual hmd:
                                <strong>{{ actualHMD }}</strong></span
                            >
                            <p class="font-bold">
                                => +{{ hmdGuessPoints }} points
                            </p>
                        </div>
                    </div>

                    <Button label="Next" @click="next" />
                </template>
            </div>
        </div>
        <Toast />
    </div>
</template>

<script>
const HMDs = {
    0: 'Unknown',
    1: 'Oculus Rift CV1',
    2: 'Vive',
    4: 'Vive Pro',
    8: 'Windows Mixed Reality',
    16: 'Rift S',
    32: 'Oculus Quest',
    64: 'Valve Index',
    128: 'Vive Cosmos',
}

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
            points: 0,
            score: null,
            hmdGuess: null,
            rankGuess: null,
            loading: true,
            showResult: false,
            playerData: null,
            guesses: 0,
            one: 0,
            two: 0,

            hmds: [
                { value: 'Dont know :(' },
                ...Object.values(HMDs).map(entry => {
                    return { value: entry }
                }),
            ],
        }
    },

    methods: {
        async load() {
            this.loading = true
            this.score = await this.$mapttsApi.$get('randomScore')
            this.loading = false
        },
        async submit() {
            this.loading = true

            // TODO save hmd in randomScore in the future, this is kinda shit but laziness ftw
            try {
                this.playerData = await this.$mapttsApi.$get(
                    `randomScore/${this.score.scoresaberId}`,
                )
            } catch (e) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Something went wrong :( Skipping this one',
                    life: 3000,
                })
                return this.next()
            }

            this.points += this.rankGuessPoints + this.hmdGuessPoints

            this.loading = false
            this.showResult = true
        },
        next() {
            this.rankGuess = null
            this.hmdGuess = null
            this.showResult = false
            this.guesses++
            this.load()
        },
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
        actualRank() {
            return this.playerData?.player?.rank
        },
        actualHMD() {
            return HMDs[this.playerData?.scores[0]?.score?.hmd]
        },
        rankGuessPoints() {
            const guess = this.rankGuess
            const rank = this.actualRank

            return Math.round(
                10 * Math.max(1 - Math.abs(rank - guess) / rank, 0) ** 2,
            )
        },
        hmdGuessPoints() {
            if (this.hmdGuess?.value == this.actualHMD) return 2
            return 0
        },
    },
}
</script>

<style lang="scss" scoped>
.guess {
}
</style>
