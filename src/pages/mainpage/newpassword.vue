<template>
    <div class="register">
        <div class="register-input">
            <zz-input
                    type="password"
                    label="新密码"
                    placeholder="请输入6～12位密码"
                    maxlength="20"
                    :value="pass"
                    :id="0"
                    @allDelete="deleteAll"
                    @input="passChange"
                    flexgrow="2">
            </zz-input>
            <zz-input
                    type="password"
                    label="确认新密码"
                    placeholder="请再次输入密码"
                    maxlength="20"
                    :value="newpass"
                    :id="1"
                    @allDelete="deleteAll"
                    @input="newpassChange"
                    flexgrow="2">
            </zz-input>
        </div>
        <zz-button
                class="btn-register"
                radius="7px"
                type="primary"
                @_click="complete"
                :disabled="isDisabled"
                :btnDisable="btnDisable"
                value="完成">
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
</style>
<script>
    import {changePage, fetchForgetNewpass, changeStorage, storageName,showMessage,showMge,startLoading,endLoading} from '../../func/index.js';
    import zzButton from '../../components/zz-button.vue'
    import zzInput from '../../components/zz-input.vue'
    export default{
        components: {
            zzButton,
            zzInput
        },
        data() {
            return {
                pass: '',
                newpass: '',
                phone:'',
                code:'',
                btnDisable:false
            }
        },
        computed: {
            isDisabled(){
                return !(this.pass && this.newpass)
            }
        },
        methods: {
            deleteAll(id){
                id===0?this.pass='':id===1?this.newpass='':''
            },
            passChange(value){
                this.pass = value;
            },
            newpassChange(value){
                this.newpass = value;
            },
            complete(){
                let patrn=/^(\w){6,12}$/
                if(!patrn.test(this.pass)){
                    showMessage('50001') //密码应为6～12位字母、数字、下划线
                }else if (this.pass !== this.newpass) {
                    showMessage('50013');//两次密码不一致
                }else {
                    let self=this;
                    if (!self.isDisabled) {
                        this.btnDisable=true;
                        if (self.pass === self.newpass) {
                            let obj = {
                                phone:self.phone,
                                newPassword:self.pass,
                                code:self.code
                            };
                            startLoading()
                                fetchForgetNewpass(obj)
                                .then(res=>{
                                    endLoading();
                                    if(res.code==='200'){
                                        showMessage('50012')//密码已重置，请重新登录
                                            setTimeout(()=>{
                                                changePage('login.js')();
                                                this.btnDisable=false
                                            },2000)
                                    }else {
                                           showMessage(res.code)
                                        this.btnDisable=false
                                    }
                                })
                        }
                    }
                }
            }
        },
        created(){
            changeStorage('get', storageName.forgetPhone)
                .then(res=>{
                    this.phone=res.data.phone;
                    this.code=res.data.code
                })
        }
    }
</script>



