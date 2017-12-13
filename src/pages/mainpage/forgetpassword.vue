<template>
    <div class="register">
        <div class="register-input">
            <zz-input
                    type="tel"
                    label="账号"
                    placeholder="请输入手机号"
                    maxlength="20"
                    :value="admin"
                    :id="0"
                    @allDelete="deleteAll"
                    @input="accoutChange">
            </zz-input>
            <!--<div class="tip" v-if="showtip">-->
                <!--<div style="flex:1"></div>-->
                <!--<text style="flex:4" class="tel-tip">手机号码不正确</text>-->
            <!--</div>-->
            <zz-input
                    type="text"
                    label="验证码"
                    placeholder="请输入验证码"
                    maxlength="10"
                    isAuthcode='true'
                    :id="1"
                    :authDisabled="authDisabled"
                    @input="authChange"
                    @allDelete="deleteAll"
                    @postCode="postAuthCode"
                    @resendCode="resendCode">
            </zz-input>
        </div>
        <zz-button
                class="btn-register"
                radius="5px"
                type="primary"
                @_click="nextstep"
                value="下一步"
                :disabled="isDisabled"
                :btnDisable="btnDisable">
        </zz-button>
    </div>
</template>
<style lang="less" scoped>
    .register {
        padding-right: 36px;
        padding-left: 36px;
        text-align: center;
        background-color: #fff;
    }
    .btn-register {
        margin-top: 90px;
    }
    .tip{
        flex-direction: row;
        height:60px;
        align-items: center;
    }
    .tel-tip{
        color:#f00;
        font-size:25px;
    }
</style>
<script>
    import {changePage,fetchForgetCode,fetchForgetCheckCode,changeStorage,storageName,showMge,showMessage,startLoading,endLoading} from '../../func/index.js'
    import zzButton from '../../components/zz-button.vue'
    import zzInput from '../../components/zz-input.vue'
    export default{
        components: {
            zzButton,
            zzInput
        },
        data() {
            return {
                admin: '',
                authcode: '',
                authDisabled: false,
                tip:'',
                btnDisable:false,
                oldPhone:''
            }
        },
        computed: {
            isDisabled(){
                return !(this.admin && this.authcode)
            }
        },
        methods: {
            accoutChange(value){
                this.admin = value
            },
            authChange(value){
                this.authcode = value
            },
            deleteAll(id){
                id===0?this.admin='':id===1?this.authcode='':''
            },
            validateform(){
                let reg = /^1(3|4|5|7|8)\d{9}$/;
                return reg.test(this.admin);
            },
            postAuthCode(){
                if (!this.validateform()) {
                    showMessage('60027')//请输入正确的手机号
                } else{
                    let obj = {
                        phone: this.admin
                    };
                    this.oldPhone=this.admin;
                    startLoading();
                    fetchForgetCode(obj)
                        .then(res=>{endLoading();return res})
                        .then(res => {
                            res.code!=='200'?showMessage(res.code):(this.authDisabled = true,showMessage('50018'))
                        })
                }
            },
            resendCode(){
                this.authDisabled = false;
            },
            nextstep(){
                this.btnDisable=true;
                if (!this.isDisabled) {
                    let obj={
                        phone:this.oldPhone,
                        code:this.authcode
                    };
                    startLoading()
                        fetchForgetCheckCode(obj)
                        .then(res=>{
                            endLoading();
                            if(res.code==='200'){
                                changeStorage('set',storageName.forgetPhone,{phone:this.oldPhone,code:this.authcode})
                                    .then(_=>{changePage('newpassword.js')('新密码');this.btnDisable=false})
                            }else{
                                    showMessage(res.code);
                                this.btnDisable=false
                            }
                        })
                }
            }
        }
    }
</script>



