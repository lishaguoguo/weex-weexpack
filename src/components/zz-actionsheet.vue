<template>
    <div class="bui-actionsheet">
        <zz-mask v-if="show" @click="layoutClick"></zz-mask>
        <div v-if="show" class="bui-actionsheet-box" ref="actionsheetBox">
            <text class="bui-actionsheet-title" v-if="title">{{title}}</text>
            <scroller class="bui-actionsheet-top" :show-scrollbar = 'false' :style = "{ height: (items.length < 3 ? 84 * items.length : 84 * 3) + 'px' }">
                <text class="bui-actionsheet-list" v-for="item, index in items" @click="loading?'':actionsheetItemClick(item, index)" :style = "{color: item === '确定' ? '#f00' : '#000'}">{{item}}</text>
            </scroller>
            <div class="bui-actionsheet-bottom">
                <text class="bui-actionsheet-btn" @click="actionsheetBtnClick">{{button}}</text>
            </div>
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
        data(){
            return {
                loading:false
            }
        },
        props: {
            title:'',
            items: {
                type: Array
            },
            show: {
                type: Boolean,
                default: false
            },
            button: {
                default: "取消"
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
                let translate = 'translate(0px,346px)';
                _this.animationFn(el, translate,  'ease-in',speed, function () {
                    _this.$emit(operation,item,index);
                    _this.loading=false
                });
            },
            //点击mask遮罩层
            layoutClick() {
                this.animationEvent('close',300)
            },
            //上拉菜单项点击事件
            actionsheetItemClick(item,index) {
                this.loading=true;
                this.animationEvent('itemClick',200,item,index)
            },
            //上拉菜单按钮点击事件
            actionsheetBtnClick() {
                this.animationEvent('btnClick',200)
            }
        }
    }
</script>

<style lang="less">
    @color_white: #fff;
    .bui-actionsheet-box{
        position: fixed;
        left: 0px;
        right: 0px;
        bottom:0px;
        flex-direction: column;
        overflow: hidden;
    }
    .bui-actionsheet-top{
        background-color: @color_white;
        flex: 1;
    }
    .bui-actionsheet-bottom{
        margin-top: 10px;
    }
    .bui-actionsheet-title{
        text-align: center;
        font-size: 28px;
        color: #9ea7b4;
        height: 84px;
        line-height: 84px;
        background-color: @color_white;
    }
    .bui-actionsheet-list,.bui-actionsheet-btn{
        height: 84px;
        text-align: center;
        font-size: 34px;
        line-height: 84px;
    }

    /*.bui-actionsheet-list,.bui-actionsheet-btn{*/
        /*padding: 25px;*/
        /*text-align: center;*/
        /*font-size: 34px;*/
    /*}*/
    .bui-actionsheet-list{
        border-top-width: 1px;
        border-top-color: #dedede;
        border-top-style:solid;
    }
    .bui-actionsheet-btn{
        background-color: @color_white;
    }
</style>