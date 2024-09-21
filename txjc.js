// wechat_redirect.js

(function() {
    var isWeixin = /MicroMessenger/i.test(navigator.userAgent);
    var isQQBrowser = /QQBrowser/i.test(navigator.userAgent);
    var isQQ = /QQ/i.test(navigator.userAgent);
    var isQZone = /Qzone/i.test(navigator.userAgent);
    var isTM = /TencentTraveler/i.test(navigator.userAgent);

    // 检测是否在腾讯系浏览器或微信环境中
    if (isWeixin || isQQBrowser || isQQ || isQZone || isTM) {
        // 获取当前页面的URL
        var currentUrl = window.location.href;
        // 构建跳转URL
        var redirectUrl = "https://eazyfun.github.io/js/?redirect=" + currentUrl;
        // 跳转到提示页面，并附带原页面URL作为参数
        window.location.href = redirectUrl;
    }else {// 获取查询参数redirect的值
        var urlParams = new URLSearchParams(window.location.search);
        var redirectUrl = urlParams.get('redirect');

        // 设置页面立即跳转到解析出的原始页面URL
        window.location.href = redirectUrl;

    }
})();
