// 定义我们的 log 函数

const log = console.log.bind(console)

const ensure = (condition, message) => {
    // 在条件不成立的时候, 输出 message
    if (!condition) {
        log('*** 测试失败:', message)
    } else {
        log('+++ 测试成功')
    }
}

const parsedList = (tokens) => {
    let parsedList = []
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index]
        if (element === ']') {
            break
        } else if (element === ',') {
            continue
        }
        parsedList.push(element)
    }
    return parsedList
}

const parsedDict = (tokens) => {
    // tokens 是一个包含部分 JSON object tokens 的数组
    // 解析 tokens, 返回解析后的 object
    let parsedObject = {}
    let starIndex = 0
    let index = 0
    let tmpTokens = []
    //加一个flag用于过滤,导致错误分割的问题
    let didMeetArray = false

    while (index < tokens.length) {
        const element = tokens[index]
        if (element === ',' && !didMeetArray) {
            tmpTokens = tokens.slice(starIndex, index)
            Object.assign(parsedObject, parsedProps(tmpTokens))
            starIndex = index + 1
        } else if (element === '[') {
            didMeetArray = true
        } else if (element === ']') {
            didMeetArray = false
        }

        index++
    }

    //循环出来以后，就是剩下的最后一个属性
    tmpTokens = tokens.slice(starIndex, index - 1)
    Object.assign(parsedObject, parsedProps(tmpTokens))
    return parsedObject
}

const parsedProps = (tokens) => {
    if (tokens === undefined) {
        return tokens
    }

    let key = ''
    let splitIndex = 0
    let parsedObject = {}
    //根据属性对token的特点，：号左边只有一个字段，可以直接使用，右边的处理会复杂一下，需要判断一下是否是数组
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index]
        if (element === ':') {
            splitIndex = index
        }
    }
    key = tokens.slice(splitIndex - 1, splitIndex)
    let tmpValue = tokens.slice(splitIndex + 1, tokens.length)
    if (tmpValue[0] === '[') {
        //说明是个数组
        parsedObject[key] = parsedList(tmpValue.slice(1, tmpValue.length))
    } else {
        parsedObject[key] = tmpValue[0]
    }

    return parsedObject
}

const objectEquals = (objectA, objectB) => {
    //先处理undefined
    if ((objectA === undefined && objectB !== undefined) || (objectB === undefined && objectA !== undefined)) {
        return false
    }
    if (Object.keys(objectA).length !== Object.keys(objectB).length) {
        return false
    }
    let size = Object.keys(objectA).length
    for (let index = 0; index < size; index++) {
        let key = Object.keys(objectA)[index]
        // 好需要考虑值的类型，对象，数组
        if (Array.isArray(objectA[key])) {
            if (!arrayEquals(objectA[key], objectB[key])) {
                return false
            }
        } else if (Object.prototype.toString.call(objectA[key]) === '[object Object]') {
            if (!objectEquals(objectA[key], objectB[key])) {
                return false
            }
        } else {
            if (objectA[key] !== objectB[key]) {
                return false
            }
        }
    }
    return true
}


const arrayEquals = (arrayA, arrayB) => {
    if (arrayA === undefined || arrayB === undefined) {
        return false
    }
    if (arrayA.length !== arrayB.length) {
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
const parsedJson = (tokens) => {
    // tokens 是一个包含 JSON tokens 的数组
    // 解析 tokens, 返回解析后的 object 或者数组
    // 不需要考虑数组嵌套数组和字典嵌套字典的情况
    if (tokens[0] === '{') {
        return parsedDict(tokens.slice(1, tokens.length))
    } else if (tokens[0] === '[') {
        return parsedList(tokens.slice(1, tokens.length))
    }
    return {}
    // 提示
    // 1. 如果第一个元素是 '{', 那么对余下的元素按照 object 处理
    // 2. 如果第一个元素是 '[', 那么对余下的元素按照 array 处理
}

const testParsedJson = () => {
    let tokens1 = ['{', 'name', ':', 'gua', ',', 'height', ':', 169, '}']
    let json1 = parsedJson(tokens1)
    let expected1 = json1.name === 'gua' && json1.height === 169
    ensure(expected1, 'test parsed json 1')

    let tokens2 = ['[', 'hhvb', ',', 'shhl', ']']
    let json2 = parsedJson(tokens2)
    let expected2 = json2.includes('hhvb') && json2.includes('shhl')
    ensure(expected2, 'test parsed json 2')

    let tokens3 = ['{', 'name', ':', 'gua', ',', 'location', ':', '[', 'hhvb', ',', 'shhl', ']', '}']
    let json3 = parsedJson(tokens3)
    let expected3 = json3.name === 'gua' && json3.location.includes('hhvb')
    ensure(expected3, 'test parsed json 3')

    let tokens4 = ['{', 'name', ':', 'gua', ',', 'location', ':', '[', 'hhvb', ',', 'shhl', ']',',','altitude', ':', '[', 'hhvb', ',', 'shhl', ']', '}']
    let json4 = parsedJson(tokens4)
    
    log('json1', json1)
    log('json2', json2)
    log('json3', json3)
    log('json4', json4)
}

// 测试函数
const testParsedDict = () => {
    let tokens1 = ['name', ':', 'gua', '}']
    let json1 = parsedDict(tokens1)
    let expected1 = {
        name: 'gua',
    }
    // objectEquals 请自行实现, 如果没有想法, 就多在群里讨论
    ensure(objectEquals(json1, expected1), 'test parsed dict 1')

    let tokens2 = ['name', ':', 'gua', ',', 'location', ':', '[', 'hhvb', ']', '}']
    let json2 = parsedDict(tokens2)
    let expected2 = {
        name: 'gua',
        location: ['hhvb'],
    }
    ensure(objectEquals(json2, expected2), 'test parsed dict 2')
}

// 测试函数
const testParsedList = () => {
    let tokens1 = ['xiao', 'gua', 'xiaogua', ']']
    let json1 = parsedList(tokens1)
    let expected1 = ['xiao', 'gua', 'xiaogua']
    ensure(arrayEquals(json1, expected1), 'test parsed list 1')

    let tokens2 = ['xiao', 'gua', 169, ']']
    let json2 = parsedList(tokens2)
    let expected2 = ['xiao', 'gua', 169]
    ensure(arrayEquals(json2, expected2), 'test parsed list 2')
}

const __main = () => {
    // testParsedDict()
    // testParsedList()
    testParsedJson()
}

__main()