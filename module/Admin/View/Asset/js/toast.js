"use strict";function toast(t,e,s){if(!e||!e.length)return!1;var n=document.querySelector(".toasts"),d=(n||((n=document.createElement("div")).classList.add("toasts"),document.body.appendChild(n)),document.createElement("div")),a=(d.classList.add("toasts__item"),t&&d.classList.add(t),document.createElement("i")),t=(a.classList.add("toasts__icon"),t&&a.classList.add(t),document.createElement("span"));function i(t,e){e.classList.add("disappear"),setTimeout(function(){e.remove(),t&&t.childElementCount<=0&&t.remove()},500)}return t.classList.add("toasts__text"),t.textContent=e,d.appendChild(a),d.appendChild(t),n.appendChild(d),d.addEventListener("click",function(){return i(n,d)}),setTimeout(function(){return i(n,d)},s||5e3),!0}