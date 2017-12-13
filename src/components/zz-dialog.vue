<template>
    <div class="bui-dialog-layout">
        <zz-mask v-if="show" @click="_layoutClick"></zz-mask>
        <div class="bui-dialogbox" v-if="show">
            <div class="bui-dialog">
            <div class="bui-dialog-title" v-if="title">
                <text class="dialog-title-text">{{title}}</text>
            </div>
            <div class="bui-dialog-content">
                <div class="dialog-image">
                    <image class="dialog-chenggong" :src="getImg('chenggong')"></image>
                </div>
                <div class="dialog-cont">
                    <text class="dialog-texts">{{tipcont}}</text>
                </div>
            </div>
            <div class="bui-dialog-footer">
                <text class="dialog-action-text" v-for="btn in getButtons" @click="_click(btn)">{{btn}}</text>
            </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @color_black:#000;
    @color_white:#fff;
    @color_border:#dedede;
    @color_primary:#22ac38;
    .padding(@left,@right,@top,@bottom){
        padding-left:@left;
        padding-right:@right;
        padding-top:@top;
        padding-bottom:@bottom;
    }
    .position(@type,@left,@right,@top,@bottom){
        position:@type;
        top: @top;
        left: @left;
        right: @right;
        bottom:@bottom;
    }
    .bui-dialogbox{
        .position(fixed,0,0,0,0);
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .bui-dialog {
        background-color: @color_white;
        border-radius: 10px;
        width:446px;
        align-items: center;
        flex-direction: column;
        overflow: hidden;
        .padding(0,0,80px,56px)
    }

    .bui-dialog-title {
        justify-content: center;
        .padding(36px,36px,50px,26px)
    }

    .dialog-title-text {
        color: @color_black;
        font-size: 30px;
    }

    .bui-dialog-content {
        justify-content: center;
        align-items: center;
        .padding(44px,36px,0,0)
    }

    .bui-dialog-footer {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 60px;
        width:270px;
        border-radius:100px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: @color_border;
        background-color:@color_primary;
    }

    .dialog-action-text {
        flex: 1;
        text-align: center;
        font-size: 30px;
        color: @color_white;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: @color_border;
    }
    .dialog-chenggong{
        width:136px;
        height:136px;
    }
    .dialog-cont{
        margin-top:72px;
        margin-bottom:76px;
    }
    .dialog-texts {
        font-size: 38px;
        text-align: center;
        color: #3eba6c;
    }
</style>
<script>
    import zzMask from './zz-mask.vue'
    import {getImgUrl} from '../func/index'
    export default{
        components:{
            zzMask
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            title: '',
            buttons: {
                default: "取消,确定"
            },
            tipcont:{
                default:'申请成功'
            }
        },
        computed: {
            "getButtons": function () {
                return this.buttons.split(',');
            }
        },
        methods: {
            getImg(path){
              return getImgUrl(path)
            },
            "_click": function (text) {
                this.$emit("btnClick", text);
            },
            "_layoutClick": function () {
                this.$emit("close");
            }
        }

    }
</script>