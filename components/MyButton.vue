<template>
    <Button v-bind="attrs" @click="onClick()"><slot></slot></Button>
    <!-- v-on="$listeners" -->
</template>

<script>
const classes = [
    'secondary',
    'success',
    'info',
    'warning',
    'help',
    'danger',
    'raised',
    'text',
    'outlined',
    'link',
    'sm',
    'lg',
]

export default {
    props: ['icon', 'iconPos', 'href'],
    mounted() {},
    methods: {
        onClick() {
            if (this.href) {
                window.open(this.href, '_blank')
            } else {
                if (this.$listeners.click) this.$listeners.click()
            }
        },
    },
    computed: {
        attrs() {
            let attrs = { class: 'p-button-rounded', ...this.$attrs }
            if (this.icon) {
                attrs.icon = this.computedIcon
                attrs.iconPos = this.computedIconPos
            }
            for (const key of Object.keys(this.$attrs)) {
                if (classes.includes(key)) {
                    attrs.class += ` p-button-${key}`
                }
            }
            return attrs
        },
        computedIcon() {
            if (this.icon) {
                return `pi pi-${this.icon}`
            }
            return null
        },
        computedIconPos() {
            return this.iconPos || 'right'
        },
    },
}
</script>

<style lang="scss" scoped>
.p-button {
    justify-content: center;
    margin: 7px;

    box-sizing: border-box;
    list-style: none;
    outline: none;
    transition: all 0.25s ease;
    z-index: 1;
    user-select: none;

    &:hover {
        // -webkit-box-shadow: 0 10px 20px -10px #111214;
        // -webkit-box-shadow: 0 10px 20px -10px rgba(var(--vs-color), 1);
        // box-shadow: 0 10px 20px -10px #111214;
        // box-shadow: 0 10px 20px -10px rgba(var(--vs-color), 1);
        -webkit-transform: translateY(-2px);
        transform: translateY(-2px);
    }
}
.p-button.p-button-rounded {
    border-radius: 0.5rem;
}
</style>
