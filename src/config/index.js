// 开发环境 模式 mode 0
const BASE_URL_PRO = 'http://localhost:3000/api/'
// 生产环境 模式 mode 1
const BASE_URL_DEV = 'https://evening-dawn-17934.herokuapp.com/api/'
//  测试环境 模式 mode 其他
const BASE_URL_TEST = ''
const MODE = 1
const BASE_URL = MODE === 0 ? BASE_URL_PRO : MODE === 1 ? BASE_URL_DEV : BASE_URL_TEST
export { BASE_URL }
