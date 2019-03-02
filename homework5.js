// 定义我们的 log 函数
const log = console.log.bind(console)

const ensure = (condition, message) => {
    if (!condition) {
        log('*** 测试失败:', message)
    } else {
        log('+++ 测试成功')
    }
}

const escapeCharElement = (s) => {
    let escapeChar = ['a', 'b', 'f', 'n', 'r', 't', 'v', '\\', '\'', '\"', '?', '/']
    let realEscapeChar = ['\a', '\b', '\f', '\n', '\r', '\t', '\v', '\\', '\'', '\"', '\?', '\/']
    let index = escapeChar.findIndex(function isEqualChar(element) {
        return element === s
    })
    return realEscapeChar[index]
}

const isChar = (s) => {
    let wordMap = 'qwertyuiopasdfghjklzxcvbnm'
    let capitalWordMap = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    return wordMap.includes(s) || capitalWordMap.includes(s)

}

const isNumber = (s) => {
    let numberMap = '0123456789'
    return numberMap.includes(s)

}

const isSymbol = (s) => {
    let symbolMap = '{}[]:,'
    return symbolMap.includes(s)

}

const stringElement = (s) => {
    let parseString = ''
    for (let index = 0; index < s.length; index++) {
        const element = s[index]
        if (element === '"' && s[index - 1] !== '\\') {
            break
        }
        parseString += element
    }
    return parseString
}

const sepcialElement = (s) => {
    let parseString = ''
    for (let index = 0; index < s.length; index++) {
        const element = s[index]
        if (!isChar(element)) {
            break
        }
        parseString += element
    }
    return parseString
}

const numberElement = (s) => {
    let parseString = ''
    for (let index = 0; index < s.length; index++) {
        const element = s[index]
        if (index === 0 && element === '-') {
            parseString += '-'
            continue
        }
        if (element !== '.' && !isNumber(element)) {
            break
        }
        parseString += element
    }
    return parseString
}

const jsonTokens = (s) => {
    // 把 json 字符串解析成 tokens 数组的形式
    let inputString = s
    let index = 0
    let result = []
    while (index < inputString.length) {
        const element = inputString[index]
        if (element === '"') {
            //解析String Elemnt
            let praseStr = stringElement(inputString.slice(index + 1, inputString.length))
            //这里多加2是为了跳过后面的引号
            index += praseStr.length + 2
            //todo:在插入之前,可能需要对转义字符做一次校验和转换再插入！
            result.push(convertEscapeChar(praseStr))
        } else if (isSymbol(element)) {
            index++
            result.push(element)
        } else if (isNumber(element) || element === '-') {
            let parseNumber = numberElement(inputString.slice(index, inputString.length))
            index += parseNumber.length
            result.push(convertNumber(parseNumber))
        } else if (isChar(element)) {
            let parseSepcialStr = sepcialElement(inputString.slice(index, inputString.length))
            index += parseSepcialStr.length
            result.push(convertSepcialToken(parseSepcialStr))
        } else {
            index++
        }
    }
    return result
}

const convertSepcialToken = (parseSepcialStr) => {
    if (parseSepcialStr === 'true') {
        return true
    } else if (parseSepcialStr === 'false') {
        return false
    } else if (parseSepcialStr === 'null') {
        return null
    }
    return ''
}

const convertEscapeChar = (string) => {
    let index = 0
    let result = ''
    while (index < string.length) {
        const element = string[index]
        if (element === '\\') {
            result += escapeCharElement(string[index + 1])
            index += 2
            continue
        }
        result += element
        index++
    }
    return result
}

const parsedList = (tokens) => {
    let parsedList = []
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index]
        if (element === ']') {
            break
        }
        if (element !== '[' && element !== ',') {
            parsedList.push(element)
        }
    }
    return parsedList
}

const parsedDict = (tokens) => {
    // 解析 tokens, 返回解析后的 object
    let parsedObject = {}
    let index = 0
    let meetInsideObj = false
    while (index < tokens.length) {
        const element = tokens[index]
        //以冒号为基准，有点问题，因为{里面也有冒号
        if (element === ':' && !meetInsideObj) {
            let key = tokens[index - 1]
            //这里value的值不指1个token需要处理下
            let value = ''
            if (tokens[index + 1] === '{') {
                meetInsideObj = true
                value = parsedDict(tokens.slice(index + 1, tokens.length))
            } else if (tokens[index + 1] === '[') {
                value = parsedList(tokens.slice(index + 1, tokens.length))
            } else {
                //没有嵌套
                value = tokens[index + 1]
            }
            parsedObject[key] = value
        }
        if (element === '}') {
            meetInsideObj = false
            break
        }
        index++
    }
    return parsedObject
}


const convertNumber = (s) => {
    // 不手写解析函数了,直接用JS的解析API
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '.') {
            return parseFloat(s)
        }
    }
    return parseInt(s)
}

const parsedJson = (tokens) => {
    let resultObj = parsedDict(tokens)
    return resultObj
}

const parse = (s) => {
    let inputString = String.raw `${s}`
    let getJsonTokens = jsonTokens(inputString)
    let jsonObject = parsedJson(getJsonTokens)
    log(jsonObject)
    return jsonObject
}

// 测试函数
const testParse = () => {
    //用raw这种方式能拿到原始的字符串
    let s1 = String.raw `{
    "s1": "gua",
    "num1": 11,
    "num2": -20,
    "num3": 12.5
}`
    let r1 = parse(s1)
    ensure(r1.num2 === -20 && r1.num3 === 12.5, 'test parse 1')

    let s2 = String.raw `{
    "s1": "gua",
    "s2": "a\bb\fc\nd\re\tf\\g\/h\"i"
}`
    let r2 = parse(s2)
    ensure(r2.s2 === "a\bb\fc\nd\re\tf\\g\/h\"i", 'test parse 2')

    let s3 = String.raw `{
    "arr1": [1, 2, 3],
    "obj": {
        "arr2": [4, 5, 6],
        "obj2": {
            "key1": [7, 10.3]
        }
    }
}`
    let r3 = parse(s3)
    ensure(r3.obj.arr2.length === 3 && r3.obj.obj2.key1.includes(10.3), 'test parse 3')

    let s4 = String.raw `{
    "boolean": true,
    "null": null
}`
    let r4 = parse(s4)
    ensure(r4.boolean && r4.null === null, 'test parse 4')
}

const __main = () => {
    testParse()
}

__main()