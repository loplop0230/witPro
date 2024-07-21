export function getTimer(timer, type = 'default') { //时间戳 -> 获取年月日
    let date = new Date(timer);
    let Y = date.getFullYear() + '.';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    if (type === 'default') {// 输出结果：2014-04-23 18:55:49
        return Y + M + D + ' ' + h + m + s
    } else if (type === 'YMD') { // 输出结果：2014-04-23
        return Y + M + D
    } else if (type === 'hms') {// 输出结果：18:55:49
        return h + m + s
    }
    // console.log(Y+M+D+h+m+s);
    // 输出结果：2014-04-23 18:55:49
}

export function getDate() { //获取当前时间返回上午，中午，晚上，凌晨
    let timer = new Date()
    let y = timer.getFullYear() //年
    let m = timer.getMonth() //月
    let d = timer.getDate() //日
    let h = timer.getHours() //时
    let ms = timer.getMinutes() // 分
    let s = timer.getMilliseconds() //秒
    if (h >= 0 && h < 5) {
        return '凌晨'
    } else if (h >= 5 && h < 9) {
        return '早上'
    } else if (h >= 9 && h < 12) {
        return '上午'
    } else if (h >= 12 && h < 18) {
        return '下午'
    } else if (h >= 18 && h < 24) {
        return '晚上'
    }
}

export function setNumber(num) { //简化数字
    let newsNumber = '';
    if (num.toString().length > 6) { //百万M为单位
        let s = num.toString().substring(0, num.toString().length - 6) //百万M
        let s1 = num.toString().substring(num.toString().length - 6) //个，十，百，万，十万，显示出来
        let z = '0.' + s1
        newsNumber = myFixed(s * 1 + myFixed(z * 1, 2) * 1, 1) + 'M'; //保留两位小数
    } else if (num.toString().length > 3) { //千为单位K
        let s = num.toString().substring(0, num.toString().length - 3) //千
        let s1 = num.toString().substring(num.toString().length - 3) //个，十，百，显示出来
        let z = '0.' + s1
        newsNumber = myFixed(s * 1 + myFixed(z * 1, 2) * 1, 1) + 'K'; //保留两位小数
    } else {
        newsNumber = num;
    }
    return newsNumber
}

function myFixed(num, digit) { //取两位小数num 数字，digit保留几位小数
    if (Object.is(parseFloat(num), NaN)) {
        return console.log(`传入的值：${num}不是一个数字`);
    }
    num = parseFloat(num);
    return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
}

export function copyText(text) { //复制文本
    return new Promise((res, rej) => {
        if (!text) {
            console.log('复制失败，我是promise')
            rej(false)
            return
        }
        if (!navigator.clipboard) {
            // 如果浏览器不支持 Clipboard API，就显示一个错误提示信息，并退出函数
            console.error("对不起，您的浏览器不支持 Clipboard API");
            // 创建text area
            let textArea = document.createElement("textarea");
            textArea.value = text;
            // 使text area不在viewport，同时设置不可见
            textArea.style.position = "absolute";
            textArea.style.opacity = 0;
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res(true) : rej(false);
            console.log('复制成功，我是promise')
            textArea.remove();
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            // 复制成功时显示一个提示信息
            console.log('复制成功，我是promise')
            res(true)

        }, () => {
            // 复制失败时显示一个错误提示信息
            console.log('复制失败，我是promise')
            rej(false)

        });
    });
}

export function validateNum(num) { //保留；两位小数的正数
    let reg = /^([0]|([1-9][0-9]*)|(([0]\.\d{1,}|[1-9][0-9]*\.\d{1,})))$/
    console.log(num)
    if (!reg.test(num)) {
        console.warn('只能输入正数或零')
        return
    }
    reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if (!reg.test(num)) {
        console.warn('请保留2位小数')
        return
    }
    return num
}

export function readFile(file, fileType = 'UTF-8') { //读取文件内容
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader()
        fileReader.readAsText(file, fileType)
        fileReader.onload = function (e) {
            console.log('读取成功，我是promise')
            return resolve(e.target.result)
        }
    })

}

