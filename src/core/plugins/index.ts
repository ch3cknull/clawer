import { LifeCycle, SpiderImplCtx } from '../ctx'

export type Plugin = {
  period: LifeCycle
  run: (ctx: SpiderImplCtx) => any
}

export function CreatePlugin(period: LifeCycle, run: Plugin['run']): Plugin {
  if (typeof run !== 'function')
    run = (ctx?: SpiderImplCtx) => run as Plugin['run']
  return { period, run }
}
