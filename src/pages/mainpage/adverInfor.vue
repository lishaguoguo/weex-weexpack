<template>
    <div>
        <web class = 'chart-webview' :src = 'weburl' :style="{height: webHeight+'px'}"></web>
    </div>
</template>

<script>
    import {changeStorage,storageName} from '../../func/index'
    export default {
        data(){
          return {
              weburl:''
          }
        },
        computed:{
           webHeight(){
                return weex.config.env.deviceHeight
            }
        },
        mounted(){
                changeStorage('get', storageName.adverUrl)
                    .then(res=>this.weburl=res.data)
            }
    }
</script>

<style scoped>
.chart-webview{
    width:750px;
}
</style>