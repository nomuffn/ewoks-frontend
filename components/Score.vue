<template>
    <div class="card scorecard">
        <div class="wrapper">
            <div class="left">
                <h3>
                    <template v-if="score.player">
                        <a
                            target="_blank"
                            :href="
                                `https://scoresaber.com/u/${score.player.scoresaberId}`
                            "
                            >{{ score.player.twitchName }}</a
                        ><span> played</span>
                    </template>
                    <template v-else>
                        {{ score.playerName }}
                    </template>
                    <span> played</span>
                </h3>
                <div class="third">
                    <img
                        :src="
                            `https://cdn.scoresaber.com/covers/${score.songHash}.png`
                        "
                    />
                    <div class="fourth">
                        <a
                            target="_blank"
                            :href="
                                `https://scoresaber.com/leaderboard/${score.leaderboardId}`
                            "
                            >{{
                                `${score.leaderboardSongAuthor} - ${score.leaderboardName}`
                            }}
                            [{{ getDifficulty(score.difficultyRaw) }}]</a
                        >
                        <p class="grey">
                            by
                            <b>{{ score.mapper }}</b>
                        </p>
                        <p v-if="score.timeSet" class="grey">
                            ~{{ getAgo(score.timeSet) }} ago
                        </p>
                    </div>
                </div>
            </div>
            <div class="right">
                <vs-button
                    v-if="score.twitchUrl"
                    icon
                    color="twitch"
                    :href="score.twitchUrl"
                    blank
                >
                    Open VOD
                    <i class="bx bx-window-open"></i>
                </vs-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        score: Object,
    },
    methods: {
        openUrl: function(id) {
            window.open('https://scoresaber.com/leaderboard/' + id, '_blank')
        },
        getAgo(timeSet) {
            const diffTime = Math.abs(Date.now() - new Date(timeSet))
            let timeAgo = Math.ceil(diffTime / (1000 * 60 * 60))
            if (timeAgo > 24) {
                timeAgo = Math.round(timeAgo / 24) + 'd'
            } else {
                timeAgo = timeAgo + 'h'
            }
            return timeAgo
        },
        getPosition(string, subString, index) {
            return string.split(subString, index).join(subString).length
        },
        getDifficulty(difficultyRaw) {
            return difficultyRaw.substring(
                1,
                this.getPosition(difficultyRaw, '_', 2),
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.scorecard {
    margin-bottom: 20px;

    h3 {
        margin: 0 0 10px;
        text-align: left;

        span {
            font-weight: normal;
        }
    }

    .third {
        display: flex;

        img {
            width: 80px;
            object-fit: contain;
            border-radius: 10px;
        }
    }

    .fourth {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 15px;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .left {
            text-align: left;
            min-width: 350px;
            flex: 1;
        }
        .right {
            max-width: 120px;
            width: 100%;
            flex: 1;
            i {
                margin-left: 5px;

                &.noMargin {
                    margin-left: 0px;
                }
            }
        }
    }
}
</style>
