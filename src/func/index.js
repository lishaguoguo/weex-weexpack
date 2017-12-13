import he from 'he'
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
const animation = weex.requireModule('animation')
const stream = weex.requireModule('stream')
export const baseURL = 'file://assets/'
// export const baseURL = 'file:///'
export const imgBase = 'local:///'

const eventModule = weex.requireModule('event')
const globalEvent = weex.requireModule('globalEvent')

//rap数据 路径
const projectNum = 22494
export const fetchMockBase = (taskNum = 22494) => `http://rapapi.org/mockjsdata/${taskNum}`

// storage 管理
import * as storageNameObj from './storage.js'
export const storageName = storageNameObj

//原生ios扩展module 函数api

//存储token值
export const setVal = jsonStr => new Promise((rsl, rej) => eventModule.confirm(jsonStr, res => rsl(res)))
//取值
export const getVal = jsonStr => new Promise((rsl, rej) => eventModule.obtain(jsonStr, res => rsl(res)))
//监听有效时间
export const getTime = jsonStr => new Promise((rsl, rej) => eventModule.time(jsonStr , res => rsl(res)))
//存储用户信息值
export const setUser = jsonStr => new Promise((rsl, rej) => eventModule.userinfo(jsonStr, res => rsl(res)))
//保存二维码
export const saveQr = jsonStr => new Promise((rsl, rej) => eventModule.saveClick(jsonStr, res => rsl(res)))
//调原生相机
export const callCamera = jsonStr => new Promise((rsl, rej) => eventModule.callCamera(jsonStr, res => rsl(res)))
//调原生相机返回值
export const callPicture = jsonStr => new Promise((rsl, rej) => eventModule.callPictures(jsonStr, res => rsl(res)))
//获取店铺地址
export const getAddress = jsonStr => new Promise((rsl, rej) => eventModule.address(jsonStr, res => rsl(res)))
//开始loading图
export const startLoading = jsonStr => new Promise((rsl, rej) => eventModule.startAnimating (jsonStr, res => rsl(res)))
//结束loading图
export const endLoading = jsonStr => new Promise((rsl, rej) => eventModule.stopAnimating (jsonStr, res => rsl(res)))
//页面跳转
export const changePage = (jsUrl = '') => (headerStr = '') => new Promise((rsl, rej) => eventModule.openURL(jsUrl, headerStr, res => rsl(res)))
//卡券分享
export const cardShare = jsonStr => new Promise((rsl, rej) => eventModule.share (jsonStr, res => rsl(res)))
//显示弹框
export const showMge = jsonStr => new Promise((rsl, rej) => eventModule.showMessage(jsonStr, res => rsl(res)))
//显示分类弹框
export const showMgeCode = jsonStr => new Promise((rsl, rej) => eventModule.showMessageForCode(jsonStr, res => rsl(res)))
//登录弹框开始
export const loginLoading = jsonStr => new Promise((rsl, rej) => eventModule.showLoginLoading(jsonStr, res => rsl(res)))
//登录弹框结束
export const loginLoadingend = jsonStr => new Promise((rsl, rej) => eventModule.stopAnimating(jsonStr, res => rsl(res)))
//普通存值
export const saveValue = (key) => (value = '') => new Promise((rsl, rej) => eventModule.putValue(key, value, res => rsl(res)))
//普通取值
export const getValue = (key) => new Promise((rsl, rej) => eventModule.getValue(key, res => rsl(res)))

//本地跳转
// export const changePage = (path = '') => (headerStr = '') => new Promise((reslove, reject) => {
//     headerStr.indexOf('/')<0?headerStr='pages/mainpage/':'';
//     navigator.push({
//         url: `${baseURL}${headerStr}${path}`
//     }, _ => reslove())
// })

//api函数
export const decode = val => he.decode(val)
export const backPage = _ => new Promise((reslove, reject) => {
    navigator.pop(_ => reslove())
})


export const getImgUrl = path => weex.config.env.platform.toLowerCase()==='android'?`${imgBase}${path}`:`http://${path}.png`
export const mobileFlag = weex.config.env.platform.toLowerCase()==='android'?0:1  //android为0，ios为1
export const changeStorage = (type, key = '', val = '') => new Promise((reslove, reject) => {
    switch (type) {
        case 'set':
            storage.setItem(key, JSON.stringify(val), e => reslove(e))
            break
        case 'get':
            storage.getItem(key, e => {
                e.result === 'success'?e.data= JSON.parse(e.data):e.data='';
                reslove(e)
            })
            break
        case 'remove':
            storage.removeItem(key, e => reslove(e))
            break
        case 'getAll':
            storage.getAllKeys(e => reslove(e))
            break
        default:
            showMge('error please choose a legal type')
            break
    }
})

