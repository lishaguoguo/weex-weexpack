<template>
    <div class="btn-box"
         :class="['btn-'+type]"
         :style="{'border-radius':radius,'height':size}"
         @longpress="_longpress()"
         @click="_click()">
        <text class="btn" :style="{'color':textColor}">{{value}}</text>
    </div>
</template>
<style lang='less' scoped>
    @color_primary: #3eba6c;
    @color_white: #ffffff;
    @color_disabled:#78eba3;
    .btn-box {
        justify-content: center;
        margin-left: 12px;
        margin-right: 12px;
        border-style: solid;
        border-width: 1px;
    }

    .btn {
        font-size: 36px;
        text-align: center;
        padding-left: 20px;
        padding-right: 20px;
        color: @color_white;
    }

    //type
    .btn-primary {
        background-color: @color_primary;
        border-color: @color_primary;
    }
    .text-primary{
        color:#fff;
    }

    .btn-default {
        background-color: @color_white;
        border-width: 1px;
        border-style: solid;
        border-color: @color_primary;
    }
</style>

<script>
    const modal=weex.requireModule('modal');
    export default{
        name: 'mt-button',
        props: {
            type: {default: 'default'},
            value: {default: 'Button'},
            disabled: {default: false},
            radius: {default: "0px"},
            size: {default: '92px'},
            btnDisable:{default: false}
        },
        computed:{
            textColor(){
                if(this.type==='default'){
                    return '#3eba6c'
                }else {
                    return this.disabled?'#78eba3':'#fff'
                }
            }
        },
        methods: {
            "_click": function (e) {
                if (!this.disabled && !this.btnDisable) {
                    this.$emit("_click");
                }
            },
            "_longpress": function (e) {
                if (!this.disabled) {
                    this.$emit("_longpress");
                }
            }
        }
    }
</script>

