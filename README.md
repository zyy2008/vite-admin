## 技术框架

Vite + Vue3 + TypeScript + Ant Design Vue + Umi-Request

> 兼容性注意

> Vite 需要 Node.js 版本 14.18+，16+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。

## 目录结构

本项目已经为你生成基础开发结构，提供了涵盖中后台开发的所需基础布局。

```bash
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 业务通用组件
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.tsx                # 入口页面
│   ├── global.less            # 全局样式
│   └── main.ts                # 入口文件 加载组件 初始化等
├── types                      # 全局公用类型 包括类型注入
├── index.html                 # vue 入口模板
├── tsconfig.json              # typescript 配置
├── vite.config.js             # vite 配置
└── package.json               # package.json
```

## 新增文件

在 src/views 下新建页面的 vue 文件，如果相关页面有多个，可以新建一个文件夹来放置相关文件。

```bash
├── src
│   └── views
│       └── newPage                   # 新建页面文件名称
│            │── index.vue|.tsx       # 界面入口文件
│            │── index.module.less    # 存放index样式
│            │── service.ts|.js       # index界面需要请求的接口
│            │── api.d.ts             # 存放当前接口返回的类型定义
│            └── components           # 当前界面提取的组件 非必须
```
