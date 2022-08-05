<template>
    <div class="tierlist flex flex-col justify-center pt-16 w-full">
        <div class="flex justify-center items-center">
            <h1 class="text-5xl text-center leading-tight mr-8">
                mEBSMBSBSMTM (fr)
            </h1>
            <img class="w-32" src="real.png" />
        </div>

        <h3 class="text-lg text-center mt-4">
            also <strong>famously</strong> known as muffn's Epic Beat Saber
            Mappers Beat Saver Beat Saber Maps Tierlist Maker by muffn
        </h3>

        <Message class="self-center mt-8" :closable="false">
            <p>
                Search beat saver down below to get maps and drag & drop them
                into a tier
            </p>
            <p>Just screenshot with win + shift + s <strong>:D</strong></p>
            <p>
                Also zoom out with ctrl + mouse wheel if you dont have enough
                space. Couldnt figure out a quick good way to make a screenshot
                of the tierlist yet
            </p>
        </Message>

        <div class="w-full flex flex-col py-10 mt-4 xl:px-20">
            <p>Cover size</p>
            <Slider
                class="w-1/4 my-4"
                v-model="coverSize"
                :min="100"
                :max="300"
                :tooltips="false"
            />

            <div class="flex w-full justify-center">
                <InputText
                    placeholder="Enter Title"
                    class="mapperName w-full text-center"
                    style="
                        border-bottom: solid 2px;
                        padding-bottom: 10px;
                        border-radius: 0;
                    "
                />
            </div>

            <div class="tiers flex flex-col">
                <div
                    v-for="(tier, index) in tiers"
                    :key="tier.key"
                    class="tier"
                >
                    <div class="flex" style="min-height: 100px">
                        <div class="flex flex-col">
                            <Button
                                class="setting flex-grow"
                                @click="move(index)"
                                :disabled="index == 0"
                                ><i class="pi pi-chevron-up"></i
                            ></Button>
                            <Button
                                class="setting flex-grow"
                                @click="e => toggle(e, index)"
                                ><i class="pi pi-cog"></i
                            ></Button>
                            <Button
                                class="setting flex-grow"
                                @click="move(index, true)"
                                :disabled="index == tiers.length - 1"
                                ><i class="pi pi-chevron-down"></i
                            ></Button>
                        </div>
                        <InputText
                            :style="
                                `background-color: #${tier.bgColor}; color: #${tier.textColor}`
                            "
                            class="w-32 text-center resize-none min-h-full"
                            :value="tier.label"
                        />
                        <draggable-maps
                            v-model="tier.list"
                            :coverSize="coverSize"
                            @onRightClick="onRightClick"
                        />
                    </div>
                </div>
            </div>

            <Button
                style="margin-left: 50px"
                class="self-start w-32 text-center justify-center"
                @click="addTier"
                >Add Tier</Button
            >

            <p class="text-2xl mt-4">Maps</p>
            <div class="flex mx-4 mt-4 pb-4">
                <div class="flex flex-col">
                    <label for="search">Search</label>
                    <InputText
                        id="search"
                        v-model="search"
                        style="min-width: 280px; margin-right: 10px"
                        placeholder="Search beat saver"
                        @keydown.enter="loadMaps"
                    />
                </div>

                <div class="flex flex-col">
                    <label for="order">Order by</label>
                    <Dropdown
                        id="order"
                        v-model="order"
                        :options="orderings"
                        optionLabel="name"
                        placeholder="Select a City"
                        scrollHeight="400px"
                    />
                </div>
                <Button
                    label="LOAD 😋"
                    class="self-end"
                    style="margin-left: 10px"
                    :disabled="loading"
                    :loading="loading"
                    :icon="spinnerComputed"
                    @click="loadMaps"
                />
            </div>
            <div v-if="maps.length" class="flex flex-col mx-4">
                <draggable-maps
                    v-model="maps"
                    :coverSize="coverSize"
                    class="mb-4"
                    @onRightClick="onRightClick"
                />
                <Button
                    v-if="pagination > 0"
                    class="self-center"
                    label="MOOORE"
                    :disabled="loading"
                    :loading="loading"
                    :icon="spinnerComputed"
                    @click="loadMaps(true)"
                />
            </div>
        </div>

        <Toast />
        <OverlayPanel ref="tierMenu">
            <div class="flex flex-col">
                <div class="flex justify-between mt-2">
                    <label class="font-bold" for="bgcolor"
                        >Background Color:
                    </label>
                    <ColorPicker
                        id="bgcolor"
                        class="ml-4"
                        v-if="editTier != null"
                        v-model="tiers[editTier].bgColor"
                    />
                </div>
                <div class="flex justify-between mt-2 mb-4">
                    <label class="font-bold" for="textcolor"
                        >Text Color:
                    </label>
                    <ColorPicker
                        id="textcolor"
                        class="ml-4"
                        v-if="editTier != null"
                        v-model="tiers[editTier].textColor"
                    />
                </div>

                <Button
                    label="Delete"
                    class="p-button-danger"
                    icon="pi pi-trash"
                    @click="deleteTier"
                />
            </div>
        </OverlayPanel>

        <ContextMenu ref="menu" :model="mapContextMenu" />
        <img class="sheep w-full" src="sheep.jpg" />
    </div>
