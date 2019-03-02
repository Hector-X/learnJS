// 2
const log = console.log.bind(console)

// 定义我们用于测试的函数
// ensure 接受两个参数
// condition 是 bool, 如果为 false, 则输出 message
// 否则, 不做任何处理
const ensure = (condition, message) => {
    // 在条件不成立的时候, 输出 message
    if (!condition) {
        log('*** 测试失败:', message)
    } else {
        log('+++ 测试成功')
    }
}
// 补全函数
const stringify = (o) => {
    // o 是一个 JSON 格式的对象
    // 把 o 转成符合要求的 JSON 格式字符串
    // 注意, 由于 JSON 里并没有 undefined, 所以需要处理成 null
    let result = ''
    result += '{'
    //先拿到所有的key
    let keys = Object.keys(o)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        result += `"${key.toString()}"` + ':'
        let value = o[key]
        //判断value类型
        //可能需要判断来回嵌套
        if (Object.prototype.toString.call(value) === '[object Array]') {
            result += '['
            for (let i = 0; i < value.length; i++) {
                const item = value[i]
                if (i < value.length - 1) {
                    result += item.toString() + ','
                } else {
                    result += item.toString()
                }
            }
            result += ']'
        } else if (Object.prototype.toString.call(value) === '[object Object]') {
            result += stringify(value)
        } else if (String(value) === value) {
            //如果是String类型的
            result += `"${value.toString()}"`
        } else if (value === null) {
            result += 'null'
        } else {
            result += value.toString()
        }
        //判断要不要加逗号
        if (i < keys.length - 1) {
            result += ','
        }
    }
    result += '}'
    return result
}

const testStringify = () => {
    let o1 = {
        name: 'gua'
    }
    let expected1 = `{"name":"gua"}`
    ensure(stringify(o1) === expected1, 'test stringify 1')

    let o2 = {
        arr: [1, 2, 3]
    }
    let expected2 = `{"arr":[1,2,3]}`
    ensure(stringify(o2) === expected2, 'test stringify 2')

    let o3 = {
        obj: {
            arr: [4, 5, 6],
            user: {
                height: 169
            }
        }
    }
    let expected3 = `{"obj":{"arr":[4,5,6],"user":{"height":169}}}`
    ensure(stringify(o3) === expected3, 'test stringify 3')

    let o4 = {
        "s1": "gua",
        "s2": "a\bb\fc\nd\re\tf\\g\/h\"i",
        "num1": 11,
        "bool": true,
        "null": null,
        "arr1": [1, 2, 3],
        "obj": {
            "bool2": false,
            "arr2": [4, 5, 6],
            "num2": 123
        }
    }
    let expected4 = `{"s1":"gua","s2":"a\bb\fc\nd\re\tf\\g/h\"i","num1":11,"bool":true,"null":null,"arr1":[1,2,3],"obj":{"bool2":false,"arr2":[4,5,6],"num2":123}}`
    ensure(stringify(o4) === expected4, 'test stringify 4')
}

testStringify()