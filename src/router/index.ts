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
        component: () => import("@/views/index.vue"),
      },
      {
        path: "/page1",
        name: "page",
        meta: { title: "page1" },
        component: () => import("@/views/page1/index.vue"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
