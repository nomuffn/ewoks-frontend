<template>
    <div class="votesFeed space-y-4">
        <div v-if="loading" class="p-8 flex justify-center">
            <ProgressSpinner style="width: 36px; height: 36px" strokeWidth="4" />
        </div>

        <template v-else-if="getVotes && getVotes.length">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                    v-for="(vote, index) of getVotes"
                    :key="index"
                    @click="openUrl(vote.requestId)"
                    class="bg-[#18191c] border border-gray-800 hover:border-purple-500/40 rounded-xl p-4 shadow-md cursor-pointer transition-all space-y-2.5 flex flex-col justify-between group"
                >
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h4 class="font-bold text-gray-100 group-hover:text-purple-300 transition-colors text-sm line-clamp-1" :title="vote.name">
                                {{ vote.name }}
                            </h4>
                            <p class="text-xs text-gray-400 mt-0.5">
                                by <span class="text-blue-300 font-medium">{{ vote.mapper }}</span>
                            </p>
                        </div>
                        <span class="px-2 py-0.5 bg-gray-800 text-gray-400 font-mono text-[11px] rounded shrink-0">
                            {{ vote.hoursago }}
                        </span>
                    </div>

                    <div class="pt-2 border-t border-gray-800/60 flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span
                            v-for="(item, idx) of vote.strings"
                            :key="idx"
                            class="px-2.5 py-1 bg-[#121315] border border-gray-800 rounded-lg text-gray-300 font-medium flex items-center gap-1 text-xs"
                        >
                            <strong
                                :class="[
                                    'uppercase text-[10px] font-mono font-bold mr-0.5',
                                    item.group.toLowerCase() === 'rt' ? 'text-emerald-400' : 'text-rose-400'
                                ]"
                            >
                                {{ item.group }}
                            </strong>
                            <span>{{ item.label }}: </span>
                            <span
                                :class="[
                                    'font-bold ml-0.5',
                                    item.val > 0 ? 'text-emerald-400' : item.val < 0 ? 'text-rose-400' : 'text-gray-400'
                                ]"
                            >
                                {{ item.val > 0 ? '+' + item.val : item.val }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="visibleItems < 25" class="flex justify-center pt-2">
                <button
                    @click="visibleItems += 10"
                    class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                    <span>Show More Votes</span>
                    <i class="bx bx-chevron-down text-base"></i>
                </button>
            </div>
        </template>
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
        try {
            this.votes = await this.$defaultApi.$get('scoresaber/rq/feed')
            if (Array.isArray(this.votes)) {
                for (let index = 0; index < this.votes.length; index++) {
                    let element = this.votes[index]

                    if (element.hoursleft > 24) {
                        this.votes[index].hoursago = '~' + Math.round(element.hoursago / 24) + ' days ago'
                    } else {
                        this.votes[index].hoursago = '~' + element.hoursago + 'h ago'
                    }

                    if (element.votes) {
                        for (let [key, value] of Object.entries(element.votes)) {
                            let str = key.split('_')
                            let group = str[0] || 'rt'
                            let type = str[1] ? str[1].toLowerCase() : ''
                            let label = this.capitalizeTheFirstLetterOfEachWord(str[1] || '')
                            let displayVal = value > 0 ? '+' + value : value.toString()

                            if (!this.votes[index].strings) this.votes[index].strings = []
                            this.votes[index].strings.push({
                                group,
                                type,
                                label,
                                val: value,
                                display: `${label}: ${displayVal}`,
                            })
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Failed to fetch votes feed:', e)
            this.votes = []
        } finally {
            this.loading = false
        }
    },
    computed: {
        getVotes() {
            return this.votes?.slice(0, this.visibleItems)
        },
    },
    methods: {
        openUrl(id) {
            window.open('https://scoresaber.com/ranking/request/' + id, '_blank').focus()
        },
        capitalizeTheFirstLetterOfEachWord(words) {
            if (!words) return ''
            var separateWord = words.toLowerCase().split(' ')
            for (var i = 0; i < separateWord.length; i++) {
                separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
            }
            return separateWord.join(' ')
        },
    },
}
</script>

<style lang="scss" scoped>
.votesFeed {
    width: 100%;
}
</style>
