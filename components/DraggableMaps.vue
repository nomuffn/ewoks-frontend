<template>
    <!-- <draggable  :animation="400":force-fallback="true" @start="filedStart2" :list = "t.filedList" @end="filedEnd" group="testList" :disabled="editable"> -->
    <draggable
        style="min-height: 100px"
        class="w-full h-full py-5"
        :value="value"
        @input="(input) => $emit('input', input)"
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
                margin-bottom: -0.5rem;
                margin-top: -0.5rem;
            "
            class="flex flex-wrap pl-2"
            type="transition"
            :name="!drag ? 'flip-list' : null"
        >
            <div
                v-for="map in value"
                :key="map.id"
                class="map flex flex-col m-2 relative overflow-hidden select-none"
                :style="`width: ${coverSize}px`"
            >
                <img
                    :src="`https://eu.cdn.beatsaver.com/${map.versions[0].hash}.jpg`"
                />
                <p
                    style="font-size: 80%"
                    class="truncate absolute bottom-0 w-full text-center bg-white text-black px-1 select-none"
                >
                    {{ map.metadata.songName }}
                </p>
            </div>
        </transition-group>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';

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
        };
    },
    async mounted() {},
    methods: {
        addTier() {
            this.tiers.push({
                key: new Date(),
                list: [],
            });
        },
    },
};
</script>

<style lang="scss">
.map {
    border-radius: 3px;
}
</style>
