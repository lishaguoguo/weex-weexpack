<template>
    <scroller class="scroller-wrapper" show-scrollbar="false">
        <refresh class="div-refresh" :display="refreshDisplay" @refresh="onRefresh">
            <!--<text class="text-tip" v-if="refreshDisplay === 'hide'">{{refreshTip}}</text>-->
            <loading-indicator style="height: 60px; width: 60px;color:#3eba6e;"></loading-indicator>
        </refresh>
        <slot></slot>
        <loading class="div-loading" :display="loadingDisplay" @loading="onLoading" v-if="!loadingEnd">
            <!--<text class="text-tip" v-if="loadingDisplay==='hide'">{{loadingTip}}</text>-->
            <!--<text class="text-tip" v-else>正在加载</text>-->
            <loading-indicator style="height: 60px; width: 60px;color:#3eba6e;"></loading-indicator>
        </loading>
        <div v-if="loadingEnd" class="footerend">
            <text class="text-end" >我是有底线的！</text>
        </div>
    </scroller>
</template>

<script>
    const modal = weex.requireModule('modal')
    export default {
        name:'mt-list',
        data() {
            return {
                refreshDisplay: 'hide',
                loadingDisplay: 'hide',
                refreshPause: false,
                loadingPause: false,
                loadingEnd:false,
            }
        },
        props: {
            refreshTip: {
                type: String,
                default: '↓ 下拉刷新'
            },
            loadingTip: {
                type: String,
                default: '-----loading-----'
            }
        },
        mounted () {
            this.$on('refreshDone', (e) => {
                setTimeout(()=>{
                    this.refreshDisplay = 'hide'
                },500);
            })

            this.$on('loadingDone', (e) => {
                setTimeout(()=>{
                    this.loadingDisplay = 'hide'
                },500);
            });
            this.$on('reomveloading',(e)=>{
                this.loadingEnd=e;
            })
        },

        methods: {
            onReset() {
                setTimeout(() => {
                    this.refreshPause = false
                    this.refreshDisplay = 'hide'
                    this.loadingPause = false
                    this.loadingDisplay = 'hide'
                }, 1000)
            },

            onRefresh (e) {
                this.refreshDisplay = 'show'
                if (this.refreshPause) {
                    this.onReset()
                    return
                }
                this.refreshPause = true
                this.$emit('refresh', e)
                // 三秒之内只允许一次加载
                setTimeout(() => {
                    this.refreshPause = false
                }, 1000)
                // 十秒超时
                setTimeout(() => {
                    if (this.refreshDisplay === 'show') {
                        this.onReset()
//                        modal.toast({
//                            message: '网络请求超时~'
//                        })
                    }
                }, 5000)
            },

            onLoading (e) {
                this.loadingDisplay = 'show'
                if (this.loadingPause) {
                    this.onReset()
                    return
                }
                this.loadingPause = true
                this.$emit('loading', e)
                // 三秒之内只允许一次加载
                setTimeout(() => {
                    this.loadingPause = false
                }, 1000)
                // 十秒超时
                setTimeout(() => {
                    if (this.loadingDisplay === 'show') {
                        this.onReset()
//                        modal.toast({
//                            message: '网络请求超时~'
//                        })
                    }
                }, 5000)
            }
        }
    }
</script>

<style lang="less" scoped>
    .div-refresh {
        height: 120px;
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
    }

    .div-loading {
        height: 80px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
    .refresh-arrow {
        font-size: 30px;
        color: #45b5f0;
    }
    .indicator {
        height: 40px;
        width: 40px;
        color: #45b5f0;
    }

    .text-tip ,.text-end{
        width:750px;
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 24px;
        text-align:center;
        color: #a8a8a8;
    }
    .text-end{
        text-align:center;
    }
    .text-img{
        width:50px;
        height:50px;
    }
    /*.footerend{*/
        /*position: fixed;*/
        /*left:0;*/
        /*right:0;*/
        /*bottom:20px;*/
    /*}*/
</style>