// 使用零宽度字符加密解密
// str -> 零宽字符
export function strToZeroWidth(str) {
    return str
        .split('')
        .map(char => char.charCodeAt(0).toString(2)) // 1 0 空格
        .join(' ')
        .split('')
        .map(binaryNum => {
            if (binaryNum === '1') {
                return '​'; // ​
            } else if (binaryNum === '0') {
                return '‌'; // ‌
            } else {
                return '‍'; // ‍
            }
        })
        .join('') // ‎
}

// 零宽字符 -> str
export function zeroWidthToStr(zeroWidthStr) {
    return zeroWidthStr
        .split('') // ‎
        .map(char => {
            if (char === '​') { // ​
                return '1';
            } else if (char === '‌') { // ‌
                return '0';
            } else { // ‍
                return ' ';
            }
        })
        .join('')
        .split(' ')
        .map(binaryNum => String.fromCharCode(parseInt(binaryNum, 2)))
        .join('')
}

//只能输入数字
export function formatterNumber(val) {
    const reg = /^[0-9]*$/
    if (reg.test(val)) {
        return val
    }
    return ''
}

//手机号码验证
export function validatePhoneNum(phone) {
    // const partern1 = /^1[3456789]\d{9}$|^0\d{2,4}-\d{7,8}$/
    const partern1 =
        /^1[3456789]\d{9}$|^01[3456789]\d{9}$|^0\d{2,4}\d{7,8}$|^\d{8}$|^(110|119|122)$/
    return !partern1.test(phone)
}

//自动根据秒换算 天时分秒，时分秒，分秒，秒
export function secondConversion(second) {
    //非数字默认0
    if (isNaN(parseInt(second))) {
        second = 0
    }
    second = Math.abs(second)
    //单个数字补齐0
    const setNumber = (value) => {
        let str = value.toString()
        if (str.indexOf('.') > -1) {
            str = str.substring(0, str.indexOf('.'))
        }
        if (str.length === 1) {
            value = `0${value}`
        }
        return value
    }
    //换算逻辑
    if (second > 59) {
        if (second > 3599) {
            if (second > 3600 * 24 - 1) {
                //天时分秒
                return `${Math.floor(second / (3600 * 24))}天${setNumber(
                    Math.floor((second % (3600 * 24)) / 3600)
                )}时${setNumber(Math.floor((second % 3600) / 60))}分${setNumber(
                    (
                        second -
                        Math.floor(second / (3600 * 24)) * 3600 * 24 -
                        Math.floor((second % (3600 * 24)) / 3600) * 3600 -
                        Math.floor((second % 3600) / 60) * 60
                    ).toFixed(0)
                )}秒`
            } else {
                //时分秒
                return `${setNumber(Math.floor(second / 3600))}时${setNumber(
                    Math.floor((second % 3600) / 60)
                )}分${setNumber(
                    (
                        second -
                        Math.floor(second / 3600) * 3600 -
                        Math.floor((second % 3600) / 60) * 60
                    ).toFixed(0)
                )}秒`
            }
        } else {
            //分秒
            return `${setNumber(Math.floor(second / 60))}分${setNumber(
                (second - Math.floor(second / 60) * 60).toFixed(0)
            )}秒`
        }
    } else {
        //秒
        return `${setNumber(second.toFixed(2))}秒`
    }
}
//滚动条跳转到选中项指定位置
/**
 * scrollContainerClassName ，父级class名
 * selectedClassName子级的class名
 * */
export const scrollToSelected = (
    scrollContainerClassName,
    selectedClassName
) => {
    const scrollContainerEl = document.querySelector(
        `.${scrollContainerClassName}`
    )
    if (scrollContainerEl) {
        const selectedElementEl = document.querySelector(`.${selectedClassName}`)
        const selectedElementOffsetTop = selectedElementEl.offsetTop
        const selectedElementHeight = selectedElementEl.offsetHeight
        const containerHeight = scrollContainerEl.clientHeight
        scrollContainerEl.scrollTop =
            selectedElementOffsetTop - containerHeight / 2 + selectedElementHeight / 2
    }
}