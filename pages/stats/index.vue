<template>
    <div></div>
</template>

<script>
export default {
    middleware: [
        function({ redirect }) {
            redirect('/stats/beatsaver')
        },
    ],
}
</script>

<style lang="scss"></style>
