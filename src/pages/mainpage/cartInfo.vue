<template>
    <div class="cartinfo">
        <div class="apply-content">
            <div class="apply-cont">
                <div class="apply-cash" v-for="item,index in lists" :key="index" append="tree">
                    <text class="apply-label">{{item.name}}</text>
                    <div class="apply-textcont">
                        <div class="apply-numcont" @click = 'inputCont(item,index)' v-if="index===2">
                            <div :style="{flex:25,flexDirection:'row'}">
                                <text class="apply-text" :style="{flex:24}">支付满</text>
                                <div class="apply-condition">
                                    <text class="apply-text condition" :style="{textAlign:'center'}">{{item.cont}}</text>
                                    <div :style="{width:6+'px'}">
                                        <text class="apply-text" v-if="item.state && cursor">|</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="apply-numcont" @click = 'inputCont(item,index)' v-else>
                            <text class="apply-text inputcont" :style="{flex:25}">{{item.cont}}</text>
                            <div :style="{flex:1}" >
                                <text class="apply-text" v-if="item.state && cursor">|</text>
                            </div>
                        </div>
                        <text class="apply-text">{{item.uint}}</text>
                    </div>
                </div>
            </div>
            <div class="total-money">
                <text class="total-text">总金额：{{totalMoney}}元</text>
            </div>
            <div class="apply-btn">
                <zz-button
                        class="btn-register"
                        radius="10px"
                        type="primary"
                        @_click="submitApply"
                        value="确定"
                        :disabled="isDisabled">
                </zz-button>
            </div>
        </div>
        <keyBoard v-if = 'dis' class = 'kbb' @getValue = 'getValue' :value = 'data' :regexp="regexp" @close = 'changeState' ref = 'KB'></keyBoard>
    </div>
</template>

<script>
    import zzButton from '../../components/zz-button.vue';
    import zzInput from '../../components/zz-input.vue';
    import keyBoard from '../../components/keyBoard.vue'
    import {changePage,changeStorage,storageName,showMge,showMessage} from '../../func/index'
    export default {
        components: {
            zzButton,
            zzInput,
            keyBoard
        },
        data(){
            return {
                lists: [
                    {name: '数量', cont: '',uint:'张',state:true},
                    {name: '金额', cont: '',uint:'元',state:false}
                ],
                showDialog: false,
                dis:true,
                id:0,
                data:'',
                cursor:true,
                regexp:/^\+?[1-9][0-9]*$/,
                cursorTime:[],
                cartType:2
            }
        },
        computed: {
            isDisabled(){
                let flag=true;
                for (let i = 0; i < this.lists.length; i++) {
                    if (!this.lists[i].cont) {
                        flag = false;
                        break;
                    }
                }
                return !flag;
            },
            totalMoney(){
                let num=this.lists[0].cont===''?0:parseInt(this.lists[0].cont);
                let money=this.lists[1].cont===''?0:parseFloat(this.lists[1].cont);
                return (num*(money*100)/100).toFixed(2)
            }
        },
        created(){
            setInterval(_ => {
                this.cursor = !this.cursor
            }, 500);
            changeStorage('get',storageName.cartType)
                .then(res=>this.cartType=res.data)
                .then(_=>this.cartType===1?this.lists.push({name: '使用条件', cont: '',uint:'元可用',state:false}):'')
        },
        methods: {
            getValue(val){
                val===null?this.lists[this.id].cont='':this.lists[this.id].cont = val
                this.data=val;
            },
            changeState(state){
                this.dis = state;
            },
            inputCont(item,id){
                this.lists[this.id].state=false
                this.id=id;
                id===0?this.regexp=/^\+?[1-9][0-9]*$/:this.regexp=/^.{0,10}$/;
                item.state=true;
                this.dis = true;
                this.$nextTick(_ => {
                    this.$refs.KB.data = this.lists[id].cont===null?'':this.lists[id].cont.toString();
                    this.$refs.KB.emit(this.$refs.KB.data)
                })
            },
            submitApply(){
                let fullAmount=this.cartType===1?this.lists[2].cont:this.lists[1].cont
                let cartinfo={
                    couponQuantity:parseInt(this.lists[0].cont),
                    discountAmount:this.lists[1].cont,
                    fullAmount:fullAmount
                };
                changeStorage('set',storageName.cartInfo,cartinfo)
                this.cartType===1?parseFloat(cartinfo.fullAmount)>parseFloat(cartinfo.discountAmount)?changePage('addCart.js')('添加卡券'):showMessage('50003'):changePage('addCart.js')('添加卡券') //满减金额应大于优惠金额
            }
        }
    }
</script>

<style lang="less" scoped>
    .cartinfo {
        background-color: #eee;
    }
    .apply-content{
        flex:1;
    }
    .apply-cont {
        margin-top: 18px;
        background-color: #fff;
    }
    .apply-btn{
        margin-top: 100px;
        padding-left: 36px;
        padding-right: 36px;
    }
    .apply-cash{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height:90px;
        padding-left:36px;
        padding-right:36px;
        border-bottom-color: #ddd;
        border-bottom-width:1px;
        border-bottom-style: solid;
    }
    .apply-numcont{
        flex:1;
        flex-direction: row;
        margin-right:5px;
        height:40px;
    }
    .apply-label,.apply-text{
        font-size:32px;
        color:#333;
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
        text-align:right;
        lines:1;
    }
    .inputcont,.condition{
        color:#3eba6e;
    }
    .apply-condition{
        flex:8;
        flex-direction:row;
        justify-content: center;
        padding-left:10px;
        padding-right:10px;
        border-bottom-style:solid;
        border-bottom-color: #3eba6e;
        border-bottom-width:1px;
    }
    .total-money{
        padding-left:36px;
        padding-top:20px;
    }
    .total-text{
        font-size:32px;
        color:#848484;
    }

</style>