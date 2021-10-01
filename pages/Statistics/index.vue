<template>
    <div></div>
</template>

<script>
export default {
    middleware: [
        function({ redirect }) {
            redirect("/Statistics/Beatsaver");
        }
    ]
};
</script>

<style lang="scss"></style>
