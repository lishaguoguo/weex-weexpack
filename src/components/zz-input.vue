<template>
    <div class="input-item">
        <text class="input-label" :style="{'padding-top':position ?'15px':''}">{{label}}</text>
        <div class="input-box" :style="{'padding-top':position ?'15px':'','flex':flexgrow}">
            <input
                    class="input-cont"
                    :style="{color:fontColor}"
                    :type="type"
                    :value="value"
                    :placeholder="placeholder"
                    :maxlength="maxlength"
                    :disabled="inputDisabled"
                    @input="contchange"
                    @blur="blur"/>
            <div class="input-icon" @click="iconShow" v-if="needDeletAll">
                <image class="deleteimg" :src="getImg('alldelete')" v-if="value"></image>
            </div>
          <text class="unit">{{unit}}</text>
            <div v-if="isAuthcode" class="authcode">
                <zz-countdown v-if="authDisabled"
                              @tick="tick($event, 'countdown')"
                              @alarm="alarm"
                              :remain="countdown.remain">
                    <text class="authcode-disabled">{{countdown.time.ss}}秒后重发</text>
                </zz-countdown>
                <text
                        v-if="!authDisabled"
                        @click="postCode"
                        class="authcode-active"
                >获取验证码</text>
            </div>
        </div>
    </div>
</template>
<script>
    import he from 'he'
    import zzCountdown from '../components/zz-countdown.vue'
    import {getImgUrl} from '../func/index.js';
    const modal=weex.requireModule('modal');
    export default{
        name: 'mt-input',
        components: {
            zzCountdown
        },
        data(){
            return {
                countdown: {
                    remain: 60,
                    time: {
                        ss: '0'
                    }
                }
            }
        },
        props: {
            value: '',
            test:'',
            type: {default: 'text'},
            nextType:{default: 'password'},
            label: {default: '手机号'},
            fontColor:'',
            placeholder: '',
            inputDisabled:false,
            maxlength: {default: 20},
            isAuthcode: {default: false},
            authDisabled: {default: false},
            position: "",                                       //position:指代输入框文字是否底对齐。
            flexgrow: {default: 4},                             //flexgrow：指代input与label宽度的比例。
            unit:String,
            textAlign:{default:'left'},
            prevIcon:'',                                         //输入框右边初始icon
            nextIcon:'',                                          //输入框右边点击后icon
            id:{default:0},
            needDeletAll:{default:true}
        },
        methods: {
            iconShow(){
                this.$emit('allDelete',this.id)
             },
            getImg(path){
                return getImgUrl(path)
            },
            contchange(e){
                this.$emit('input', e.value)
            },
            postCode(){
                if (!this.authDisabled) {
                    this.$emit('postCode');
                }
            },
            tick: function (e, k) {
                this[k].time = JSON.parse(JSON.stringify(e))
            },
            alarm(){
                this.$emit('resendCode')
            },
            blur(){
                this.$emit('_blur')
            }
        }
    }
</script>
<style lang="less" scoped>
    @fontSize: 32px;
    @fontColor: #000;
    .border(@top,@right,@bottom,@left) {
        border-top-width: @top;
        border-right-width: @right;
        border-bottom-width: @bottom;
        border-left-width: @left;
        border-color: #dedede;
        border-style: solid;
    }

    .input-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 108px;
        padding-left: 12px;
        .border(0, 0, 1px, 0)
    }
    .input-box{
        flex-direction: row;
        align-items: center;
    }

    .input-label, .input-cont {
        font-size: 34px;
        color: @fontColor;
    }

    .input-label {
        flex: 1;
        justify-content: center;
    }

    .input-cont {
        flex:1;
        height: 80px;
        padding-right:5px;
        padding-left:5px;
        .border(0, 0, 0, 0);
        background-color: transparent;
        font-size: @fontSize;
        color: @fontColor;
        placeholder-color: #d4d4d4;
    }

    .authcode{
        /*position: absolute;*/
        /*right: 0;*/
        /*top: 30px;*/
        justify-content: center;
        height: 50px;
        padding-left: 16px;
        .border(0, 0, 0, 1px);
    }

    .input-icon{
        width:40px;
        height:50px;
        align-items: center;
        justify-content: center;
        margin-right:10px;
        .border(0, 0, 0, 0);
    }

    .authcode-active {
        font-size:30px;
        color: #3dbb6a;
    }

    .authcode-disabled {
        width:180px;
        font-size: 30px;
        padding-left:10px;
        color: #d4d4d4;
    }
    .unit{
        font-size: 30px;
        color:#666;
    }
    .font-icon{
        font-family: iconfont1;
        font-size:30px;
        color:#3eba6c;
    }
    .deleteimg{
        width:28px;
        height:28px;
    }
</style>
