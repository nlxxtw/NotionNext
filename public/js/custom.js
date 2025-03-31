
// 自定义页面标题变化脚本
var originalTitle = document.title;
var timeout;
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        document.title = '欢迎肥来👀' + originalTitle;
        timeout = setTimeout(function () {
            document.title = originalTitle;
        }, 3000);
    } else {
        document.title = 'Where are U🎈';
        clearTimeout(timeout);
    }
});
