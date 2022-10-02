<template>
    <div class="start">
        <div class="content">
            <div class="summary flex flex-col items-center">
                <h2 class="text-2xl font-bold">Ayo</h2>
                <span>
                    <p>i do stuff for beat saber</p>
                    <img style="margin-left: 10px" src="wicked.png" />
                </span>

                <div class="buttons">
                    <vs-button
                        style="flex: 1 1 100%"
                        href="https://beatsaver.com/profile/4284309"
                        blank
                        icon
                        class="yellow"
                    >
                        My maps
                    </vs-button>
                    <vs-button class="discord" icon border color="discord">
                        muffn#2345
                        <i class="bx bxl-discord"></i>
                    </vs-button>
                    <vs-button
                        href="https://twitter.com/nomuffn"
                        blank
                        icon
                        color="twitter"
                    >
                        @nomuffn
                        <i class="bx bxl-twitter"></i>
                    </vs-button>
                    <vs-button
                        href="https://www.twitch.tv/muffnnt"
                        blank
                        icon
                        color="twitch"
                    >
                        muffnnt
                        <i class="bx bxl-twitch"></i>
                    </vs-button>
                    <vs-button
                        href="https://github.com/nomuffn"
                        blank
                        icon
                        class="github"
                    >
                        nomuffn
                        <i class="bx bxl-github"></i>
                    </vs-button>
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row">
                        <img
                            v-for="emote in emotes"
                            :key="emote"
                            :src="emote"
                            class="mx-2"
                        />
                    </div>
                    <p class="mt-2 mb-4">
                        Made by
                        <a
                            class="colored"
                            href="https://discordapp.com/users/261522369200390147/"
                            target="_blank"
                            style="color: white;"
                            >Skadii#6969 (commissions open)</a
                        >
                    </p>
                    <img class="w-80 self-center" src="muffnsuic.gif" />
                    <p class="mt-2 mb-4">
                        Made by
                        <a
                            class="colored"
                            href="https://twitter.com/AntiLink99"
                            target="_blank"
                            style="color: white;"
                            >AntiLink</a
                        >
                    </p>
                </div>
            </div>
        </div>
        <div class="flex justify-center" style="margin-top: 150vh">
            <img
                class="w-96"
                src="https://cdn.discordapp.com/emojis/1026118455172288552.webp?size=160&quality=lossless"
            />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            emotes: [],
        }
    },
    async mounted() {
        this.emotes = (
            await this.$defaultApi.$get('general/stuff/public_home_emotes')
        ).json
        console.log(this.emotes)
    },
}
</script>

<style lang="scss">
.start {
    > .content {
        flex-direction: column;
        align-content: center;
        margin-bottom: 500px;
    }
    .summary {
        text-align: center;
        align-self: center;
        padding-top: 10px;

        > * {
            margin-bottom: 20px;
        }
        .buttons {
            display: flex;
            flex-wrap: wrap;
            button {
                flex: 1 1 45%;
                i {
                    margin-left: 5px;
                }

                &.discord {
                    pointer-events: none;
                }
            }
        }
        span {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            img {
                max-width: 50px;
            }
        }
    }
}
</style>
