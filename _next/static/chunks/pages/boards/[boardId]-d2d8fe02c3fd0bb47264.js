(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[35],{4542:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return O}});var r=n(7294),i=n(4651),o=n(9163),a=n(4738),c=n(5893),s=o.ZP.div.withConfig({displayName:"DetailHeader__Container",componentId:"sc-1s6axog-0"})(["width:100%;height:60px;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;padding:10px 5px 10px 5px;margin-bottom:20px;border-bottom:1px solid #ccc;"]),u=o.ZP.div.withConfig({displayName:"DetailHeader__Title",componentId:"sc-1s6axog-1"})(["color:#080808;font-size:20px;font-weight:bold;"]),l=o.ZP.span.withConfig({displayName:"DetailHeader__Writer",componentId:"sc-1s6axog-2"})(["color:#080808;font-size:12px;font-weight:lighter;"]),d=o.ZP.button.withConfig({displayName:"DetailHeader__Button",componentId:"sc-1s6axog-3"})(["margin-right:4px;"]),p=function(t){var e=t.id,n=t.title,r=t.writer,o=t.updatedAt,p=(0,i.useRouter)();return(0,c.jsxs)(s,{children:[(0,c.jsxs)("div",{children:[(0,c.jsx)(u,{children:n}),(0,c.jsx)(l,{children:"".concat(r," |  ").concat(o)})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)(d,{type:"button",onClick:function(){p.push("/boards/".concat(e,"/modify"))},children:"\uc218\uc815"}),(0,c.jsx)(d,{type:"button",onClick:function(){(0,a.T4)(e),p.push("/boards")},children:"\uc0ad\uc81c"})]})]})};function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function h(t){return function(t){if(Array.isArray(t))return f(t)}(t)||function(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"===typeof t)return f(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var x=o.ZP.div.withConfig({displayName:"ReplyInput__Container",componentId:"sc-1c8u3hl-0"})(["width:100%;height:80px;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;padding:8px;"]),m=o.ZP.div.withConfig({displayName:"ReplyInput__UserInfoSection",componentId:"sc-1c8u3hl-1"})(["display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin-right:20px;"]),y=o.ZP.input.withConfig({displayName:"ReplyInput__UserInfoInput",componentId:"sc-1c8u3hl-2"})(["width:80px;margin-bottom:8px;"]),g=o.ZP.textarea.withConfig({displayName:"ReplyInput__ContentInput",componentId:"sc-1c8u3hl-3"})(["height:80%;flex:1;margin-right:8px;"]),w=function(t){var e=t.addReply,n=(0,r.useState)(""),i=n[0],o=n[1],a=(0,r.useState)(""),s=a[0],u=a[1],l=(0,r.useState)(""),d=l[0],p=l[1];return(0,c.jsxs)(x,{children:[(0,c.jsxs)(m,{children:[(0,c.jsx)(y,{placeholder:"\uc791\uc131\uc790",value:i,onChange:function(t){return o(t.target.value)}}),(0,c.jsx)(y,{placeholder:"\ube44\ubc00\ubc88\ud638",value:s,onChange:function(t){return u(t.target.value)}})]}),(0,c.jsx)(g,{value:d,onChange:function(t){p(t.target.value)}}),(0,c.jsx)("button",{type:"button",onClick:function(){e(i,d,s,(new Date).toLocaleDateString()),o(""),u(""),p("")},children:"\uc791\uc131"})]})},v=o.ZP.div.withConfig({displayName:"ReplyItem__Container",componentId:"sc-yq05hl-0"})(["width:100%;display:flex;flex-direction:row;justify-content:flex-start;align-items:flex-start;padding:5px;border-bottom:1px solid #cdcdcd;"]),b=o.ZP.div.withConfig({displayName:"ReplyItem__Writer",componentId:"sc-yq05hl-1"})(["flex:0 0 100px;"]),_=o.ZP.div.withConfig({displayName:"ReplyItem__Content",componentId:"sc-yq05hl-2"})(["flex:1 1 100px;"]),I=o.ZP.div.withConfig({displayName:"ReplyItem__Time",componentId:"sc-yq05hl-3"})(["flex:0 0 150px;"]),j=function(t){var e=t.writer,n=t.content,r=t.time;return(0,c.jsxs)(v,{children:[(0,c.jsx)(b,{children:e}),(0,c.jsx)(_,{children:n}),(0,c.jsx)(I,{children:r})]})},C=o.ZP.div.withConfig({displayName:"ReplyList__Container",componentId:"sc-1eq0b3k-0"})(["width:100%;display:flex;flex-direction:column;"]),Z=function(t){var e=t.replies;return(0,c.jsx)(C,{children:e.map((function(t){return(0,c.jsx)(j,{writer:t.writer,content:t.content,time:t.updateTime},t.id)}))})},P=n(266),N=n(809),k=n.n(N),R=n(9669),A=n.n(R),S="http://localhost:8080/api",E=function(){var t=(0,P.Z)(k().mark((function t(e){var n,r;return k().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,A().get("".concat(S,"/reply/").concat(e));case 2:return n=t.sent,r=n.data,t.abrupt("return",r.replies);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),T=function(){var t=(0,P.Z)(k().mark((function t(e,n,r,i){return k().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,A().post("".concat(S,"/add/reply"),{boardId:e,writer:n,content:r,password:i});case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),console.log("Add Reply Error : ",t.t0.message);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(e,n,r,i){return t.apply(this,arguments)}}(),q=o.ZP.div.withConfig({displayName:"Reply__Container",componentId:"sc-fesfl3-0"})(["width:100%;"]),D=function(){var t=(0,i.useRouter)().query.boardId,e=(0,r.useState)([]),n=e[0],o=e[1];(0,r.useEffect)((function(){E(t).then((function(t){o(t)}))}),[t]);return(0,c.jsxs)(q,{children:[(0,c.jsx)(w,{addReply:function(e,r,i,a){T(t,e,r,i),o([{writer:e,content:r,password:i,updateTime:a}].concat(h(n)))}}),(0,c.jsx)(Z,{replies:n})]})},B=o.ZP.div.withConfig({displayName:"BoardDetailPage__Container",componentId:"sc-16ue881-0"})(["width:80%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin-right:auto;margin-left:auto;"]),X=o.ZP.div.withConfig({displayName:"BoardDetailPage__Content",componentId:"sc-16ue881-1"})(["width:100%;min-height:300px;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;margin-bottom:20px;color:#000;"]),H=function(){var t=(0,i.useRouter)().query.boardId,e=(0,r.useState)(null),n=e[0],o=e[1];return(0,r.useEffect)((function(){(0,a.XZ)(t).then((function(t){return o(t)}))}),[t]),n?(0,c.jsxs)(B,{children:[(0,c.jsx)(p,{id:t,title:n.title,writer:n.writer,updatedAt:n.updatedAt}),(0,c.jsx)(X,{children:n.content}),(0,c.jsx)(D,{})]}):null},O=function(){return(0,c.jsx)(H,{})}},4738:function(t,e,n){"use strict";n.d(e,{UI:function(){return u},XZ:function(){return l},X_:function(){return d},eq:function(){return p},T4:function(){return f}});var r=n(266),i=n(809),o=n.n(i),a=n(9669),c=n.n(a),s="http://localhost:8080/api",u=function(){var t=(0,r.Z)(o().mark((function t(){var e,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c().get("".concat(s,"/boards"));case 3:return e=t.sent,n=e.data,console.log(n),t.abrupt("return",n.boards);case 9:return t.prev=9,t.t0=t.catch(0),console.log("Get Board List API Error : ",t.t0.message),t.abrupt("return",[]);case 13:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(){return t.apply(this,arguments)}}(),l=function(){var t=(0,r.Z)(o().mark((function t(e){var n,r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c().get("".concat(s,"/board/").concat(e));case 3:return n=t.sent,r=n.data,console.log(r),t.abrupt("return",r.board);case 9:return t.prev=9,t.t0=t.catch(0),console.log("Get Board API Error : ",t.t0.message),t.abrupt("return",{title:"",content:"",updateTime:"",writer:""});case 13:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(e){return t.apply(this,arguments)}}(),d=function(){var t=(0,r.Z)(o().mark((function t(e,n,r,i){var a,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c().post("".concat(s,"/add"),{writer:e,password:n,title:r,content:i});case 2:return a=t.sent,u=a.data,t.abrupt("return",u);case 5:case"end":return t.stop()}}),t)})));return function(e,n,r,i){return t.apply(this,arguments)}}(),p=function(){var t=(0,r.Z)(o().mark((function t(e,n,r,i,a){var u,l;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c().put("".concat(s,"/update/").concat(e),{writer:n,password:r,title:i,content:a});case 2:return u=t.sent,l=u.data,t.abrupt("return",l);case 5:case"end":return t.stop()}}),t)})));return function(e,n,r,i,o){return t.apply(this,arguments)}}(),f=function(){var t=(0,r.Z)(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c().delete("".concat(s,"/delete/").concat(e));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},5974:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/boards/[boardId]",function(){return n(4542)}])}},function(t){t.O(0,[774,934,888,179],(function(){return e=5974,t(t.s=e);var e}));var e=t.O();_N_E=e}]);