export const controlStrLength = str => str.length >= 8 ? str.substring(0, 7) + '...' : str

export const statusJudge = param => {
    switch (param) {
        case "1":
            return '待支付'
        case "2":
            return '收款成功'
        case "3":
            return '已关闭'
        case "4":
            return '已退款'
        case "5":
            return '退款失败'
        case "6":
            return '退款中'
        default:
            return '订单错误'
    }
}

const handleDate = dateNum => dateNum >= 10 ? `${dateNum}` : `0${dateNum}`

// export const getDateNow = (dateCount = 0) => {
//     let date = new Date()
//     date.setDate(date.getDate() + dateCount)
//     return `${date.getFullYear()}-${handleDate(date.getMonth() + 1)}-${handleDate(date.getDate())}`
// }
export const  getDateNow=(dateCount = 0)=>{
    let d=new Date();
    let localTime = d.getTime();
    let localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数,这里可能是负数
    let utc = localTime + localOffset; //utc即GMT时间
    let offset = 8; //时区，北京市+8  美国华盛顿为 -5
    let localSecondTime = utc + (3600000*offset);  //本地对应的毫秒数
    let date = new Date(localSecondTime);
    date.setDate(date.getDate() + dateCount)
    return `${date.getFullYear()}-${handleDate(date.getMonth() + 1)}-${handleDate(date.getDate())}`
    // console.log("根据本地时间得知"+timeZone+"时区的时间是 " + date.toLocaleString());
    // console.log("系统默认展示时间方式是："+ date)
}

export const getMonth = (monthCount = 0) => {
    let date = new Date()
    date.setMonth(date.getMonth() + monthCount)
    return `${date.getFullYear()}-${handleDate(date.getMonth() + 1)}`
}

export const saveEditData = param => changeStorage('get', storageName.editData)
    .then(e => Object.assign({}, e.data, param))
    .then(data => changeStorage('set', storageName.editData, data))
    .then(e => new Promise((reslove, reject) => {
        e.result === 'success' ? (
                reslove()
        ) : (
            showMgeCode('50015'),//保存失败
                reject()
        )
    }))
    .then(_=>changeStorage('get', storageName.editType))
    .then(res=>res.data==='edit'||res.data==='save-edit'?'编辑店铺':'添加店铺')
    .then(e => changePage('addShop.js')(e))


//请求 api

const getTypeParam = (params, addByte = true) => {
    let paramstring = addByte ? '?' : ''
    for(let i in params){
        paramstring += `${i}=${params[i]}&`
    }
    return paramstring
}

const paramGetPlus = params => {
    let paramstring = ''
    for(let i in params){
        paramstring += `/${params[i]}`
    }
    return paramstring
}
//请求超时
const timeOut = ()=>new Promise(function(resolve, reject) {
    setTimeout(resolve, 6000, {code:'600'});
});

//get请求方法
const fetchGet = (testFetchUrl, path, params, takeParamWay) => new Promise((reslove, reject) => {
    // changeStorage('get',storageName.saveToken)
    // .then(res => res.data)
    getVal()
        .then(res => res.token)
        .then(token => {
            stream.fetch({
                method: 'GET',
                type: 'json',
                url: `${testFetchUrl}${path}${takeParamWay(params)}`,
                headers: {Authorization:token}
            }, res => {
                res.ok ? reslove(res.data) : reject(res);
            })
        })
})

//post请求方法
const fetchPost=(testFetchUrl, path, param) => new Promise((resolve, reject) => {
    // changeStorage('get',storageName.saveToken)
    // .then(res => res.data)
    getVal()
        .then(res => res.token)
        .then(token=>{
            stream.fetch({
                method: 'POST',
                type:'json',
                headers: {Authorization:token},
                body: getTypeParam(param, false),
                url: `${testFetchUrl}${path}`
            }, res => {
                res.ok ? resolve(res.data) : reject(res);
            })
        })
});
const fetchMethod=(testFetchUrl = testFetchUrl, path, params, takeParamWay = getTypeParam)=>Promise.race([timeOut(), fetchGet(testFetchUrl, path, params, takeParamWay)])
const fetchWay=(testFetchUrl = testFetchUrl, path, param)=>Promise.race([timeOut(), fetchPost(testFetchUrl, path, param)])

 const testFetchUrl = 'http://mt.qdxiao2.com/api-mt'
 let testUrl='http://mt.qdxiao2.com/api-auth';
 let testFetch='http://mt.qdxiao2.com/api-account';

