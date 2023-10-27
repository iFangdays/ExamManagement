const asyncRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'home',
        name: 'home',
        component: 'home',
        meta: { title: '首页', svg: 'shouye' }
      }
    ]
  },
  {
    path: '/questionBankManage',
    redirect: '/questionBankManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'questionBankManage',
        name: 'questionBankManage',
        component: 'questionBankManage',
        meta: { title: '题库管理', svg: 'shujuchakan' }
      }
    ]
  },
  {
    path: '/simulateExamManage',
    redirect: '/simulateExamManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'simulateExamManage',
        name: 'simulateExamManage',
        component: 'simulateExamManage',
        meta: { title: '真题管理', svg: 'AIpeizhi' }
      },
    ]
  },
  {
    path: '/tagManage',
    redirect: '/tagManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'tagManage',
        name: 'tagManage',
        component: 'tagManage',
        meta: { title: '标签管理', svg: 'AIpeizhi' }
      }
    ]
  },
  {
    path: '/assortManage',
    redirect: '/assortManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'assortManage',
        name: 'assortManage',
        component: 'assortManage',
        meta: { title: '分类管理', svg: 'AIpeizhi' }
      }
    ]
  },
  {
    path: '/cascadeManage',
    redirect: '/cascadeManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'cascadeManage',
        name: 'cascadeManage',
        component: 'cascadeManage',
        meta: { title: '联级管理', svg: 'MQTTpeizhi' }
      }
    ]
  },
  {
    path: '/tacticsManage',
    redirect: '/tacticsManage',
    component: 'Layout',
    meta: { title: '', svg: '' },
    children: [
      {
        path: 'tacticsManage',
        name: 'tacticsManage',
        component: 'systemManage/tacticsManage',
        meta: { title: '策略管理', svg: 'AIpeizhi' }
      },
    ]
  },
  {
    path: '/systemManage',
    name: 'systemManage',
    redirect: '/systemManage/usersManage',
    component: 'Layout',
    meta: { title: '系统管理', svg: '' },
    children:[
      {
        path: 'usersManage',
        name: 'usersManage',
        component: 'systemManage/usersManage',
        meta: { title: '用户管理', svg: 'xitongpeizhi' }
      },

    ]
  }
]

export default asyncRoutes
