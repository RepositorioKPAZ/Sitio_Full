import{e as t,r as s,j as o,L as c,c as a}from"./index-9rlOlUzo.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=t("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=t("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]),w=()=>{const[l,r]=s.useState(!1);s.useEffect(()=>{const e=()=>{r(window.scrollY>400)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]);const n=()=>{window.scrollTo({top:0,behavior:"smooth"})};return o.jsxs("div",{className:"fixed bottom-6 left-6 z-50 flex flex-col gap-3",children:[o.jsx(c,{to:"/",children:o.jsx(a,{size:"lg",className:"bg-[#2e4bce] hover:bg-[#1e3a9e] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-14 h-14",children:o.jsx(d,{className:"h-6 w-6"})})}),l&&o.jsx(a,{onClick:n,size:"lg",variant:"outline",className:"rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-14 h-14 bg-white/80 backdrop-blur-sm",children:o.jsx(i,{className:"h-6 w-6"})})]})};export{i as A,w as F};
