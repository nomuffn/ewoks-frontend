<template>
    <div class="bsst">
        <sub-header title="Beatsaver Stats Tracker (WIP)">
            <p>
                Updates every 24 hours
                <br />
                If you want your account to be tracked, message me on discord
            </p>
        </sub-header>

        <div class="content flex flex-col items-center">
            <Dropdown
                v-if="mappers"
                v-model="selectedMapper"
                :options="mappers"
                optionLabel="mapperName"
                placeholder="Select mapper"
                scrollHeight="400px"
                :disabled="loading"
            />
            <ProgressSpinner class="mt-4" v-if="loading" />

            <!-- // TODO replace with primevue table -->
            <vue-good-table
                v-if="maps"
                :columns="columns"
                :rows="rows"
                :search-options="{
                    enabled: true,
                }"
                :pagination-options="{
                    enabled: true,
                    perPage: 30,
                }"
            />
        </div>
    </div>
</template>

<script>
const timeRanges = [1, 7, 30, 30 * 3, 30 * 6, 30 * 12]

export default {
    transition: 'slide-bottom',
    data() {
        return {
            selectedMapper: {},
            mappers: null,
            maps: null,
            loading: false,
        }
    },
    async created() {
        this.mappers = await this.$defaultApi.$get('beatsaver/bsst_mappers')
        if (this.$route.query.mapperId) {
            this.selectedMapper =
                this.mappers.find(
                    (i) => i.mapperId == this.$route.query.mapperId,
                ) || {}
        }
    },
    methods: {
        getVotesString(upvotes = 0, downvotes = 0, symbol = true) {
            if (symbol) {
                upvotes = upvotes > 0 ? '+' + upvotes : upvotes
                downvotes = downvotes > 0 ? '+' + downvotes : downvotes
            }
            return `<span class="upvotes">${upvotes}</span><span class="slash">/</span> <span class="downvotes">${downvotes}</span>`
        },
        sortVotes(x, y, col, rowX, rowY) {
            const colField = col.field

            x = rowX['map']
                ? rowX['map'][colField].upvotes +
                  rowX['map'][colField].downvotes
                : 0
            y = rowY['map']
                ? rowY['map'][colField].upvotes +
                  rowY['map'][colField].downvotes
                : 0

            if (rowX.name == 'Total') x = Number.POSITIVE_INFINITY
            if (rowY.name == 'Total') y = Number.POSITIVE_INFINITY

            return x < y ? -1 : x > y ? 1 : 0
        },
    },
    watch: {
        async selectedMapper(newval, oldval) {
            this.loading = true
            this.$router.push({
                query: { mapperId: this.selectedMapper.mapperId },
            })
            this.maps = await this.$defaultApi.$get(
                'beatsaver/bsst/' + this.selectedMapper.mapperId,
            )
            this.loading = false
        },
    },
    computed: {
        columns() {
            const rangeFields = timeRanges.map((range) => {
                let title
                if (range == 1) title = '24h'
                else if (range == 360) title = '1y'
                else title = `${range}d`

                return {
                    field: `days-${range}`,
                    key: `days-${range}`,
                    label: title,
                    thClass: 'text-center',
                    tdClass: 'votes text-center',
                    html: true,
                    sortFn: this.sortVotes,
                }
            })
            return [
                {
                    field: 'name',
                    key: 'a',
                    label: 'Map',
                    tdClass: 'mapname',
                    html: true,
                },
                {
                    field: 'latest',
                    key: 'b',
                    label: 'Latest',
                    thClass: 'text-center',
                    tdClass: 'votes text-center',
                    html: true,
                    sortFn: this.sortVotes,
                },
                ...rangeFields,
            ]
        },
        rows() {
            let stats = {}
            //needs the const temp or it would throw errors?
            const temp = ['latest', ...timeRanges].forEach((range) => {
                const latest = range == 'latest'
                if (!latest) range = `days-${range}`
                console.log(range)
                const votes = ['upvotes', 'downvotes'].map((i) => {
                    return this.maps.reduce((prev, curr) => {
                        return prev + (curr[range] ? curr[range][i] : 0)
                    }, 0)
                })
                console.log(votes)
                stats[range] = this.getVotesString(votes[0], votes[1], !latest)
            })

            return [
                { name: 'Total', ...stats },
                ...this.maps.map((map) => {
                    let stats = {}
                    timeRanges.forEach((range) => {
                        const rangeKey = `days-${range}`
                        stats[rangeKey] = this.getVotesString(
                            map[rangeKey]?.upvotes,
                            map[rangeKey]?.downvotes,
                        )
                    })
                    const img = map.hash
                        ? `<img src="https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png" />`
                        : ''

                    return {
                        name: `${img}<span>${map.songAuthorName}<br/>${map.songName} ${map.songSubName}</span>`,
                        latest: this.getVotesString(
                            map.latest.upvotes,
                            map.latest.downvotes,
                            false,
                        ),
                        ...stats,
                        map,
                    }
                }),
            ]
        },
    },
}
</script>

<style lang="scss">
.bsst {
    .content {
        padding-top: 30px;
        justify-content: center;
    }
    .vgt-wrap {
        margin-top: 20px;
        width: 100%;

        .vgt-inner-wrap {
            box-shadow: none;
        }

        table.vgt-table {
            border: none;
            color: #fff;
            background-color: transparent;

            thead th {
                background: transparent;
                color: #fff;
                font-weight: bold;
                border: none;
            }
            thead tr {
                background: #18191c;
                border-bottom: 1px solid #dcdfe6;
            }
            tbody td {
                border: none;
                color: #fff;
            }

            tbody tr {
                border-bottom: 1px solid #dcdfe6;
                transition: background-color 0.3s;

                &:hover {
                    background-color: rgba(#fff, 0.2);
                }
            }
            .mapname {
                > span {
                    display: flex;
                    align-items: center;
                    max-width: 400px;

                    > span {
                        margin-left: 20px;
                    }
                }
                img {
                    max-width: 80px;
                }
            }
            .text-center {
                text-align: center;
                vertical-align: middle;
            }
            .votes > span {
                display: flex;
                justify-content: center;
            }
            .upvotes {
                color: #00d900;
                font-weight: bold;
                flex-grow: 1;
                flex-basis: 0;
            }
            .downvotes {
                color: #ff1d1d;
                font-weight: bold;
                flex-grow: 1;
                flex-basis: 0;
            }
        }
        .vgt-global-search {
            background: transparent;
            border: none;

            input {
                color: #fff;
                background: transparent;
                border: none;
                &::placeholder {
                    color: #fff;
                    opacity: 0.5;
                }
            }
            .vgt-global-search__input {
                padding-left: 30px;
                .magnifying-glass {
                    width: 14px;
                    height: 14px;
                }
            }
        }
        .vgt-wrap__footer {
            background: none;
            border: none;
        }
    }
}
</style>
