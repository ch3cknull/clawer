import type { Plugin } from './plugins'
import axios, { AxiosRequestConfig } from 'axios'
import { LifeCycle, LifeCycleEffects, SpiderImplCtx } from './ctx'
import { merge } from '../shared'

export function createApp() {
  return new SpiderImpl()
}

type SpiderImplOptions = {
  effects?: LifeCycleEffects
}

export type CtxData = SpiderImplCtx['data']

class SpiderImpl {
  ctx: SpiderImplCtx
  effects: LifeCycleEffects
  pipes: Function[]

  constructor(options: SpiderImplOptions = {}) {
    this.ctx = {
      info: {
        url: '',
        time: new Date().getTime(),
      },
      data: {},
      response: {
        status: 0,
        statusText: '',
      },
    }
    if (options.effects) {
      this.effects = options.effects
    }
    this.effects = {}
    this.pipes = []
  }

  use(plugin: Plugin) {
    let { period, run } = plugin
    if (!this.effects[period]) {
      this.effects[period] = new Set<any>()
    }
    this.effects[period]?.add(run)
    return this
  }

  pipe(fn: (ctx?: CtxData) => CtxData) {
    this.pipes.push(fn)
    return this
  }

  store() {
    return this
  }

  async trigger(L: LifeCycle) {
    const effect = this.effects[L]
    if (!effect) return
    for (const fn of effect) {
      await fn(this.ctx)
    }
  }

  async run(url: string, conf: AxiosRequestConfig = {}) {
    try {
      // beforeRequest
      await this.trigger('beforeRequest')

      const { status, statusText, data } = await axios.get(url, conf)
      this.ctx.info = merge({ url, time: new Date().getTime() })
      this.ctx.data = data
      this.ctx.response = merge({ status, statusText })
      // afterRequest
      await this.trigger('afterRequest')

      // dataFilter
      this.pipes.forEach((fn) => {
        this.ctx.data = fn(this.ctx.data)
      })

      // Logging
      await this.trigger('logging')
    } catch (e) {
      await this.trigger('catchError')
    }
  }
}
