<template>
    <div class="votesFeed">
        <Loading v-if="loading" />
        <div class="cards row">
            <div
                class="card"
                v-for="(vote, index) of getVotes"
                :key="index"
                v-on:click="openUrl(vote.requestId)"
            >
                <h3>{{ vote.name }} by {{ vote.mapper }}</h3>

                <div class="wrapper">
                    <div class="spans">
                        <span
                            v-for="(string, index) of vote.strings"
                            :key="index"
                        >
                            <span
                                v-bind:class="{
                                    red: string[0] == 'qat',
                                }"
                                >{{ string[0].toUpperCase() }}</span
                            >
                            {{ string[1] }}
                        </span>
                    </div>

                    <p class="time">
                        {{ vote.hoursago }}
                    </p>
                </div>
            </div>
            <vs-button
                v-if="visibleItems < 25"
                class="showMore"
                icon
                @click="visibleItems += 10"
            >
                Show more
            </vs-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            votes: null,
            loading: true,
            visibleItems: 10,
        }
    },
    async created() {
        this.votes = await this.$defaultApi.$get('scoresaber/rq/feed')
        this.loading = false

        for (let index = 0; index < this.votes.length; index++) {
            let element = this.votes[index]

            if (element.hoursleft > 24) {
                this.votes[index].hoursago =
                    '~' + Math.round(element.hoursago / 24) + ' days'
            } else {
                this.votes[index].hoursago = '~' + element.hoursago + ' hours'
            }

            for (let [key, value] of Object.entries(this.votes[index].votes)) {
                let str = key.split('_')
                str[1] =
                    this.capitalizeTheFirstLetterOfEachWord(str[1]) +
                    ': ' +
                    (value > 0 ? '+' + value : value)

                if (!this.votes[index].strings) this.votes[index].strings = []
                this.votes[index].strings.push(str)
            }
        }
    },
    computed: {
        getVotes() {
            return this.votes?.slice(0, this.visibleItems)
        },
    },
    methods: {
        openUrl: function(id) {
            window.open(
                'https://scoresaber.com/ranking/request/' + id,
                '_blank',
            )
        },
        capitalizeTheFirstLetterOfEachWord(words) {
            var separateWord = words.toLowerCase().split(' ')
            for (var i = 0; i < separateWord.length; i++) {
                separateWord[i] =
                    separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1)
            }
            return separateWord.join(' ')
        },
    },
}
</script>

<style lang="scss">
.votesFeed {
    .spans {
        width: 50%;
        display: flex;
        flex-flow: column;
    }

    h3 {
        flex: 1;
    }

    .wrapper {
        display: flex;
        justify-content: space-between;
    }

    span span {
        color: green;
        padding: 0;
        font-weight: bold;
    }

    .red {
        color: #b71c1c;
    }

    .card {
        flex-direction: column;
    }

    .time {
        align-self: center;
    }
}
</style>
