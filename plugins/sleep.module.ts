import { CreatePlugin } from '../src/core/plugins'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default (ms: number) => CreatePlugin('beforeRequest', () => sleep(ms))
