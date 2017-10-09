const collectData = (req) => {
	let body = ''
	req.on('data', chunk => { body += chunk })
	return new Promise(resolve => req.on('end', () => resolve(body)))
}

const postDataMiddleware = async (ctx, next) => {
    if (ctx.method !== 'POST') {
        return await next()
    }
	ctx.request.body = await collectData(ctx.req)
    await next()
}

const postDataMiddlewareInit = () => postDataMiddleware

export default postDataMiddlewareInit
