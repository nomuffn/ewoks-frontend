<template>
    <div class="timeline">
        <div class="content">
            <vs-alert color="primary">
                DM me any suggestions or additions on discord: muffn#2345
                <br />
                I'll also add filters at some point and make it look better when
                there's more data
            </vs-alert>
            <loading-spinner v-if="!events.length" />
            <div v-else class="wrapper">
                <vue-timeline-update
                    v-for="event in events"
                    :key="event.title + event.description"
                    :date="new Date(event.date)"
                    :title="getTitle(event)"
                    :description="getDesc(event)"
                    :category="event.category"
                    :icon="event.icon"
                    :color="event.color"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            events: [],
        }
    },
    async created() {
        this.events = await this.$defaultApi.$get('timeline/events')
    },
    methods: {
        getTitle(event) {
            return event.title
        },
        getDesc(event) {
            const date = new Date(event.date).toLocaleDateString()
            return `${event.description}<p style="float: right;"><strong>${date}</strong></p>`
        },
    },
}
</script>

<style lang="scss">
.timeline {
    margin: 50px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .content {
        display: block;
    }

    .wrapper {
        margin-top: 50px;
    }

    .gb-vue-timeline-update {
        img {
            max-width: 700px;
        }
    }
}
</style>
