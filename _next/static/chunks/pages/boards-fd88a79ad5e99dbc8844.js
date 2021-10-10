(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[426],{8169:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return b}});var r=e(7294),i=e(4651),o=e(9163),c=e(4738),a="#fff",u="#ddd",s="#666",d=e(5893),f=o.ZP.div.withConfig({displayName:"BoardHeader__Contaier",componentId:"sc-uw0608-0"})(["width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;padding:15px;border-bottom:2px solid #777;color:",";"],s),l=function(){return(0,d.jsxs)(f,{children:[(0,d.jsx)("div",{children:"\uc81c\ubaa9"}),(0,d.jsx)("div",{children:"\uc791\uc131\uc790"})]})},p=o.ZP.div.withConfig({displayName:"BoardItem__Container",componentId:"sc-kaj4hh-0"})(["width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;padding:15px;background-color:",";border-bottom:1px solid #777;color:",";:hover{background-color:",";}"],a,s,u),h=function(t){var n=t.id,e=t.title,r=t.writer,o=(0,i.useRouter)();return(0,d.jsxs)(p,{onClick:function(){o.push("boards/".concat(n))},children:[(0,d.jsx)("div",{children:e}),(0,d.jsx)("div",{children:r})]})},x=o.ZP.div.withConfig({displayName:"BoardList__Container",componentId:"sc-cc132t-0"})(["width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;"]),w=function(){var t=(0,r.useState)([]),n=t[0],e=t[1];return(0,r.useEffect)((function(){(0,c.UI)().then((function(t){return e(t)}))}),[]),(0,d.jsxs)(x,{children:[(0,d.jsx)(l,{}),n.map((function(t){return(0,d.jsx)(h,{id:t.id,title:t.title,writer:t.writer},t.id)}))]})},v=o.ZP.div.withConfig({displayName:"BoardListPage__Container",componentId:"sc-o7rgm-0"})(["width:80%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:10px;margin-left:auto;margin-right:auto;"]),g=o.ZP.div.withConfig({displayName:"BoardListPage__ButtonSection",componentId:"sc-o7rgm-1"})(["width:100%;display:flex;flex-direction:row;justify-content:flex-end;align-items:center;padding:5px;"]),m=function(){var t=(0,i.useRouter)();return(0,d.jsxs)(v,{children:[(0,d.jsx)(w,{}),(0,d.jsx)(g,{children:(0,d.jsx)("button",{type:"button",onClick:function(){t.push("/boards/create")},children:"\uae00 \uc4f0\uae30"})})]})},b=function(){return(0,d.jsx)(m,{})}},4738:function(t,n,e){"use strict";e.d(n,{UI:function(){return s},XZ:function(){return d},X_:function(){return f},eq:function(){return l},T4:function(){return p}});var r=e(266),i=e(809),o=e.n(i),c=e(9669),a=e.n(c),u="http://localhost:8080/api",s=function(){var t=(0,r.Z)(o().mark((function t(){var n,e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a().get("".concat(u,"/boards"));case 3:return n=t.sent,e=n.data,console.log(e),t.abrupt("return",e.boards);case 9:return t.prev=9,t.t0=t.catch(0),console.log("Get Board List API Error : ",t.t0.message),t.abrupt("return",[]);case 13:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(){return t.apply(this,arguments)}}(),d=function(){var t=(0,r.Z)(o().mark((function t(n){var e,r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,a().get("".concat(u,"/board/").concat(n));case 3:return e=t.sent,r=e.data,console.log(r),t.abrupt("return",r.board);case 9:return t.prev=9,t.t0=t.catch(0),console.log("Get Board API Error : ",t.t0.message),t.abrupt("return",{title:"",content:"",updateTime:"",writer:""});case 13:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(n){return t.apply(this,arguments)}}(),f=function(){var t=(0,r.Z)(o().mark((function t(n,e,r,i){var c,s;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a().post("".concat(u,"/add"),{writer:n,password:e,title:r,content:i});case 2:return c=t.sent,s=c.data,t.abrupt("return",s);case 5:case"end":return t.stop()}}),t)})));return function(n,e,r,i){return t.apply(this,arguments)}}(),l=function(){var t=(0,r.Z)(o().mark((function t(n,e,r,i,c){var s,d;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a().put("".concat(u,"/update/").concat(n),{writer:e,password:r,title:i,content:c});case 2:return s=t.sent,d=s.data,t.abrupt("return",d);case 5:case"end":return t.stop()}}),t)})));return function(n,e,r,i,o){return t.apply(this,arguments)}}(),p=function(){var t=(0,r.Z)(o().mark((function t(n){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a().delete("".concat(u,"/delete/").concat(n));case 2:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}()},7618:function(t,n,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/boards",function(){return e(8169)}])}},function(t){t.O(0,[774,934,888,179],(function(){return n=7618,t(t.s=n);var n}));var n=t.O();_N_E=n}]);