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
    const search = req.url.split('?')[1]
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    if (pathname.includes('favicon')) return new Response(null, { status: 302, headers: { location: 'https://uploads-ssl.webflow.com/60bee04bdb1a7a33432ce295/60ca2dd82fe6f273c60220ae_favicon_drivly.png' } })

    const [opt, ...url] = pathSegments

    const options = {
      field: '',
      direction: 'dsc',
    }

    // opt will be the field name we need to sort by (e.g. "name")
    // and optionally the direction. (e.g. "name&asc")
    if (opt) {
      opt.split('&').forEach(p => {
        if (p === 'asc' || p === 'desc' || p === 'dsc') options.direction = p === 'asc' ? 'asc' : 'dsc' // Normalize to dsc
        else options.field = p
      })
    }

    let resp

    try {
      resp = await fetch(
        `https://${url.join('/')}?${search}`
      )
    } catch (e) {
      // If this is a fetcherror, we may have consumed the domain via the options.
      resp = await fetch(
        `https://${options.field}/${url.join('/')}?${search}`
      )

      options.field = ''
    }

    const data = await resp.json()

    // check if the data is an array
    if (!Array.isArray(data)) {
      return json({
        api,
        data: {
          success: false,
          error: 'Data is not an array',
        },
        user
      }, {
        status: 400
      })
    }

    // sort the data
    const sorted = data.sort((a, b) => {
      const aVal = options.field ? a[options.field] : a // if no field is specified, sort by the entire object
      const bVal = options.field ? b[options.field] : b

      if (aVal < bVal) return options.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return options.direction === 'asc' ? 1 : -1
      return 0
    })

    return json({
      api,
      data: sorted,
      user
    })
  }
}

const json = (obj,opt) => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }, ...opt })
