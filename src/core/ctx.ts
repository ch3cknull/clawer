export type LifeCycle =
  | 'beforeRequest'
  | 'afterRequest'
  | 'logging'
  | 'catchError'

type SpiderImplCtxBase = {
  info: {
    url: string
    time: number
  }
}

export type SpiderImplCtx = SpiderImplCtxBase & {
  data: any
  response: {
    status: number
    statusText: string
  }
}

export type LifeCycleEffects = Partial<{
  [S in LifeCycle]: Set<(ctx: SpiderImplCtx) => {}>
}>
