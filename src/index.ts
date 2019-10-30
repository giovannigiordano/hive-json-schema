import _ from 'lodash'

function schemaType(x: any): string {
  if (_.isInteger(x)) {
    return 'number'
  }

  if (_.isNumber(x)) {
    return 'double'
  }

  if (_.isArray(x)) {
    return 'array'
  }

  if (_.isObject(x)) {
    return 'struct'
  }

  if (_.isString(x)) {
    return 'string'
  }
}


const json = {
  audits: {
    items: [
      {
        name: "tti",
        value: "200",
        numericValue: 200,
        rawValue: 200.20
      }
    ]
  },
  url: 'test',
}

const indent = (count: number): string => Array(count).fill('  ').join('')

const createLogger = _.curry((key:string, type: string, value: string): string => key ? `${key} ${type}<${value}>` : value)

function parseList(data: [], key: string): string {
  const value = _.head(data)
  const type = schemaType(value)

  const log = createLogger(key, type)

  if (type === 'struct') {
    return log(parseStruct(value, key))
  }

  if (type === 'array') {
    return log(parseList(value, key))
  }

  return `${key} ${type}, \n`
}

function parseStruct(data: { [key: string]: any}, key: string = ''): string {
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return ''
  }

  return keys.map((x: string): string => {
      const value = data[x]
      const type = schemaType(value)

      const log = createLogger(key, type)

      if (type === 'struct') {
        return log(parseStruct(value, x))
      }

      if (type === 'array') {
        return log(parseList(value, x))
      }

      return `${x} ${type}`
  }).join(', ')
}

function parseJSON(data: { [key: string]: any}) {
  return Object.keys(data).map((key: string) => {
      const value = data[key]
      const type = schemaType(value)

      const log = createLogger(key, type)

      if (type === 'struct') {
        return log(parseStruct(value))
      }

      if (type === 'array') {
        return log(parseList(value, key))
      }

      return `${key} ${type}`
  }).join(',\n')
}


console.log(parseJSON(json))





