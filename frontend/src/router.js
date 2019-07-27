import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 为views文件夹下的vue文件自动生成路由, 规则同Nuxt
 * 1. 基础路由: 文件名等于路径名, 文件名为 index 时, 使用 / 作为路径名
 * 2. 动态路由: 需要创建以下划线为前缀的vue文件或目录
 * 3. 嵌套路由: 添加一个vue文件的同时添加一个与该文件同名的目录用于存放子视图组件
 * 4. _下换线仅限动态路由使用, 其余情况命名中不能出现下换线
 */
function generateRoute() {
  const requireContext = require.context('./views', true, /\.vue$/)
  const vueFileList = requireContext.keys().map(filename => filename.slice(1))

  const getFilePath = filename => filename.replace(/\.\w+$/, '').replace(/^\.\//, '')
  const getFileName = filename => filename.replace(/(.*\/)*([^.]+).*/ig, '$2')
  const flat = arr => arr.reduce((acc, val) => val.children.length ? acc.concat(val.children, val) : acc.concat(val), [])
  const getAncestry = filename => {
    if (filename === '.vue') return false
    const parentFilename = filename.replace(/\/\w+(.vue)$/, '$1')
    return vueFileList.includes(parentFilename)
      ? parentFilename
      : getAncestry(parentFilename)
  }
  const sortByNameFunc = (a, b) => a.name < b.name ? 1 : -1

  return vueFileList.reduce((routes, filename) => {
    const parenFileName = getAncestry(filename)
    const fileName = getFileName(filename)
    const filePath = getFilePath(filename)
    const parentFileExist = vueFileList.includes(parenFileName)

    const finalPath = fileName === 'index'
      ? filePath.replace(/_/g, ':').slice(0, -fileName.length)
      : filePath.replace(/_/g, ':')

    const route = {
      name: filename,
      path: finalPath,
      component: () => import(`./views${filename}`),
      children: [],
      props: true
    }

    if (!parentFileExist) {
      routes.splice(routes.length + 1, 0, route)
    }
    else {
      const node = flat(routes).find(item => item.name === parenFileName).children
      node.splice(node.length + 1, 0, route)
    }

    return routes
  }, []).sort(sortByNameFunc)
}

const basicRoute = [
  {
    path: '/',
    redirect: '/Calabash'
  }
]

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: basicRoute.concat(generateRoute(), { path: '*', redirect: '/error?code=404' }),
  mode:'history'
})

export default router
