<template>
    <div class="wrapper">
        <text class="name">赞赞{{versionNum}}主要更新</text>
        <div class="describe">
            <text class="des">{{description}}</text>
        </div>
    </div>
</template>

<script>
    import {versionDetail,showMessage,changeStorage,storageName} from '../../func/index'
    export default {
        data(){
          return {
              versionNum:'',
              description:''
          }
        },
    mounted(){
        changeStorage('get',storageName.versionId)
            .then(res=>versionDetail({id:res.data}))
            .then(res=>{this.versionNum=res.data.number;this.description=res.data.description})
        }
    }
</script>

<style lang="less" scoped>
    .wrapper{
        margin-top:20px;
        padding-left:36px;
        background-color:#fff;
    }
    .name{
        padding-top:30px;
        padding-bottom:30px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        padding-right:36px;
        font-size:32px;
        color:#333;
    }
    .describe{
        padding-right:36px;
        padding-top:30px;
    }
    .des{
        font-size:30px;
        color:#666;
        line-height:48px;
    }
</style>