<template>
    <vs-card class="scorecard">
        <template #text>
            <div class="wrapper">
                <div class="left">
                    <h3>{{ score.player.twitchName }}</h3>
                    <a
                        target="_blank"
                        :href="`https://scoresaber.com/leaderboard/${score.leaderboardId}`"
                        >{{
                            `${score.leaderboardSongAuthor} - ${score.leaderboardName}`
                        }}</a
                    >
                    <p>by {{ score.mapper }}</p>
                    <p>~{{ getAgo(score.timeSet) }} ago</p>
                </div>
                <div class="right">
                    <vs-button
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
        </template>
    </vs-card>
</template>

<script>
export default {
    props: {
        score: Object,
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
        getAgo(timeSet) {
            const diffTime = Math.abs(Date.now() - new Date(timeSet));
            let timeAgo = Math.ceil(diffTime / (1000 * 60 * 60));
            if (timeAgo > 24) {
                timeAgo = Math.round(timeAgo / 24) + "d";
            } else {
                timeAgo = timeAgo + "h";
            }
            return timeAgo;
        },
    },
};
</script>

<style lang="scss" scoped>
.scorecard {
    margin-bottom: 20px;
    // styling doesnt work here for vs-card?
    .wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;

        .left {
            text-align: left;
            margin-left: 20px;
            min-width: 350px;
            flex: 1;

            a {
                color: inherit;
                text-decoration: none;
                position: relative;
                &:after {
                    background: none repeat scroll 0 0 transparent;
                    bottom: 0;
                    content: "";
                    display: block;
                    height: 2px;
                    left: 50%;
                    position: absolute;
                    background: #fff;
                    transition: width 0.3s ease 0s, left 0.3s ease 0s;
                    width: 0;
                }
                &:hover:after {
                    width: 100%;
                    left: 0;
                }
            }
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
