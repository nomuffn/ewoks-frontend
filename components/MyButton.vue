<template>
    <Button v-bind="attrs" @click.stop="onClick"><slot></slot></Button>
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
    props: ['icon', 'iconPos', 'href', 'to'],
    mounted() {},
    methods: {
        onClick(event) {
            if (this.to) {
                this.$router.push(this.to)
            } else if (this.href) {
                window.open(this.href, this.$attrs.notblank == undefined ? '_blank' : '')
            } else {
                if (this.$listeners.click) this.$listeners.click(event)
            }
        },
    },
    computed: {
        attrs() {
            let attrs = { class: '', ...this.$attrs }

            if (this.$attrs.notround == undefined) attrs.class += ' p-button-rounded'
            if (this.$attrs.nomargin == undefined) attrs.class += ' margin'
            if (this.$attrs.nohover == undefined) attrs.class += ' hoveranim'
            if (this.$attrs.noiconmargin == undefined) attrs.class += ' iconmargin'

            if (this.$attrs.reset != undefined) {
                attrs.class = ''
            }

            if (this.icon) {
                attrs.icon = this.computedIcon
                attrs.iconPos = this.computedIconPos
            }
            for (const key of Object.keys(this.$attrs)) {
                if (classes.includes(key) && this.$attrs[key] !== false) {
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

    box-sizing: border-box;
    list-style: none;
    outline: none;
    transition: all 0.25s ease;
    z-index: 1;
    user-select: none;

    &.margin {
        margin: 7px;
    }

    &.iconmargin {
        &::v-deep i {
            margin-left: 8px;
        }
    }

    i {
        color: #fff;
    }

    &.hoveranim:hover {
        // -webkit-box-shadow: 0 10px 20px -10px #111214;
        // -webkit-box-shadow: 0 10px 20px -10px rgba(var(--vs-color), 1);
        // box-shadow: 0 10px 20px -10px #111214;
        // box-shadow: 0 10px 20px -10px rgba(var(--vs-color), 1);
        -webkit-transform: translateY(-2px);
        transform: translateY(-2px);
    }
}
// .p-button::v-deep i {
//     margin-left: 8px;
// }
.p-button.p-button-rounded {
    border-radius: 0.5rem;
}
</style>
