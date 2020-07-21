export function generateId (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
  // return Math.random().toString(36).substring(2)
}

function getValue (object, path) {
  const keys = path ? path.split('.') : null
  return keys.reduce((actualPosition, key) => actualPosition[key], object)
}

function idAlreadyExists (id, existingIds) {
  return existingIds.some(existingId => id === existingId)
}

export function generateIdIn (objectOrArray, length, pathToValue) {
  let existingIds
  switch (typeof objectOrArray) {
    case 'object': {
      if (pathToValue) existingIds = Object.values(objectOrArray).map(value => getValue(value, pathToValue))
      else existingIds = Object.keys(objectOrArray)
      break
    }
    case 'array': {
      if (pathToValue) existingIds = objectOrArray.map(value => getValue(value, pathToValue))
      else existingIds = objectOrArray
      break
    }
    default: throw new Error('generateIdIn: can only handle objects or arrays.')
  }

  let newId
  do {
    newId = generateId(length)
  } while (idAlreadyExists(newId, existingIds))
  return newId
}

export function ratioToQuasarColor (ratio, level) {
  const index = Math.floor(ratio * 19)
  const colors = [
    'red', 'pink', 'purple', 'deep-purple', 'indigo',
    'blue', 'light-blue', 'cyan', 'teal', 'green',
    'light-green', 'lime', 'yellow', 'amber', 'orange',
    'deep-orange', 'brown', 'grey', 'blue-grey'
  ]
  const levelInRange =
    Number.isInteger(level) &&
    level >= 0 &&
    level <= 14
  const color = levelInRange ? `${colors[index]}-${level}` : colors[index]
  return color
}
