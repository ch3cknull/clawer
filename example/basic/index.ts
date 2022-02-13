import { createApp } from '../../src'
import SleepPlugin from '../../plugins/sleep.module'
import LoggingPlugin from '../../plugins/logging.module'

type Ctx = {
  hint: {
    url: string
    info: string
  }
  data: unknown
  code: number
  client_info: unknown
}

const app = createApp()

app
  .use(SleepPlugin(3000))
  .use(LoggingPlugin)
  .pipe((ctx: Ctx) => {
    const { data, hint } = ctx
    return { data, hint }
  })

app.run('https://api.asoulcnki.asia/main/v1/check')
