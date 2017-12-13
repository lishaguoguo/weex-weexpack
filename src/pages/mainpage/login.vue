<template>
    <div class="signin">
        <div class="login-img">
            <image class="logoimg" :src="getImg('logo')"></image>
        </div>
        <div class="sign-form">
            <zz-input
                    type="text"
                    label="账号"
                    :id="0"
                    placeholder="手机号/会员名/邮箱"
                    maxlength="20"
                    position=true
                     :value="admin"
                    @input="accoutChange"
                    @allDelete="deleteAll">
            </zz-input>
            <zz-input
                    type="password"
                    label="密码"
                    :id="1"
                    placeholder="请输入密码"
                    maxlength="20"
                    position=true
                     :value="pass"
                    @input="passwordChange"
                    @allDelete="deleteAll">
            </zz-input>
            <zz-button
                    class="btn-login"
                    radius="7px"
                    type="primary"
                    :value="btnValue"
                    size="102px"
                    :disabled="isDisabled"
                    @_click="validateform">
            </zz-button>
            <zz-button
                    class="btn-register"
                    radius="7px"
                    size="102px"
                    @_click="register"
                    value="注册">
            </zz-button>
            <div class="morebtn">
                <text class="forget" @click="forgetword">忘记密码？</text>
            </div>
        </div>
        <div class="service-terms" @click="serviceTerms">
            <text :style="{fontSize:26+'px'}">登录即代表阅读并同意</text>
            <text :style="{fontSize:26+'px',color:'#3eba6c'}">服务条款</text>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .imgsize(@size) {
        width: @size;
        height: @size;
        border-radius: @size;
    }

    .signin {
        flex: 1;
        background-color: #fff;
    }

    .login-img {
        align-items: center;
        margin-top: 160px;
    }

    .logoimg {
        .imgsize(160px);
    }

    .sign-form {
        margin-top: 84px;
        padding-right: 36px;
        padding-left: 36px;
        text-align: center;
    }

    .btn-login {
        margin-top: 66px;
    }

    .btn-register {
        margin-top: 60px;
    }

    .morebtn {
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        margin-top: 44px;
        padding-left: 12px;
        padding-right: 12px;
    }

    .forget {
        font-size: 30px;
        text-align: right;
        color: #3eba6c;
    }
    .service-terms{
        flex:1;
        height:40px;
        justify-content: center;
        flex-direction: row;
        position: fixed;
        bottom:40px;
        left:0;
        right:0;
    }
</style>
<script>
    import he from 'he'
    import {
        changePage,
        changeStorage,
        storageName,
        fetchLogin,
        fetchUserInfo,
        setVal,
        getVal,
        setUser,
        showMge,
        getImgUrl,
        showMessage,
        startLoading,endLoading,
        loginLoading,loginLoadingend
    } from '../../func/index.js';
    import zzButton from '../../components/zz-button.vue'
    import zzInput from '../../components/zz-input.vue'
    export default{
        name: 'regist',
        components: {
            zzButton,
            zzInput,
        },
        data() {
            return {
                admin: '',
                pass: '',
                loginDisaled: false,   //账号被锁定或者禁止登录时，设置登录禁止。
                prevIcon:he.decode('&#xe60c'),
                nextIcon:he.decode('&#xe6b8')
            }
        },
        computed: {
            isDisabled(){
                return !(this.admin && this.pass) || this.loginDisaled
            },
            btnValue(){
                return this.loginDisaled?'正在登录中...':'登录'
            }
        },
        methods: {
            deleteAll(id){
                id===0?this.admin='':id===1?this.pass='':''
            },
            accoutChange(value){
                this.admin = value.replace(/\s+/g,"");
            },
            passwordChange(value){
                this.pass = value;
            },
            validateform(){
                let self = this;
                if (!self.isDisabled) {
                    this.loginDisaled = true;
                    let object = {
                        username: self.admin,
                        password: self.pass,
                        flag: 'mobile'
                    };
//                    startLoading()
                    loginLoading();
                        fetchLogin(object)
                        .then(params => {
                            loginLoadingend()
                                    switch (params.code) {
                                        case '200':
//                                        changeStorage('set', storageName.saveToken, params.data)
//                                        .then(()=>this.fetchUser())
                                            setVal(params.data)
                                                .then(() => this.fetchUser());
                                            break;
                                        case '40002':
                                            if (params.data) {
                                                showMge( '还有' + params.data.num + '次登录机会');
                                            } else {
                                                showMessage('50019');//用户名或密码错误
                                            }
                                            this.loginDisaled = false;
                                            break;
                                        default:
                                            showMessage(params.code)
                                            this.loginDisaled = false;
                                    }
                        });
                    setTimeout(()=>{
                        this.loginDisaled = false;
                        endLoading();
                    },10000);
                }
            },
            fetchUser(){
                fetchUserInfo()
                    .then(param => {
                        if (param.code === '200') {
                            param.data.password=this.pass;
                            changeStorage('set', storageName.loginUserInfo, param.data)
                            setUser(param.data)
                                .then(() => {
                                    changePage('home.js')('首页')
                                });
                            this.loginDisaled = false;
                        } else {
                            showMessage('50011');//请重新登录
                            this.loginDisaled = false;
                        }
                    })
            },
            register(){
                changePage('regist.js')('注册');
            },
            forgetword(){
                changePage('forgetpassword.js')('忘记密码')
            },
            getImg(path){
                return getImgUrl(path)
            },
            serviceTerms(){
                changePage('serviceTerms.js')('用户使用协议')
            }
        },
        mounted(){
            changeStorage('set', storageName.saveToken, '')
        }
    }
</script>



