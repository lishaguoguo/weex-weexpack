import Login from './pages/mainpage/login.vue'
import Home from './pages/home.vue'

var domModule = weex.requireModule('dom')

const src = '//at.alicdn.com/t/font_baezmq63jhpk3xr.ttf'

const fontsrc='//at.alicdn.com/t/font_328579_dkofwh9c1f758kt9.ttf'

domModule.addRule('fontFace', {
    'fontFamily': "iconfont",
    'src': `url('http:${src}')`
});
domModule.addRule('fontFace', {
    'fontFamily': "iconfont1",
    'src': `url('http:${fontsrc}')`
});

new Vue({
    el: '#root',
    render: h => h(Login)
});
