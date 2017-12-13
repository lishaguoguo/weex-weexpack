<template>
    <div class="bui-mask" :style="{'opacity': opacity}">
        <dataBlock text = '加载中...' src = 'loading2x' imgHeight = '180px'></dataBlock>
    </div>
</template>

<script>
    var animation = weex.requireModule('animation');
    import dataBlock from './dataBlock.vue'
    module.exports = {
        props: {
            "opacity": {
                default: '0.2'
            },
        },
        data:{
          show:false
        },
        components: {dataBlock},
        methods:{
            animationFn (el, translate, timing,duration, callback) {
                animation.transition(el, {
                    styles:{
                        transform: translate,
                        transformOrigin: 'center center'
                    },
                    duration: duration, //ms
                    timingFunction: timing,
                    delay: 0 //ms
                }, callback)
            },
            animationEvent(operation,speed){
                let _this = this;
                let el = this.$refs.actionsheetBox;
                let translate = 'translate(0px,346px)';
                _this.animationFn(el, translate,  'ease-in',speed, function () {
                    _this.$on('elemLoad',(e)=>{
                        this.show=e;
                    });
                });
            },
        }
    }
</script>
<style lang="less" scoped>
    .bui-mask{
        position: fixed;
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        /*background-color: #eee;*/
    }
    .loadingtext{
        padding-top: 25px;
    }
</style>