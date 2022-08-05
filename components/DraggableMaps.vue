<template>
    <draggable
        style="min-height: 100px"
        class="w-full h-full py-2"
        :value="value"
        @input="input => $emit('input', input)"
        :disabled="false"
        @start="drag = true"
        @end="drag = false"
        group="maps"
        ghostClass="ghost"
        :animation="400"
        :scroll-sensitivity="100"
        :force-fallback="true"
        :scroll-speed="30"
    >
        <transition-group
            style="
                min-height: 100px;
                margin-bottom: -0.25rem;
                margin-top: -0.25rem;
            "
            class="flex flex-wrap pl-1"
            type="transition"
            :name="!drag ? 'flip-list' : null"
        >
            <div
                v-for="map in value"
                :key="map.hash"
                class="map flex flex-col m-1 relative overflow-hidden select-none"
                :style="`width: ${coverSize}px`"
                @contextmenu="event => $emit('onRightClick', event, map)"
            >
                <img
                    :src="
                        `https://eu.cdn.beatsaver.com/${map.hash.toLowerCase()}.jpg`
                    "
                />
                <p
                    style="font-size: 80%"
                    class="truncate absolute bottom-0 w-full text-center bg-white text-black px-1 select-none"
                >
                    {{ map.songName }}
                </p>
            </div>
        </transition-group>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    props: {
        value: Array,
        coverSize: Number,
    },
    components: {
        draggable,
    },
    data() {
        return {
            tiers: [],
            drag: false,
        }
    },
    async mounted() {},
    methods: {
        addTier() {
            this.tiers.push({
                key: new Date(),
                list: [],
            })
        },
    },
}
</script>

<style lang="scss">
.map {
    border-radius: 3px;
}
</style>
