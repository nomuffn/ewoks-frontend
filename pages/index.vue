<template>
    <div></div>
</template>

<script>
export default {
    middleware: [
        function({ redirect }) {
            redirect("/RankingQueue");
        }
    ]
};
</script>

<style lang="scss"></style>
