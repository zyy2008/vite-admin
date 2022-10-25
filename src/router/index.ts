import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "@/layouts/BasicLayout";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    meta: { title: "Home" },
    component: BasicLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: { title: "欢迎" },
        component: () => import("@/views/page1"),
      },
      {
        path: "/page1",
        name: "page1",
        meta: { title: "page1" },
        component: () => import("@/views/page2"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
