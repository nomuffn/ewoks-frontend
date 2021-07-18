<template>
    <div class="page">
        <NuxtChild keep-alive />
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.page {
    .content {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 90%;
        margin-top: 10px;
        margin-bottom: 100px;
    }

    .col {
        flex: 1;
        min-width: 250px;
        margin: 0px 10px;

        @media (max-width: 800px) {
            max-width: 100% !important;
            width: 100%;
        }
    }

    // .vs-card {
    //     height: 100%;
    //     max-width: 100%;
    //     display: flex;
    // }

    // .vs-card-content {
    //     flex: 1;
    //     min-width: 200px;
    //     margin-bottom: 15px;
    //     margin: 0px 5px 15px 5px;
    // }

    // .vs-card__text {
    //     padding: 20px;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    //     width: 100%;

    //     .time {
    //         margin-top: 5px;
    //         width: 100%;
    //         text-align: right;

    //         &::first-letter {
    //             color: rgb(var(--vs-color)) !important;
    //             font-weight: bold;
    //             font-size: 140%;
    //             padding-top: 5px;
    //             display: inline-block;
    //         }
    //     }
    // }

    // .card-container {
    //     display: flex;
    //     flex-wrap: wrap;
    // }

    // .vs-button {
    //     margin-top: 10px;
    // }

    // h3 {
    //     font-size: 16px;
    //     max-height: 45px;
    //     overflow: hidden;
    //     display: -webkit-box;
    //     -webkit-line-clamp: 2;
    //     -webkit-box-orient: vertical;
    // }
}
</style>
