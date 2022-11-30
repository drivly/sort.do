export const api = {
  icon: '🚀',
  name: 'sort.do',
  description: 'Cloudflare Worker Template',
  url: 'https://sort.do/api',
  type: 'https://apis.do/data',
  endpoints: {
    listCategories: 'https://sort.do/api',
    getCategory: 'https://sort.do/:type',
  },
  site: 'https://sort.do',
  login: 'https://sort.do/login',
  signup: 'https://sort.do/signup',
  subscribe: 'https://sort.do/subscribe',
  repo: 'https://github.com/drivly/sort.do',
}

export const gettingStarted = [
  `If you don't already have a JSON Viewer Browser Extension, get that first:`,
  `https://extensions.do`,
]

export const examples = {
  listItems: 'https://sort.do/worker',
}

export default {
  fetch: async (req, env) => {
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    
    // TODO: Implement this
    const [ resource, id ] = pathSegments
    const data = { resource, id, hello: user.city }
    
    return json({ api, data, user })
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
