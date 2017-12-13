<template>
    <div class="record">
        <zz-scroller v-if = '!nulldata' class="list" ref="list" :isOnepage="isOnepage" @refresh="onRefresh" @loading="onLoading">
            <zz-record class="record-list" :records="records"></zz-record>
        </zz-scroller>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
    </div>
</template>
<script>
    import{fetchWithdrawRecord,changeStorage,storageName,showMge,showMessage,startLoading,endLoading,saveValue,
        getValue,} from '../../func/index'
    import zzNavbar from '../../components/zz-navbar.vue'
    import zzRecord from '../../components/zz-record.vue'
    import zzScroller from '../../components/zz-scroller.vue'
    import dataBlock from '../../components/dataBlock.vue'
    const rowsNumber=15;
    export default {
        components: {
            zzNavbar,
            zzRecord,
            zzScroller,
            dataBlock
        },
        data(){
            return {
                records:[],
                month:'',
                totalPage:'',
                spShopId:'',
                currentPage:1,
                nulldata: false,//控制没有数据时显示空页面
                isOnepage:false,//只有一页数据时，删除加载组件
            }
        },
        methods:{
            fetchListData(isRefresh){
                this.month='';
                let refreshObj={
                    spShopId:this.spShopId,
                    page:this.currentPage,
                    rows:rowsNumber
                };
                return fetchWithdrawRecord(refreshObj)
                    .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                    .then(param=>{
                        if(param.code==='200'){
                            isRefresh?this.records=param.data.list:this.records=this.records.concat(param.data.list);
                            this.records.forEach(item=>{
                                this.month===item.createTime.substring(5, 7)?Vue.set(item,'showMonth',false):Vue.set(item,'showMonth',true);
                                this.month=item.createTime.substring(5, 7);
                                item.cashWithdrawal=String(item.cashWithdrawal).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,');
                                Vue.set(item,'month',item.createTime.substring(5, 7))
                            })
                        }else if(param.code!=='60012'){
                            showMessage(param.code)
                        };
                        return param.code
                    })
            },
            onRefresh(event){
                this.currentPage=1;
                this.fetchListData(true)
                    .then(()=> {
                        this.$refs.list.$emit('refreshDone');
                        this.$refs.list.$emit('reomveloading',false);
                    });
            },
            onLoading (event) {
                //curentpage判断
                this.currentPage++;
                    this.fetchListData(false)
                        .then(res => {
                            this.$refs.list.$emit('loadingDone');
                       res==='60012'?this.$refs.list.$emit('reomveloading',true):'';
                        });
            }
        },
        created(){
            startLoading();
                getValue('myShopId')
                .then(res=> this.spShopId=res.value)
                .then(_=>this.fetchListData(true))
                .then(res=>{res==='60012'?this.nulldata=true:''})
        },
    }
</script>

<style lang="less" scoped>
    .record {
        background-color: #f6f6f6;
    }
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
</style>