</template>

<script>
// import html2canvas from 'html2canvas';

const defaultBgColor = 'ffffff'
const defaultTextColor = '000000'

export default {
    data() {
        return {
            tiers: [
                {
                    key: 0,
                    label: 'S',
                    bgColor: defaultBgColor,
                    textColor: defaultTextColor,
                    list: [],
                },
                {
                    key: 1,
                    label: 'A',
                    bgColor: defaultBgColor,
                    textColor: defaultTextColor,
                    list: [],
                },
                {
                    key: 2,
                    label: 'B',
                    bgColor: defaultBgColor,
                    textColor: defaultTextColor,
                    list: [],
                },
            ],
            orderings: [
                { name: 'Uploaded descending', value: '-uploaded' },
                { name: 'Uploaded ascending', value: 'uploaded' },
                { name: 'Upvotes descending', value: '-upvotes' },
                { name: 'Upvotes ascending', value: 'upvotes' },
                { name: 'Downvotes descending', value: '-downvotes' },
                { name: 'Downvotes ascending', value: 'downvotes' },
                { name: 'Star rating descending', value: '-highestStar' },
                { name: 'Star rating ascending', value: 'highestStar' },
                { name: 'BPM descending', value: '-bpm' },
                { name: 'BPM ascending', value: 'bpm' },
            ],
            order: { name: 'Uploaded descending', value: '-uploaded' },
            editTier: null,
            drag: false,
            maps: [],
            coverSize: 125,
            search: '',
            pagination: 1,
            loading: false,
            mapContextMenu: [],
        }
    },
    async mounted() {
        // this.search = 'muffn'
        // this.loadMaps()
    },
    methods: {
        toggle(event, index) {
            this.editTier = index
            this.$refs.tierMenu.toggle(event)
        },
        addTier() {
            this.tiers.push({
                key: Date.now(),
                label: '😁',
                bgColor: defaultBgColor,
                textColor: defaultTextColor,
                list: [],
            })
            if (this.tiers.length == 10)
                this.$toast.add({
                    severity: 'info',
                    summary: 'Calm down bro',
                    life: 3000,
                })
            if (this.tiers.length == 20)
                this.$toast.add({
                    severity: 'info',
                    summary: 'No for real ur pc is gonna implode',
                    life: 3000,
                })
            if (this.tiers.length == 30)
                this.$toast.add({
                    severity: 'info',
                    summary: 'U might even die (in-game)',
                    life: 3000,
                })

            if (this.tiers.length == 50) {
                this.$toast.add({
                    severity: 'info',
                    summary: 'Fuck off',
                    life: 3000,
                })
                this.tiers = []
            }
        },
        createScreenshot() {
            // html2canvas(document.querySelector('#container'), {
            //     useCORS: false,
            //     allowTaint: true,
            // }).then((canvas) => {
            //     document.body.appendChild(canvas);
            // });
        },
        async loadMaps(more = false) {
            this.loading = true
            if (more !== true) {
                this.maps = []
                this.pagination = 1
            }
            try {
                const result = await this.$defaultApi.$get(
                    `beatsaver/search/?search=${this.search}&page=${this.pagination}&ordering=${this.order.value}`,
                )
                this.pagination++
                if (!result.next) {
                    this.pagination = -1
                }
                this.maps = this.maps.concat(result.results)
            } catch (e) {
                console.log(e)
                this.$toast.add({
                    severity: 'error',
                    summary: 'Invalid search',
                    life: 3000,
                })
            }
            this.loading = false

            if (!window.onbeforeunload)
                window.onbeforeunload = function() {
                    console.log(1)
                    return 'Are you sure you want to leave?'
                }
        },
        deleteTier() {
            this.tiers.splice(this.editTier, 1)
            this.editTier = null
            this.$refs.tierMenu.hide()
        },
        move(index, down = false) {
            var tmp = this.tiers[index]
            const otherIndex = down ? index + 1 : index - 1
            this.$set(this.tiers, index, this.tiers[otherIndex])
            this.$set(this.tiers, otherIndex, tmp)
        },
        onRightClick(event, map) {
            this.mapContextMenu = [
                ...[
                    `Uploaded by: ${map.uploaderUsername}`,
                    `Mapper: ${map.levelAuthorName}`,
                    `Song Name: ${map.songName} ${map.songSubName}`,
                    `Song Artist: ${map.songAuthorName}`,
                    `BPM: ${map.bpm}`,
                    `Votes: ${map.upvotes} / ${map.downvotes}`,
                    ...(map.highestStar > 0
                        ? [`Highest Star rating: ${map.highestStar}`]
                        : []),
                ].map(string => {
                    return {
                        label: string,
                        disabled: true,
                    }
                }),
                {
                    separator: true,
                },
                {
                    label: 'Open on Beatsaver',
                    icon: 'pi pi-fw pi-external-link',
                    command: event => {
                        window.open(`https://beatsaver.com/maps/${map.key}`)
                    },
                },
            ]
            this.$refs.menu.show(event)
        },
    },
    computed: {
        spinnerComputed() {
            if (this.loading) return 'pi pi-spin pi-spinner'
        },
        showEditTier: {
            get() {
                return this.editTier !== null
            },
            set() {
                this.editTier = null
            },
        },
    },
}
</script>

<style lang="scss">
.tierlist {
    .p-button {
        background: rgb(var(--vs-primary));
        border-color: rgb(var(--vs-primary));

        &:hover:enabled {
            background-color: rgba(var(--vs-primary), 0.6);
            border-color: rgba(var(--vs-primary), 0.6);
        }
    }
    .sheep {
        margin-top: 100vh;
    }
    .home {
        margin-bottom: 50vh;
    }
    .p-dialog-content {
        height: 100%;
    }
    .p-inputtext.mapperName {
        background: none;
        color: #fff;
        border: none;
        font-size: 2rem;
        width: 100%;
        padding: 0;
        margin: 10px 0px;
    }
    .p-button.setting {
        border-radius: 0;

        &:first-child {
            border-top-left-radius: 3px;
        }
        &:last-child {
            border-bottom-left-radius: 3px;
        }
    }
    .p-contextmenu {
        width: auto;
        max-width: 500px;
    }
    .tier {
        .p-inputtext {
            border-radius: 0;
        }

        &:first-child {
            .p-inputtext {
                border-top-right-radius: 3px;
            }
        }
        &:last-child {
            .p-inputtext {
                border-bottom-right-radius: 3px;
            }
        }
    }
}
</style>
