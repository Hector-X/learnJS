// 定义我们的 log 函数

const log = console.log.bind(console)

// 定义我们用于测试的函数
// ensure 接受两个参数
// condition 是 bool, 如果为 false, 则输出 message
// 否则, 不做任何处理
const ensure = (condition, message) => {
    // 在条件不成立的时候, 输出 message
    if (!condition) {
        log('*** 测试失败:', message)
    }
}

// 1
// 补全函数
const jsonToCSS = (s) => {
    /*
    s 是一个 json 格式的字符串, 把 s 转成 css 格式的字符串
    */
   let jsonObj = JSON.parse(s)
   let styleArray = Object.keys(jsonObj)
   let resultString = ''
   for (let index = 0; index < styleArray.length; index++) {
       const tabName = styleArray[index]
       resultString += tabName + ' {\n'
       let cssPropsObj = jsonObj[tabName]
       let cssPropsKey = Object.keys(cssPropsObj) 
       for (let i = 0; i < cssPropsKey.length; i++) {
           const item = cssPropsKey[i]
           trueItem = camelCaseToHyphen(item)
           resultString += `    ${trueItem}: ${cssPropsObj[item]};\n`
       }
       if (index !== styleArray.length - 1) {
        resultString += '}\n\n' 
       } else {
           resultString += '}\n'
       }
   }
   log('函数输出的值', resultString)
   return resultString
}

//还需要检验下被错误命名的属性名，刚好就是第一课要求的函数
const isCamelCase = (s) => {
    /*
    如果 s 是驼峰字符串的形式, 则返回 true, 否则返回 false
    注意, 我们只考虑小驼峰的形式, 也就是第一个字符一定是小写
    */
    let inputString = s
    let uppercase = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    if (isLower(inputString[0])) {
        for (let index = 1; index < inputString.length; index++) {
            const element = inputString[index]
            if (isUpper(element)) {
                return true
            }
        }
        return false
    } else {
        return false
    }
}

const isUpper = (s) => {
    let uppercase = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    return uppercase.includes(s)
}

const isLower = (s) => {
    let lowercase = 'qwertyuiopasdfghjklzxcvbnm'
    return lowercase.includes(s)
}

const camelCaseToHyphen = (s) => {
    /*
    如果 s 是驼峰字符串的形式(比如 marginLeft), 则把 s 转成连接符的形式,
    也就是用连接符而非驼峰表示, 并且后面的单词也换成小写, 即转成 margin-left 的形式
    如果 s 不是驼峰字符串, 直接返回原始字符串
    */
    let inputString = s
    let resultString = ''
    if (isCamelCase(inputString)) {
        //需要检查一下大写字符串的位置了
        for (let index = 0; index < inputString.length; index++) {
            const element = inputString[index]
            if (isUpper(element)) {
                resultString += `-${element.toLowerCase()}`
            } else {
                resultString += element
            }
        }
        return resultString
    } else {
        return inputString
    }
}


// 测试函数
const testJsonToCSS = () => {
    let o1 = `{
    "h1": {
        "height": "200px"
    }
}`
    let o2 = `{
    "h1": {
        "width": "200px",
        "fontSize": "14px"
    },
    "h2": {
        "height": "100px",
        "text-align": "center"
    }
}`
    let r1 = `h1 {
    height: 200px;
}`

    let r2 = `h1 {
    width: 200px;
    font-size: 14px;
}

h2 {
    height: 100px;
    text-align: center;
}`
    log('正确值r1', r1)
    log('正确值r2', r2)

    ensure(jsonToCSS(o1) === r1, 'test json to css 1')
    ensure(jsonToCSS(o2) === r2, 'test json to css 2')
}

const __main = () => {
    testJsonToCSS()
}

__main()