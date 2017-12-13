<template>
    <div class="apply-money">
        <div class="apply-content">
            <div class="describeinfo">
                <image :style="{width:34+'px',height:30+'px',marginRight:20+'px'}" :src="getImg('inform')"></image>
                <text @click="clickDescribe" :style="{fontSize:28+'px',color:'#fe8e56'}">请务必阅读申请说明</text>
            </div>
            <div class="apply-cont">
                <div class="apply-cash" v-for="item,index in lists">
                    <text class="apply-label">{{item.name}}</text>
                    <div class="apply-textcont">
                        <div class="apply-numcont" @click = 'inputCont(item,index)'>
                            <text class="apply-text">{{item.cont}}</text>
                            <text class="apply-text" v-if="item.state && cursor">|</text>
                        </div>
                        <!--<text :style="{'fontFamily':'iconfont1','fontSize':36+'px','color':'#3eba6c'}" @click="clickDescribe">{{item.uint}}</text>-->
                    </div>
                </div>
            </div>
            <div class="apply-btn">
                <zz-button
                        class="btn-register"
                        radius="10px"
                        type="primary"
                        @_click="submitApply"
                        value="提交申请"
                        :disabled="isDisabled">
                </zz-button>
            </div>
        </div>
        <zz-dialog width="550" @btnClick="onDialogDescribeback" :show="showDescribe" buttons="我知道了" title="使用说明">
            <text class="dialog-desctext">申请成功申请成功申请成功申请成功申请成功申请成功申请成功申请成功申请成功
        申请成功申请成功申请成功申请成功申请成功申请成功申请成功申请成功申请成功申请成功
            </text>
        </zz-dialog>
        <zz-dialog width="446" @btnClick="onDialogCallback" :show="showDialog" buttons="我知道了">
            <div class="dialog-image">
                <text class="dialog-success">{{successicon}}</text>
            </div>
            <div class="dialog-cont">
                <text class="dialog-text">申请成功</text>
                <text class="dialog-text">等待审核</text>
            </div>
        </zz-dialog>
        <keyBoard v-if = 'dis' class = 'kbb' @getValue = 'getValue' :value = 'data' :regexp="regexp" @close = 'changeState' ref = 'KB'></keyBoard>
    </div>
</template>

<script>
    import {fetchApplyCash,changePage,getImgUrl,changeStorage,storageName,showMessage,showMge} from '../../func/index'
    import zzButton from '../../components/zz-button.vue';
    import zzDialog from '../../components/zz-dialog.vue';
    import zzInput from '../../components/zz-input.vue';
    import keyBoard from '../../components/keyBoard.vue'
    import he from 'he'
    export default {
        components: {
            zzButton,
            zzDialog,
            zzInput,
            keyBoard
        },
        data(){
            return {
                showDialog: false,
                showDescribe:false,
                lists: [
                    {name: '申请金额', cont: '',state:true,uint:''},
                    {name: '平台折扣', cont: '',state:false,uint:he.decode('&#xe608')},
                    {name: '联系方式', cont: '',state:false,uint:''}
                ],
                spShopId:'',
                successicon: he.decode('&#xe623'),
                dis:true,
                id:0,
                data:'',
                cursor:true,
                regexp:/^.{0,15}$/
            }
        },
        computed: {
            isDisabled(){
                let flag=true;
                for (let i = 0; i < 3; i++) {
                    if (!this.lists[i].cont) {
                        flag = false;
                        break;
                    }
                }
                return !flag;
            }
        },
        created(){
            changeStorage('get',storageName.myShopId,'')
                .then(res=>{
                    res.data==='undefined'?this.spShopId='f1ab3572556011e7b609008cfa047935':this.spShopId=res.data
                });
            setInterval(_ => {
                this.cursor=!this.cursor
            }, 500)
        },
        methods: {
            getImg(path){
                return getImgUrl(path)
            },
            clickDescribe(){
                this.showDescribe=true;
                this.dis=false;
            },
            getValue(val){
                val===null?this.lists[this.id].cont='':this.lists[this.id].cont = val
                this.data=val
                if(this.id===2){
                    if(this.lists[this.id].cont.length===11){
                        let reg = /^1(3|4|5|7|8)\d{9}$/;
                        !reg.test(this.data)?showMge('手机号格式不正确'):''
                    }}
            },
            changeState(state){
                this.dis = state
            },
            inputCont(item,id){
                switch (id){
                    case 0:
                        this.regexp=/^.{0,15}$/;
                        break;
                    case 1:
                        this.regexp= /^([1-9]|[0-9]?(\.\d{1,2})?|0\.\d{1,2}|10)$/;
                        break;
                    case 2:
                        this.regexp=/^-?(0|[1-9]\d{0,10})$/;
                        break;
                }
                this.lists[this.id].state=false;
                this.id=id;
                this.lists[id].state=true;
                this.dis = true;
                this.$nextTick(_ => {
                    this.$refs.KB.data = this.lists[id].cont===null?'':this.lists[id].cont.toString();
                    this.$refs.KB.emit(this.$refs.KB.data)
                })
            },
            submitApply(){
                let obj = {
                    spShopId: this.spShopId,
                    rechargeMoney: this.lists[0].cont,
                    discount: this.lists[1].cont,
                    phone: this.lists[2].cont
                };
                fetchApplyCash(obj)
                    .then(res => {
                        if (res.code === '200') {
                            this.showDialog = true;
                        } else {
                            showMessage(res.code)
                        }
                    })
            },
            onDialogDescribeback(){
                this.showDescribe=false;
            },
            onDialogCallback(){
                this.showDialog = false;
                changePage('my.js')('个人中心')
            }
        }
    }
</script>
<style lang="less" scoped>
    .apply-money {
        background-color: #eee;
    }
    .describeinfo{
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        background-color:#fffef1;
        height:70px;
        padding-left:36px;
        margin-top:20px;
    }
    .apply-content{
        flex:1;
    }
    .apply-cont{
        margin-top:18px;
        background-color:#fff;
    }
    .apply-cash{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height:80px;
        padding-left:36px;
        padding-right:36px;
        border-bottom-color: #ddd;
        border-bottom-width:1px;
        border-bottom-style: solid;
    }
    .apply-label,.apply-text{
        font-size:32px;
        color:#333;
    }
    .apply-numcont{
        flex:1;
        flex-direction: row;
        height:40px;
    }
    .apply-label,.apply-textcont{
        flex:1;
        flex-direction: row;
        flex-wrap:nowrap;
    }
    .apply-textcont{
        flex:2;
    }
    .apply-text{
        lines:1;
    }
    .apply-num{
        flex:1;
    }
    .apply-btn{
        margin-top: 100px;
        padding-left: 36px;
        padding-right: 36px;
    }

    .dialog-img {
        width: 130px;
        height: 130px;
        margin-bottom: 35px;
    }

    .dialog-cont {
        margin-bottom: 10px;
    }

    .dialog-text {
        margin-bottom: 25px;
        font-size: 33px;
        text-align: center;
        color: #3eba6c;
    }
    .dialog-desctext{
        color:#666;
        font-size:28px;
    }

    .dialog-success {
        margin-bottom: 35px;
        font-family: iconfont1;
        font-size: 120px;
        color: #3eba6c;
    }
</style>