//const testFetchUrl = 'http://p.zanzanmd.cn/api-mt'
//let testUrl='http://p.zanzanmd.cn/api-auth';
//let testFetch='http://p.zanzanmd.cn/api-account';
const advUrl = 'http://zzad.qdxiao2.com';
//http://192.168.1.101:8080

export const getAdvlist= params => fetchMethod(advUrl, `/ad/adList/0`,params,paramGetPlus)
export const advClick= params => fetchMethod(advUrl, `/ad/c/${params}`,{},paramGetPlus)

//商家登录
export const fetchLogin = params => fetchWay(testUrl, '/auth/v1/login', params)

//刷新token
export const fetchToken = (flag) => fetchWay(testUrl, `/auth/v1/isOnline/${flag}`)  //要传入flag=mobile

//获取用户信息
export const fetchUserInfo = () => fetchWay(testUrl, '/user/v1/userinfo');

//退出登录
export const fetchLogout = () => fetchWay(testUrl, '/auth/v1/logout');




//注册时验证手机号是否被注册
export const fetchCheckSignTel = params => fetchWay(testFetch, '/user/v1/checkPhone', params);

//注册中的发送验证码
export const fetchSigninCode = params => fetchWay(testFetch, '/user/v1/getVerificationCode', params);

//注册中的验证手机验证码
export const fetchCheckCode = params => fetchWay(testFetch, '/user/v1/check', params);

//保存注册信息
export const fetchRegister = params => fetchWay(testFetch, '/user/v1/register', params);

//忘记密码中的发送验证码
export const fetchForgetCode = params => fetchWay(testFetch, '/user/v1/send', params);

//忘记密码中的验证手机验证码
export const fetchForgetCheckCode = params => fetchWay(testFetch, '/user/v1/forget', params);

//忘记密码中的设置新密码
export const fetchForgetNewpass = params => fetchWay(testFetch, '/user/v1/newPassword', params);

//查看店铺权限列表
export const fetchPermission = params => fetchWay(testFetch, `/permission/v1/find`,params)

//修改店铺权限列表
export const fetchChangePermission = params => fetchWay(testFetch, `/permission/v1/update`, params)

//获取门店账号信息
export const fetchShopAccount= params => fetchMethod(testFetch, `/sm/v1/infos`, params,paramGetPlus)

//修改门店账号信息
export const fetchUpdateSpAccount= params => fetchWay(testFetch, `/sm/v1/update`, params)

//获取收银员账号列表
export const fetchCashierList= () => fetchMethod(testFetch, `/cm/v1/list`)

//查看此收银员账号信息
export const fetchCashierAccount= params => fetchMethod(testFetch, `/cm/v1/infos`,params,paramGetPlus)

//编辑收银员账号信息
export const fetchEditCashierAc= params => fetchWay(testFetch, `/cm/v1/update`,params)

//添加收银员账号信息
export const fetchAddCashierAc= params => fetchWay(testFetch, `/cm/v1/add`,params)

//删除收银员账号信息
export const fetchDelCashierAc= params => fetchMethod(testFetch, `/cm/v1/del`,params,paramGetPlus)


//获取店铺提现记录
export const fetchWithdrawRecord = params => fetchWay(testFetchUrl, `/withdrawal/v1/list`, params)

//申请充值金
export const fetchApplyCash = params => fetchWay(testFetchUrl, `/recharge/v1/info`, params)

//获取店铺卡券信息
export const fetchShopCart = params => fetchMethod(testFetchUrl, `/coupon/v1/list`, params)

//获取店铺已使用的卡券信息
export const fetchUsedCart = params => fetchMethod(testFetchUrl, `/couponReceive/v1/list`, params)

//删除已使用卡券信息
export const fetchDeleteUsedCart = params => fetchWay(testFetchUrl, `/couponReceive/v1/del`, params)

//删除该批次卡券信息
export const fetchDeleteCart = params => fetchWay(testFetchUrl, `/coupon/v1/delete`, params)

//申请店铺卡券上线
export const fetchApplyCartLine = params => fetchMethod(testFetchUrl, `/coupon/v1/apply`, params, paramGetPlus)

//添加店铺卡券信息
export const fetchAddCart = params => fetchWay(testFetchUrl, `/coupon/v1/save`, params)

