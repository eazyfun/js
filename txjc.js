function isTencentOrWeChatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return (
        ua.indexOf('micromessenger')!== -1 ||
        ua.indexOf('qqbrowser')!== -1 ||
        ua.indexOf('tencenttraveler')!== -1 ||
        ua.indexOf('mqqbrowser')!== -1 ||
        ua.indexOf('qq/')!== -1 ||
        ua.indexOf('qzone/')!== -1 ||
        ua.indexOf('weishi/')!== -1 ||
        ua.indexOf('qqmusic/')!== -1 ||
        ua.indexOf('tencentnews/')!== -1 ||
        ua.indexOf('qqmail/')!== -1 ||
        ua.indexOf('qqreader/')!== -1 ||
        ua.indexOf('qqpim/')!== -1 ||
        ua.indexOf('qqhd/')!== -1 ||
        ua.indexOf('qqsecure/')!== -1 ||
        ua.indexOf('qqwifimanager/')!== -1 ||
        ua.indexOf('qqlive/')!== -1 ||
        ua.indexOf('qqpinyin/')!== -1 ||
        ua.indexOf('qqkj/')!== -1 ||
        ua.indexOf('qqdownloader/')!== -1 ||
        ua.indexOf('qqlite/')!== -1 ||
        ua.indexOf('qqvideo/')!== -1 ||
        ua.indexOf('qqbrowserlite/')!== -1 ||
        ua.indexOf('qqsync/')!== -1 ||
        ua.indexOf('qqbrowserhd/')!== -1 ||
        ua.indexOf('qqbrowserpad/')!== -1 ||
        ua.indexOf('qqbrowsermini/')!== -1 ||
        ua.indexOf('qqinternational/')!== -1 ||
        ua.indexOf('qqbrowserenterprise/')!== -1 ||
        ua.indexOf('qqbrowserforlinux/')!== -1 ||
        ua.indexOf('qqbrowserforandroid/')!== -1 ||
        ua.indexOf('qqbrowserforiphone/')!== -1 ||
        ua.indexOf('qqbrowserforipad/')!== -1
    );
}

function getCurrentURL() {
    return window.location.href;
}

function redirectToThirdPartyBrowser() {
    const currentURL = getCurrentURL();
    window.location.href = `https://eazyfun.github.io/js/?redirect=${encodeURIComponent(currentURL)}`;
}

function redirectToOriginalURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectURL = urlParams.get('redirect');
    if (redirectURL) {
        window.location.href = redirectURL;
    } else {
        console.error('No redirect URL found.');
    }
}

function detectAndRedirect() {
    if (isTencentOrWeChatBrowser()) {
        redirectToThirdPartyBrowser();
    } else {
        redirectToOriginalURL();
    }
}

// 立即执行检测和重定向函数
detectAndRedirect();
