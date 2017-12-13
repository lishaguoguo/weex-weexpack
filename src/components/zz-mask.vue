<template>
    <div class="bui-mask" :style="{'opacity': opacity, top: top + 'px'}" @click="_click"></div>
</template>

<script>

    module.exports = {
        props: {
            "opacity": {
                default: '0.2'
            },
            top: {
                default: 0,
                type: Number
            }
        },
        methods: {
            "_click": function () {
                this.$emit("click");
            }
        }
    }
</script>
<style lang="less" scoped>
    .bui-mask{
        position: fixed;
        top:88px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: #000;
        opacity: 0.3;
    }
</style>