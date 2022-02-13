import { CreatePlugin } from '../src/core/plugins'

export default CreatePlugin('logging', (ctx) => console.log(ctx.info))
