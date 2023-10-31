<template>
    <div class="message card mb-4">
        <p>
            {{ `${message.author} in ${message.channel} (${new Date(message.date_sent).toLocaleDateString()})` }}
        </p>
        <p class="messageContent flex">{{ message.content }}</p>
        <p>
            Reactions count:
            <strong>{{ message.total_reactions_count }}</strong>
        </p>
        <div class="flex flex-wrap mt-2">
            <div v-for="(reaction, index) in reactions" :key="index" class="flex mr-4 mb-4">
                <p v-if="!reaction.emoji.url" style="font-size: 25px">
                    {{ reaction.emoji }}
                </p>
                <img
                    v-else
                    class="w-8 h-8"
                    :src="reaction.emoji.url"
                    :title="`${reaction.emoji.name} (${reaction.emoji.id})`"
                />
                <p class="self-end" style="margin-left: 4px">x{{ reaction.count }}</p>
            </div>
        </div>
        <a class="self-start" :href="message.jump_url" target="_blank">Open in discord</a>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            required: true,
            type: Object,
        },
    },

    created() {},
    computed: {
        reactions() {
            return JSON.parse(this.message.reactions)
        },
    },
}
</script>

<style lang="scss">
.messageContent {
    margin: 5px 0px !important;
    white-space: break-spaces;

    &::before {
        content: '';
        margin: 0px 5px;
        display: block;
        width: 2px;
        height: auto;
        background: grey;
    }
}
</style>
