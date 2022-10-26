import { isEmpty } from './index'

export function createRoutes(
  moduleMap,
  pagesDir = '../views/',
  supportedExtensions = ['vue'],
) {
  // 预处理 Map<path, component>
  const formatterModuleMap = Object.entries(moduleMap).reduce((o, entry) => {
    const key = entry[0]
      .replace(new RegExp(`^${pagesDir}`), '')
      .replace(new RegExp(`\\.(${supportedExtensions.join('|')})$`), '')
    o[key] = entry[1]
    return o
  }, {})

  // 生成路由对象嵌套结构
  const dummyRoutes = { children: {}, isDummy: true }
  for (const key of Object.keys(formatterModuleMap)) {
    const list = key.split('/')
    const path = []
    let head = dummyRoutes.children

    for (let i = 0; i < list.length; i++) {
      path.push(list[i])
      if (!(list[i] in head)) {
        const subKey = path.join('/')
        let formatPath = list[i].replace('_', ':')
        if (list[i] === 'index') {
          formatPath = ''
        }
        if (head === dummyRoutes.children) {
          formatPath = '/' + formatPath
        }
        head[list[i]] = {
          path: formatPath,
          name: subKey,
          children: {},
          component: formatterModuleMap[subKey]
        }
      }
      head = head[list[i]].children
    }
  }

  // 排序
  formatRoute(dummyRoutes)

  console.debug(dummyRoutes.children)

  return dummyRoutes.children
}

function formatRoute(route) {
  route.children = Object.values(route.children).sort((a, b) => {
    if (!a.path.length || a.path === '/') {
      return -1
    }
    if (!b.path.length || b.path === '/') {
      return 1
    }
    return a.name < b.name ? -1 : 1
  })
  route.children.forEach(formatRoute)
  if (route.children.length === 1 && isEmpty(route.component) && !route.isDummy) {
    route.component = route.children[0].component
    route.path += '/' + route.children[0].path
    route.name = route.children[0].name
    delete route.children
  }
}