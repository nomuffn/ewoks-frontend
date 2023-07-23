<template>
    <div class="header">
        <div class="header-wrapper">
            <h2 class="title">{{ title }}</h2>
            <p class="description">
                <slot></slot>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title'],
}
</script>

<style lang="scss" scoped>
.header {
    justify-content: space-between;
    background: #141417;
    // border-radius: 0px 0px 20px 20px;
    padding: 0px 5%;
    display: flex;
    min-height: 90px;
    align-items: center;

    i {
        margin-left: 5px;

        &.noMargin {
            margin-left: 0px;
        }
    }

    .title {
        padding: 0px;
        margin: 20px 0px 10px;
        i {
            margin-top: 5px;
        }
    }

    .description {
        display: flex;
        flex-direction: column;
        margin: 10px 0px 20px;
        text-align: left;
        max-width: 1000px;
        opacity: 0.5;
        color: #fff;
    }
    > button {
        height: max-content;
        align-self: center;
    }
}
</style>
