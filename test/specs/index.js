import curl from 'curl'
import ethicalServer from 'ethical-utility-server'
import postDataMiddleware from '../../src/index.js'

const postRequest = (data = '', url = 'http://localhost:8080') => {
    return new Promise((resolve, reject) => {
        curl.post(url, data, {}, (err, response, body) => {
            if (err) reject(err)
            resolve(response)
        })
    })
}

const getRequest = (data = '', url = 'http://localhost:8080') => {
    return new Promise((resolve, reject) => {
        curl.get(url, {}, (err, response, body) => {
            if (err) reject(err)
            resolve(response)
        })
    })
}

describe('postDataMiddleware()', () => {
    it('should parse data on a POST HTTP request', (done) => {
		const data = 'Hello World!'
        const server = (
            ethicalServer()
            .use(postDataMiddleware())
            .use((ctx, next) => {
				expect(ctx.request.body).toBe(data)
				ctx.response.body = data
			})
			.listen()
			.then(destroyServer => (
                postRequest(data).then(response => (
                    { response, destroyServer }
                ))
	        ))
            .then(({ response, destroyServer }) => {
                expect(response.body).toBe(data)
                expect(response.statusCode).toBe(200)
                return destroyServer
            })
			.then(destroyServer => destroyServer())
	        .then(done)
			.catch(e => console.error(e.stack || e))
        )
    })
    it('should do nothing', (done) => {
		const data = 'No post!'
        const server = (
            ethicalServer()
            .use(postDataMiddleware())
            .use((ctx, next) => {
				expect(ctx.request.body).toBeUndefined()
				ctx.response.body = data
			})
			.listen()
			.then(destroyServer => (
                getRequest(data).then(response => (
                    { response, destroyServer }
                ))
	        ))
            .then(({ response, destroyServer }) => {
                expect(response.body).toBe(data)
                expect(response.statusCode).toBe(200)
                return destroyServer
            })
			.then(destroyServer => destroyServer())
	        .then(done)
			.catch(e => console.error(e.stack || e))
        )
    })
})
