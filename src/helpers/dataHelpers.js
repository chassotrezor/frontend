export function generateId (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
  // return Math.random().toString(36).substring(2)
}

export function generateIdIn (object, length) {
  const objectIds = Object.keys(object)
  const idAlreadyExists = id => objectIds.some(nodeId => id === nodeId)
  let newId
  do {
    newId = generateId(length)
  } while (idAlreadyExists(newId))
  return newId
}
