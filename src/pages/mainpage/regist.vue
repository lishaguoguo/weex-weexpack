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
                    flexgrow="3"
                    @input="accoutChange"
                    @allDelete="deleteAll"
                    @_blur="mblur">
            </zz-input>
            <!--<div class="tip" v-if="showtip">-->
                <!--<div style="flex:1"></div>-->
                <!--<text style="flex:4" class="tel-tip">{{tip}}</text>-->
            <!--</div>-->
            <zz-input
                    type="password"
                    label="密码"
                    placeholder="请输入6～12位密码"
                    maxlength="20"
                    :value="pass"
                    :id="1"
                    flexgrow="3"
                    @allDelete="deleteAll"
                    @input="passwordChange">
            </zz-input>
            <zz-input
                    type="password"
                    label="确认密码"
                    placeholder="请再次输入密码"
                    maxlength="20"
                    :value="newpass"
                    :id="2"
                    flexgrow="3"
                    @allDelete="deleteAll"
                    @input="newpasswordChange">
            </zz-input>
            <zz-input
                    type="text"
                    label="邀请码"
                    placeholder="请输入邀请码"
                    maxlength="20"
                    :id="3"
                    flexgrow="3"
                    :value="invitationCode"
                    @allDelete="deleteAll"
                    @input="invitationChange">
            </zz-input>
            <zz-button
                    class="btn-register"
                    radius="7px"
                    type="primary"
                    @_click="validateform"
                    value="注册"
                    size="102px"
                    :disabled="isDisabled"
                    :btnDisable="btnDisable">
            </zz-button>
        </div>
        <div class="service-terms" @click="registTerms">
            <text :style="{fontSize:26+'px',color:'#3eba6c'}">《赞赞APP注册使用协议》</text>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .register {
        flex:1;
        background-color: #fff;
    }
    .register-input{
        padding-right: 36px;
        padding-left: 36px;
        text-align: center;
    }
    .btn-register {
        margin-top: 88px;
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
    .service-terms{
        height:40px;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom:40px;
        left:0;
        right:0;
        text-align:center;
    }
</style>
<script>
    import {changePage,fetchSigninCode,changeStorage,storageName,fetchCheckSignTel,showMge,showMessage,startLoading,endLoading} from '../../func/index.js';
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
                pass: '',
                newpass:'',
                invitationCode:'',
                tip:'',
//                showtip:false,
                btnDisable:false
            }
        },
        computed: {
            isDisabled(){
                return !(this.admin && this.pass && this.newpass && this.invitationCode)
            }
        },
        methods: {
            deleteAll(id){
                id===0?this.admin='':id===1?this.pass='':id===2?this.newpass='':id===3?this.invitationCode='':''
            },
            mblur(){
                let reg = /^1(3|4|5|7|8)\d{9}$/;
                let seft = this;
                if (!reg.test(seft.admin)) {
                    showMessage("60027")//请输入正确的手机号
                }else {
                    let obj={
                        phone:seft.admin
                    };
                    fetchCheckSignTel(obj)
                        .then(param=>{
                            param.code!=='200'?showMessage(param.code):''
                        });
                }
            },
            accoutChange(value){
                this.admin = value.replace(/\s+/g,"");
            },
            passwordChange(value){
                this.pass = value;
            },
            newpasswordChange(value){
                this.newpass = value;
            },
            invitationChange(value){
                this.invitationCode = value;
            },
            validateform(){
                let seft = this;
                if(this.pass!==this.newpass){
                    showMessage('50013');//两次密码不一致
                }else if (!seft.isDisabled) {
                    this.btnDisable=true;
                    let obj={
                        phone:seft.admin,
                        invitationCode:seft.invitationCode
                    };
                    let patrn=/^(\w){6,12}$/
                    patrn.test(seft.pass)? (
                        startLoading(),
                        fetchSigninCode(obj)
                        .then(param=>{
                            endLoading();
                            if(param.code==='200'){
                                changeStorage('set',storageName.registInfor,{admin:seft.admin,pass:seft.pass,invitation:seft.invitationCode})
                                    .then(_=>changePage('authcode.js')('发送验证码'))
                                    .then(_=>this.btnDisable=false)
                            } else {
                                    showMessage(param.code);
                                    this.btnDisable=false
                            }
                        })):(
                                endLoading()
                                .then(_=>showMessage('50001'))//密码应为6～12位字母、数字、下划线
                                .then(_=>this.btnDisable=false)
                    )
                }
            },
            registTerms(){
                changePage('registTerms.js')('注册使用协议')
            }
        }
    }
</script>



