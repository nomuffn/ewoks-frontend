<template>
    <div></div>
</template>

<script>
export default {
    middleware: [
        function({ redirect }) {
            redirect('/Stats/beatsaver')
        },
    ],
}
</script>

<style lang="scss"></style>
