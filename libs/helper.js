// 等最近的行動確定，間隔 n 秒後，才可以執行
export function debounce(callback, second) {
  if (typeof second !== 'number')
    throw TypeError(`param second in ${getRandomInt.name} is not number`)
  if (Object.prototype.toString.call(callback) !== '[object Function]')
    throw TypeError(`param callback in ${debounce.name} is not function`)

  let debounceID

  return function (...args) {
    clearTimeout(debounceID)
    debounceID = setTimeout(() => {
      callback.apply(this, args)
    }, second)
  }
}

// n 秒執行一次
export function throttle(callback, second) {
  if (typeof second !== 'number')
    throw TypeError(`param second in ${getRandomInt.name} is not number`)
  if (Object.prototype.toString.call(callback) !== '[object Function]')
    throw TypeError(`param callback in ${throttle.name} is not function`)

  let enableCall = true

  return function (...args) {
    if (!enableCall) return
    enableCall = false
    setTimeout(() => {
      enableCall = true
      callback.apply(this, args)
    }, second)
  }
}

export function getRandomInt(min = 0, max = 1) {
  if (typeof min !== 'number')
    throw TypeError(`param min in ${getRandomInt.name} is not number`)
  if (typeof max !== 'number')
    throw TypeError(`param max in ${getRandomInt.name} is not number`)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function coolDown({ callback, maximumNumberOfTimes = 0, second }) {
  if (typeof maximumNumberOfTimes !== 'number')
    throw TypeError(
      `param maximumNumberOfTimes in ${coolDown.name} is not number`
    )
  if (typeof second !== 'number')
    throw TypeError(`param second in ${coolDown.name} is not number`)
  if (Object.prototype.toString.call(callback) !== '[object Function]')
    throw TypeError(`param callback in ${coolDown.name} is not function`)

  let times = 0
  let timeoutID = null

  return function (...args) {
    if (times >= maximumNumberOfTimes) {
      if (timeoutID) return
      timeoutID = setTimeout(() => {
        times = 0
        timeoutID = null
      }, second)
      return
    }
    times += 1
    callback.apply(this, args)
  }
}
