<template>
    <div class="bui-actionsheet">
        <zz-mask v-if="show" @click="layoutClick" :top = '84'></zz-mask>
        <div v-if="show" class="bui-actionsheet-box" ref="actionsheetBox" :style = "{ height: (items.length < 5 ? 74 * items.length : 74 * 5) + 'px' }">
            <scroller class="bui-actionsheet-top" :show-scrollbar = 'false'>
                <text class="bui-actionsheet-list" v-for="item, index in items" @click="actionsheetItemClick(item, index)">{{item}}</text>
            </scroller>
        </div>
    </div>

</template>

<script>
    var animation = weex.requireModule('animation');
    import zzMask from '../components/zz-mask.vue'
    export default{
        components:{
            zzMask
        },
        props: {
            title:'',
            items: {
                type: Array
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            //动画操作
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
            animationEvent(operation,speed,item='',index=0){
                let _this = this;
                let el = this.$refs.actionsheetBox;
                let translate = 'translate(0, -500px)';
                _this.animationFn(el, translate,  'ease-in',speed, function () {
                    _this.$emit(operation,item,index);
                });
            },
            //点击mask遮罩层
            layoutClick() {
                this.animationEvent('close',300)
            },
            //上拉菜单项点击事件
            actionsheetItemClick(item,index) {
                this.animationEvent('itemClick',200,item,index)
            }
        }
    }
</script>

<style lang="less">
    @color_white: #fff;
    .bui-actionsheet-box{
        width: 750px;
        flex-direction: column;
        position: fixed;
        top: 84px;
        overflow: hidden;
    }
    .bui-actionsheet-top{
        background-color: @color_white;
        flex: 1;
        flex-direction: column;
        width: 750px;
    }
    .bui-actionsheet-list{
        height: 74px;
        text-align: center;
        font-size: 24px;
        line-height: 74px;
        border-top-width: 1px;
        border-top-color: #f6f6f6;
        border-top-style:solid;
    }
</style>