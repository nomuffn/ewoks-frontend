<template>
    <div v-if="uniqueId" class="field-checkbox flex items-center">
        <Checkbox
            v-model="checked"
            v-bind="$attrs"
            :binary="true"
            :id="uniqueId"
        />
        <label class="ml-2 mr-4" :for="uniqueId">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: ['label', 'value'],
    data() {
        return {
            uniqueId: null,
        }
    },
    created() {
        this.uniqueId = (Math.random() + 1).toString(36).substring(2)
    },
    computed: {
        checked: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            },
        },
    },
}
</script>

<style></style>
