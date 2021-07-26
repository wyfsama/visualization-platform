function timeFormat (date, format = 'YYYY-MM-DD HH:mm:ss') {
  const config = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: repairZero(date.getHours()),
    mm: repairZero(date.getMinutes()),
    ss: repairZero(date.getSeconds())
  }
  for (const key in config) {
    format = format.replace(key, config[key])
  }
  return format
}
function repairZero (num) {
  if (num.toString().length < 2) {
    return '0' + num
  }
  return num
}
export { timeFormat }
console.log(timeFormat(new Date()))