//判断卡券是否可以分享
export const fetchCardShare = params => fetchMethod(testFetchUrl, `/coupon/v1/isReceive`, params,paramGetPlus)

//获取生成二维码秘钥
export const fetchOnlyKey = params => fetchWay(testFetchUrl, `/qr/v1/getPaySecret`, params)

//生成二维码
export const fetchQrcode = params => `${testFetchUrl}/common/gen/qrcode/v1/gennerateQcode?paySecret=${params.paySecret}&codeNo=${params.codeNo}`

//从静态服务器下载图片
export const fetchRemoteImg = params => fetchMethod(testFetchUrl, `/upload/v1/download`, params)


//店铺列表
export const fetchShopList = params => fetchMethod(testFetchUrl, '/shop/v1/list', params)

//店铺详情
export const fetchShopDetail = params => fetchMethod(testFetchUrl, '/shop/v1/view', params)

//行业列表
export const fetchIndustry = params => fetchMethod(testFetchUrl, '/industry/v1/list', params)

//查询报表 统计数据
export const fetchChartCount = params => fetchMethod(testFetchUrl, '/report/v1/findTotalForDate', params)

//报表页面 店铺总计信息
export const fetchChartTotal = params => fetchMethod(testFetchUrl, '/report/v1/findTotal', params)

//删除店铺
export const deleteShop = params => fetchMethod(testFetchUrl, '/shop/v1/delete', params, paramGetPlus)

//添加，编辑店铺
export const editShop = params => fetchWay(testFetchUrl, '/shop/v1/updateOrAdd', params)
// export const editShop = params => fetchMethod('/shop/v1/updateOrAdd', params)

//个人中心 显示信息
export const fetchUserPageInfo = (params = {}) => fetchMethod(testFetchUrl, '/personalCenter/v1/query', params)

//获取今日店铺交易金额及交易笔数（获取首页交易金额信息也用此接口）
export const fetchTodayTotal = params => fetchMethod(testFetchUrl, '/bill/v1/todayTotal', params)

//获取店铺下交易列表（包括筛选）
export const fetchBillList = params => fetchWay(testFetchUrl, '/bill/v1/list', params)

//获取交易记录详情页面信息
export const fetchBillDetail = params => fetchMethod(testFetchUrl, '/bill/v1/detail', params, paramGetPlus)

//获取交易记录详情页面信息
export const fetchBillRefund = params => fetchWay(testFetchUrl, '/tb/refund/v1/doRefund', params)

//判断是否 满足提现条件
export const cashQualification = params => fetchWay(testFetchUrl, '/dowithdrawal/v1/wdtoday', params)

//获取提现前商铺余额
export const fetchCashBanlance = params => fetchMethod(testFetchUrl, '/shop/v1/shopbalance', params, paramGetPlus)

//提现详情
export const getCashDetail = params => fetchWay(testFetchUrl, '/dowithdrawal/v1/detail', params)

//查看银行卡信息
export const fetchBankList = params => fetchMethod(testFetchUrl, '/bankcard/v1/list', params)

//提现
export const cashment = params => fetchWay(testFetchUrl, '/dowithdrawal/v1/dowithdrawal', params)

//获取商家提现手续费费率
export const cashTipMoney = params => fetchMethod(testFetch, '/personal/v1/getCommission', params)

//获取版本信息列表
export const versionList = params => fetchMethod(testFetchUrl, '/jc/version/v1/list', params)

//获取版本信息详情
export const versionDetail = params => fetchWay(testFetchUrl, '/jc/version/v1/explain', params)

//时间戳转日期
export const formatDate = nS => {
    let date = new Date(nS);
    return date.getFullYear() + '-' + handleDate(date.getMonth() + 1) + '-' + handleDate(date.getDate())
};

