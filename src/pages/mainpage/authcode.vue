<template>
    <div class="authcode">
        <div class="authcode-box">
            <div class="authcode-tip">
                <text class="post-code">我们已经发送了验证码到您的手机：</text>
                <text class="post-tel">{{tel}}</text>
            </div>
            <div class="input-box">
                <zz-input
                        type="text"
                        label="验证码"
                        placeholder="请输入验证码"
                        maxlength="10"
                        isAuthcode='true'
                        :authDisabled="authDisabled"
                        @input="authChange"
                        @postCode="postAuthCode"
                        @allDelete="deleteAll"
                        @resendCode="resendCode">
                </zz-input>
                <!--<div class="tip" v-if="showtip">-->
                    <!--<div style="flex:1"></div>-->
                    <!--<text style="flex:4" class="tel-tip">{{tip}}</text>-->
                <!--</div>-->
            </div>
        </div>
        <div class="apply-btn">
            <zz-button
                    class="btn-register"
                    radius="7px"
                    type="primary"
                    @_click="nextStep"
                    :disabled="isDisabled"
                    :btnDisable="btnDisable"
                    value="下一步">
            </zz-button>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .authcode {
        text-align: center;
        background-color: #eeeeee;
    }
    .authcode-tip {
        height: 128px;
        justify-content: center;
        align-items: center;
    }

    .post-code {
        font-size: 24px;
    }

    .post-tel {
        margin-top: 16px;
        font-size: 36px;
    }

    .input-box {
        padding-right: 36px;
        padding-left: 36px;
        background-color: #fff;
    }
    .apply-btn {
        margin-top: 36px;
        padding-right: 36px;
        padding-left: 36px;
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
    import {changePage,fetchCheckCode,fetchRegister,fetchSigninCode,changeStorage,storageName,showMge,showMessage,startLoading,endLoading} from '../../func/index.js';
    import zzButton from '../../components/zz-button.vue'
    import zzInput from '../../components/zz-input.vue'
    export default {
        components: {
            zzButton,
            zzInput
        },
        data(){
            return{
                authcode:'',
                authDisabled:true,
                tel:'',
                pass:'',
                invitation:'',
                tip:'',
//                showtip:false,
                btnDisable:false
            }
        },
        computed: {
            isDisabled(){
                return !(this.authcode)
            }
        },
        methods: {
            authChange(value){
                this.authcode=value;
            },
            deleteAll(id){
                id===0?this.authcode='':''
            },
            nextStep(){
                let self=this;
                this.btnDisable=true;
                if(!self.isDisabled){
                    let obj={
                        phone:self.tel,
                        code:self.authcode
                    };
                    startLoading()
                        fetchCheckCode(obj)
                        .then(param=>{
                            if(param.code==='200'){
//                                this.showtip=false;
                                let object={
                                    account:self.tel,
                                    password:self.pass,
                                    code:self.authcode,
                                    phoneNo:self.tel,
                                    invitationCode:self.invitation
                                };
                                fetchRegister(object)
                                    .then(res=>{
                                        endLoading();
                                        if(res.code==='200'){
                                                showMessage('50002');//注册成功，正在前往登录页面
                                                setTimeout(()=>{
                                                    changePage('login.js')()
                                                        .then(_=>this.btnDisable=false)
                                                },2000)
                                        }else {
                                            showMessage(res.code)
                                        }
                                    })
                            }else if(param.code==='60005'){
//                                this.showtip=true;
//                                this.tip = "请重新输入验证码";
                                endLoading()
                                showMessage(param.code)
                                    this.btnDisable=false
                            }else {
                                endLoading()
                                   showMessage(param)
                            }
                        })
                }
            },
            postAuthCode(){
                startLoading()
                let obj={
                    phone:this.tel,
                    invitationCode:this.invitation
                };
                fetchSigninCode(obj)
                    .then(res=>{
                        endLoading();
                        res.code!=='200'?showMessage(res.code):(this.authDisabled = true,showMessage('50018'));
                    })
            },
            resendCode(){
                this.authDisabled = false
            }
        },
        created(){
            changeStorage('get',storageName.registInfor)
                .then(res=>res.data)
                .then(param=>{
                    this.tel=param.admin;
                    this.pass=param.pass;
                    this.invitation=param.invitation;
                });
        }
    }
</script>