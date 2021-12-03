<template>
    <div></div>
</template>

<script>
export default {
    middleware: [
        function({ redirect }) {
            redirect('/Statistics/beatsaver')
        },
    ],
}
</script>

<style lang="scss"></style>