export const formatTime = nS => {
    let date = new Date(nS)
    return `${formatDate(nS)} ${handleDate(date.getHours())}:${handleDate(date.getMinutes())}:${handleDate(date.getSeconds())}`
}
export const stringDate = nS => {
    return nS.length > 10 ? nS.substring(0, 10) : nS
}
//显示错误码提示框
export const showMessage = params => showMgeCode(params)
export const showMessageOld = params => {
    switch (params){
        case '60001':
            return showMgeCode('修改失败');
        // case '60002':
        //     return showMgeCode('数据调取失败，请稍后再试')
        case '60003':
            return showMgeCode('账号信息异常,请联系客服提交异常信息');
        // case '60033':
        //     return showMgeCode('对不起，系统开小差了,请稍后再试')
        case '60005':
            return showMgeCode('验证码错误');
        case '60008':
            return showMgeCode('实名认证失败');
        case '60009':
            return showMgeCode('密码认证失败');
        case '60010':
            return showMgeCode('验证码发送失败，请检查网络连接是否正常');
        case '60011':
            return showMgeCode('手机号未被注册');
        case '60013':
            return showMgeCode('请先选择店铺');
        case '60014':
            return showMgeCode('请输入商家账号');
        case '60015':
            return showMgeCode('⼿机号码已被注册，请修改后再试');
        case '60016':
            return showMgeCode('该店铺已存在');
        case '60017':
            return showMgeCode('请添加银行卡');
        case '60018':
            return showMgeCode('当日已提现，不能重复提现');
        case '60019':
            return showMgeCode('不在提现申请时间');
        case '60020':
            return showMgeCode('店铺余额不足');
        case '60022':
            return showMgeCode('今日已经提现');
        // case '60023':
        //     return showMgeCode('获取数据出错，请稍后再试')
        case '60026':
            return showMgeCode('持卡人信息错误，请重新核对信息');
        case '60027':
            return showMgeCode('手机号错误，请输入正确的手机号');
        case '60028':
            return showMgeCode('银行卡信息错误，请核对后再试');
        case '60029':
            return showMgeCode('申请充值金失败');
        case '60030':
            return showMgeCode('保存失败，请稍后再试')
        case '60031':
            return showMgeCode('卡券已过期');
        case '60032':
            return showMgeCode('请勿重复操作');
        case '60034':
            return showMgeCode('该身份证号已经绑定账号，请勿重复绑定');
        case '60035':
            return showMgeCode('删除失败，请稍后再试')
        case '60038':
            return showMgeCode('余额不足');
        case '60039':
            return showMgeCode('当前交易状态⽆法退款');
        case '60040':
            return showMgeCode('邀请码错误，请核对后再试');
        case '60041':
            return showMgeCode('请先添加店铺');
        case '60042':
            return showMgeCode('请勿修改相同手机号');
        case '60044':
            return showMgeCode('退款失败');
        case '60045':
            return showMgeCode('正在退款…');
        case '60046':
            return showMgeCode('店铺账号不能为手机号');
        case '60052':
            return showMgeCode('卡券已领完');
        case '40041':
            return showMgeCode('请添加店铺');
        case '40010':
            return showMgeCode('发送验证码过于频繁，请两个小时后再试');
        case '40004':
            return showMgeCode('权限不足，请联系管理员');
        case '40050':
            return showMgeCode('账号已存在');
        case '40051':
            return showMgeCode('请完善店铺信息后再试');
        case '40003':
        case '40001':
            return showMgeCode('登录信息失效，请重新登录')
        case '40009':
            return showMgeCode('密码输入错误超过5次，请两个小时后再试');
        case '40008':
            return showMgeCode('账号被禁止登录');
        case '50001':
            return showMgeCode('密码应为6～12位字母、数字、下划线');
        case '50002':
            return showMgeCode('注册成功，正在前往登录页面');
        case '50003':
            return showMgeCode('满减金额应大于优惠金额');
        case '50005':
            return showMgeCode('店铺负责人不能多于16位字符');
        case '50006':
            return showMgeCode('店铺名称不能多于16位字符');
        case '50007':
            return showMgeCode('店铺负责人不能为纯数字');
        case '50008':
            return showMgeCode('店铺名称不能为纯数字');
        case '50009':
            return showMgeCode('存在非法字符，请重新输入');
        // case '50010':
        //     return showMgeCode('请输入正确的手机号');
        case '50011':
            return showMgeCode('请重新登录');
        case '50012':
            return showMgeCode('密码已重置，请重新登录');
        case '50013':
            return showMgeCode('两次密码不一致');
        case '50014':
            return showMgeCode('退款申请已提交');
        case '50015':
            return showMgeCode('保存失败');
        case '50016':
            return showMgeCode('退款说明不能超过16个字');
        case '50017':
            return showMgeCode('正在登录');
        case '50018':
            return showMgeCode('验证码已发送');
        case '50019':
            return showMgeCode('用户名或密码错误');
        case '50020':
            return showMgeCode('保存成功');
        case '50021':
            return showMgeCode('请输入提现金额');
        case '50022':
            return showMgeCode('请先选择卡券类型');
        case '50023':
            return showMgeCode('添加成功，可继续添加');
        case '500':
        case '600':
            return showMgeCode('对不起，系统开小差了,请稍后再试');
    }
};