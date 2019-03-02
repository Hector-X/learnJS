//找位置的这个思路很重要，而且每一步得到的数据，刚好就是满足输入条件的数组，
//而且重点在遍历的步进不是1，找到完整的字符串或者数字的话，需要直接跳到下一个位置来判断

//下面是作业逻辑
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
const numberElement = (s) => {
    // s 是一个以数字开头的字符串
    // 解析 s, 返回对应的数值
    // 提示, 遍历 s, 找到第一个不是字符串的位置, 直接返回
    // 只需要考虑正整数的情况
    let inputString = s
    let numberMap = '0123456789'
    let firstMeetNumber = false
    let startIndex = 0
    let endIndex = 0
    for (let index = 0; index < inputString.length; index++) {
        const element = inputString[index]
        if (!firstMeetNumber && numberMap.includes(element)) {
            startIndex = index
            firstMeetNumber = true
        }
        if (firstMeetNumber && !numberMap.includes(element)) {
            endIndex = index
            break
        }
    }
    return inputString.slice(startIndex, endIndex)
}

const stringElement = (s) => {
    // s 是一个以字母开头的字符串
    // 解析 s, 返回对应的字符串
    // 提示, 遍历 s, 找到第一个不是字母的位置, 直接返回
    // 只需要考虑字母的情况, 不需要考虑 - 或者 _ 的情况, 不需要考虑转义字符的情况
    let inputString = s
    let firstMeetWord = false
    let startIndex = 0
    let endIndex = 0
    for (let index = 0; index < inputString.length; index++) {
        const element = inputString[index]
        if (!firstMeetWord && isWord(element)) {
            startIndex = index
            firstMeetWord = true
        }
        if (firstMeetWord && !isWord(element)) {
            endIndex = index
            break
        }
    }
    return inputString.slice(startIndex, endIndex)
}

const isWord = (s) => {
    let wordMap = 'qwertyuiopasdfghjklzxcvbnm'
    let capitalWordMap = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    if (wordMap.includes(s) || capitalWordMap.includes(s)) {
        return true
    }
    return false
}

const isNumber = (s) => {
    let numberMap = '0123456789'
    if (numberMap.includes(s)) {
        return true
    }
    return false
}

const isSymbol = (s) => {
    let symbolMap = '{}[]:,'
    if (symbolMap.includes(s)) {
        return true
    }
    return false
}

// 3
// 补全函数
const jsonTokens = (s) => {
    // 把 json 字符串解析成 tokens 数组的形式
    // 提示
    // 1. 遍历字符串, 根据不同情况 push 不同元素到数组中
    // 2. 如果遇到的是 ", 按照字符串来处理
    // 3. 如果遇到的事数字, 按照数值来处理
    // 4. 如果遇到 '{', '}', '[', ']', ':', ',' 这几个字符, 直接 push 到数组中
    // 5. 如果遇到空白字符, 如换行, 空格, 缩进等, 直接跳过
    let inputString = s
    let index = 0
    let resultArray = []
    while (index < inputString.length) {
        let currentString = inputString.slice(index, inputString.length)
        const element = inputString[index]
        if (isSymbol(element)) {
            resultArray.push(element)
            index++
        } else if (isNumber(element)) {
            let getNumber = numberElement(currentString)
            resultArray.push(getNumber)
            index += getNumber.length
        } else if (isWord(element)) {
            let getWord = stringElement(currentString)
            resultArray.push(getWord)
            index += getWord.length
        } else {
            index++
        }
    }

    // log('token解析数组', resultArray)
    return resultArray
}

const arrayEquals = (arrayA, arrayB) => {
    if (arrayA === undefined || arrayB === undefined) {
        return false
    }
    if (arrayA.length != arrayB.length) {
        return false
    }
    let size = arrayA.length
    for (let index = 0; index < size; index++) {
        if (arrayA[index] !== arrayB[index]) {
            return false
        }
    }
    return true
}

// 测试函数
const testJsonTokens = () => {
    let s1 = `
    {
       "name": "gua",
       "height": 169
    }
    `
    let expected1 = ["{", "name", ":", "gua", ",", "height", ":", "169", "}"]
    ensure(arrayEquals(jsonTokens(s1), expected1), 'test json tokens 1')

    let s2 = `
    {
        "location": ["hhvb"]
    }
    `
    let expected2 = ["{", "location", ":", "[", "hhvb", "]", "}"]
    ensure(arrayEquals(jsonTokens(s2), expected2), 'test json tokens 2')

    let s3 = `
    {
        "name": "gua",
        "height": 169,
        "location": ["hhvb"]
    }
    `
    let expected3 = ["{", "name", ":", "gua", ",", "height", ":", "169", ",", "location", ":", "[", "hhvb", "]", "}"]
    ensure(arrayEquals(jsonTokens(s3), expected3), 'test json tokens 3')
}

const __main = () => {
    testJsonTokens()
}

__main()