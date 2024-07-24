let numArray = ['.', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], //数字规则
    creatDig, //第一层div
    creatChildren, //第二层div
    numChildren, //第三层数字[0,1,2,3,4,5,6,7,8,9]dom
    topHeight, //第三层数字的移动高度
    option = {
        number: '',
        el: '',
        speed: '0.8s'
    }
export default function incrementCounter(obj) {
    const {number, el, speed} = {...option, ...obj}
    if (isNaN(number * 1)) {
        throw new Error('number of an object is not a Number type');
    }
    try {
        let numberBox = document.querySelector(el) //获取到的dom盒子
        const numberLength = number.toString().split('')
        //创建个十百千位的dom
        const handleCreated = async (dom) => {
            creatDig = document.createElement('div')
            creatDig.style.position = 'relative'
            creatDig.style.overflow = 'hidden'
            creatDig.innerHTML = `<span style="opacity: 0">0</span>`
            creatChildren = document.createElement('div')
            creatChildren.className = 'w-warp'
            creatChildren.style.position = 'absolute'
            creatChildren.style.left = '0'
            creatChildren.style.right = '0'
            creatChildren.style.margin = 'auto'
            creatDig.appendChild(creatChildren)
            dom.appendChild(creatDig)
            topHeight = creatDig.clientHeight
            creatChildren.style.transform = `translateY(-${topHeight}px)`
            for (let i = 0; i < numArray.length; i++) {
                numChildren = document.createElement('div')
                numChildren.style.position = 'relative'
                numChildren.style.left = '0'
                numChildren.style.right = '0'
                numChildren.style.margin = 'auto'
                numChildren.innerHTML = numArray[i].toString()
                creatChildren.appendChild(numChildren)
            }
        }
        //如果dom大于数字 需要删除多余dom
        const delUnnecessaryDom = async () => {
            if (numberBox.children.length > 0) {
                let length = Array.from(numberBox.children).length.toString()
                for (let i = length - 1; i >= 0; i--) {
                    if (!numberLength[i]) {
                        Array.from(numberBox.children)[i].remove()
                    }
                }
            }
        }
        (async () => {
            await delUnnecessaryDom()
            for (let i = 0; i < numberLength.length; i++) {
                //如果dom不存在 需要创建
                if (!numberBox.children[i]) {
                    await handleCreated(numberBox)
                }
                let targetDom = Array.from(numberBox.children[i].children).find((i) => i.className === 'w-warp')
                if (!isNaN(numberLength[i] * 1)) {
                    targetDom.style.transform = `translateY(-${topHeight * (numberLength[i] * 1 + 2)}px)`
                } else {
                    targetDom.style.transform = `translateY(-${topHeight}px)`
                }
                targetDom.style.transition = `all ${speed} cubic-bezier(0.65, 0.05, 0.36, 1) 0s`

            }
        })()
    } catch (err) {
        throw new Error(err)
    }
}