//
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
                    <my-button
                        style="flex: 1 1 100%"
                        label="My Maps"
                        href="https://beatsaver.com/profile/4284309"
                        warning
                    >
                        My Maps
                        <img
                            class="w-6 ml-1"
                            src="https://beatsaver.com/static/favicon/favicon-32x32.png"
                        />
                    </my-button>
                    <my-button
                        href="https://discordapp.com/users/219099186505711616/"
                    >
                        muffn#2345
                        <i class="bx bxl-discord bx-sm"></i>
                    </my-button>
                    <my-button href="https://twitter.com/nomuffn">
                        @nomuffn
                        <i class="bx bxl-twitter bx-sm"></i>
                    </my-button>
                    <my-button help href="https://www.twitch.tv/muffn_">
                        muffn_
                        <i class="bx bxl-twitch bx-sm"></i>
                    </my-button>
                    <my-button secondary href="https://github.com/nomuffn">
                        nomuffn
                        <i class="bx bxl-github bx-sm"></i>
                    </my-button>
                </div>
                <div>
                    <a
                        href="https://twitter.com/cametek/status/1369753294977998848"
                        target="_blank"
                        ><img src="/camellia.png"
                    /></a>
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row flex-wrap">
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
                            style="color: white"
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
                            style="color: white"
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
