!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.bitjs=e():t.bitjs=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=8)}([function(t,e,r){"use strict";(function(t,n,i){r.d(e,"b",(function(){return f})),r.d(e,"c",(function(){return p})),r.d(e,"f",(function(){return d})),r.d(e,"a",(function(){return y})),r.d(e,"h",(function(){return b})),r.d(e,"e",(function(){return g})),r.d(e,"g",(function(){return w})),r.d(e,"d",(function(){return m})),r.d(e,"i",(function(){return v})),r.d(e,"l",(function(){return k})),r.d(e,"j",(function(){return _})),r.d(e,"k",(function(){return B})),r.d(e,"m",(function(){return P}));var s=r(1),o=r(2),h=r.n(o),a=r(3),c=r.n(a),u=r(4),l=r.n(u);class f{constructor(t){this.type=t}}const p={START:"start",PROGRESS:"progress",EXTRACT:"extract",FINISH:"finish",INFO:"info",ERROR:"error"};class d extends f{constructor(t){super(p.INFO),this.msg=t}}class y extends f{constructor(t){super(p.ERROR),this.msg=t}}class b extends f{constructor(){super(p.START)}}class g extends f{constructor(t={}){super(p.FINISH),this.metadata=t}}class w extends f{constructor(t,e,r,n,i,s,o){super(p.PROGRESS),this.currentFilename=t,this.currentFileNumber=e,this.currentBytesUnarchivedInFile=r,this.totalFilesInArchive=s,this.currentBytesUnarchived=n,this.totalUncompressedBytesInArchive=i,this.totalCompressedBytesRead=o}}class m extends f{constructor(t){super(p.EXTRACT),this.unarchivedFile=t}}class v{constructor(t,e){this.ab=t,this.workerRootPath=e,this.listeners_={};for(let t in p)this.listeners_[p[t]]=[];this.worker_=null}getWorker(){throw"Subclasses of AbstractUnarchiver must overload getWorker()"}addEventListener(t,e){t in this.listeners_&&-1==this.listeners_[t].indexOf(e)&&this.listeners_[t].push(e)}removeEventListener(t,e){if(t in this.listeners_){const r=this.listeners_[t].indexOf(e);-1!=r&&this.listeners_[t].splice(r,1)}}createUnarchiveEvent_(t){switch(t.type){case p.START:return new b;case p.PROGRESS:return new w(t.currentFilename,t.currentFileNumber,t.currentBytesUnarchivedInFile,t.currentBytesUnarchived,t.totalUncompressedBytesInArchive,t.totalFilesInArchive,t.totalCompressedBytesRead);case p.EXTRACT:return new m(t.unarchivedFile);case p.FINISH:return new g(t.metadata);case p.INFO:return new d(t.msg);case p.ERROR:return new y(t.msg)}}handleWorkerEvent_(t){const e=t.type;if(e&&Object.values(p).includes(e)&&this.listeners_[t.type]instanceof Array){const e=this.createUnarchiveEvent_(t);this.listeners_[e.type].forEach((function(t){t(e)})),e.type==p.FINISH&&this.worker_.terminate()}else console.log("Unknown object received from worker: "+t)}start(){const t=this,e=this.getWorker();if(e){this.worker_=e,this.worker_.onerror=function(t){throw console.log("Worker error: message = "+t.message),t},this.worker_.onmessage=function(e){"string"==typeof e.data?console.log(e.data):t.handleWorkerEvent_(e.data)};const r=this.ab;this.worker_.postMessage({file:r,logToConsole:!1}),this.ab=null}}update(t){this.worker_&&this.worker_.postMessage({bytes:t})}stop(){this.worker_&&this.worker_.terminate()}}class k extends v{constructor(t,e=null){super(t,e)}getWorker(){return this.workerRootPath?new Worker(this.workerRootPath+"/"+l.a):new Worker(t)}}class _ extends v{constructor(t,e=null){super(t,e)}getWorker(){return this.workerRootPath?new Worker(this.workerRootPath+"/"+h.a):new Worker(n)}}class B extends v{constructor(t,e=null){super(t,e)}getWorker(){return this.workerRootPath?new Worker(this.workerRootPath+"/"+c.a):new Worker(i)}}function P(t,e=null){if(t.byteLength<10)return null;let r=null;return r="application/x-rar-compressed"===Object(s.a)(t)?new _(t,e):"application/zip"===mimetype?new k(t,e):new B(t,e),r}}).call(this,r(5),r(6),r(7))},function(t,e,r){"use strict";r.d(e,"a",(function(){return h}));const n={"application/pdf":[[37,80,68,70,45]],"application/x-7z-compressed":[[55,122,188,175,39,28]],"application/x-bzip2":[[66,90,104]],"application/x-rar-compressed":[[82,97,114,33,26,7]],"application/zip":[[80,75,3,4],[80,75,5,6],[80,75,7,8]],"image/bmp":[[66,77]],"image/gif":[[71,73,70,56]],"image/jpeg":[[255,216,255]],"image/png":[[137,80,78,71,13,10,26,10]],"image/webp":[[82,73,70,70,"??","??","??","??",87,69,66,80]]};class i{constructor(t){this.value=t,this.children={},this.mimeType=void 0}}const s=new i;let o=0;for(const t in n)for(const e of n[t]){let r=s,n=0;for(const t of e){if(void 0===r.children[t]){if("??"===t&&!r.children["??"]&&Object.keys(r.children).length>0)throw"Cannot add a placeholder child to a node that has non-placeholder children";if("??"!==t&&r.children["??"])throw"Cannot add a non-placeholder child to a node that has a placeholder child";r.children[t]=new i(t)}n++,r=r.children[t]}if(o<n&&(o=n),r.mimeType)throw`File signature collision:  ${r.mimeType} overlaps with ${t}`;if(Object.keys(r.children).length>0)throw t+" signature is not unique, it collides with other mime types";r.mimeType=t}function h(t){const e=t.byteLength<o?t.byteLength:o,r=new Uint8Array(t).subarray(0,e);let n=s;for(const t of r)if(n.children["??"])n=n.children["??"];else{if(void 0===n.children[t])return;if(n=n.children[t],n.mimeType)return n.mimeType}}},function(t,e,r){t.exports=r.p+"bitjs.0.worker.js"},function(t,e,r){t.exports=r.p+"bitjs.1.worker.js"},function(t,e,r){t.exports=r.p+"bitjs.2.worker.js"},function(t,e,r){t.exports=r.p+"bitjs.0.worker.js"},function(t,e,r){t.exports=r.p+"bitjs.1.worker.js"},function(t,e,r){t.exports=r.p+"bitjs.2.worker.js"},function(t,e,r){"use strict";r.r(e),r.d(e,"UnarchiveEvent",(function(){return n.b})),r.d(e,"UnarchiveEventType",(function(){return n.c})),r.d(e,"UnarchiveInfoEvent",(function(){return n.f})),r.d(e,"UnarchiveErrorEvent",(function(){return n.a})),r.d(e,"UnarchiveStartEvent",(function(){return n.h})),r.d(e,"UnarchiveFinishEvent",(function(){return n.e})),r.d(e,"UnarchiveProgressEvent",(function(){return n.g})),r.d(e,"UnarchiveExtractEvent",(function(){return n.d})),r.d(e,"Unarchiver",(function(){return n.i})),r.d(e,"Unzipper",(function(){return n.l})),r.d(e,"Unrarrer",(function(){return n.j})),r.d(e,"Untarrer",(function(){return n.k})),r.d(e,"getUnarchiver",(function(){return n.m})),r.d(e,"findMimeType",(function(){return i.a})),r.d(e,"BitStream",(function(){return o})),r.d(e,"ByteBuffer",(function(){return h})),r.d(e,"ByteStream",(function(){return a}));var n=r(0),i=r(1);const s=[0,1,3,7,15,31,63,127,255];class o{constructor(t,e,r,n){if(!(t instanceof ArrayBuffer))throw"Error! BitArray constructed with an invalid ArrayBuffer object";const i=r||0,s=n||t.byteLength;this.bytes=new Uint8Array(t,i,s),this.bytePtr=0,this.bitPtr=0,this.bitsRead_=0,this.peekBits=e?this.peekBits_rtl:this.peekBits_ltr}getNumBitsRead(){return this.bitsRead_}getNumBitsLeft(){const t=8-this.bitPtr;return 8*(this.bytes.byteLength-this.bytePtr-1)+t}peekBits_ltr(t,e){const r=parseInt(t,10);let n=r;if(t!==n||n<=0)return 0;const i=e||!1;let o=this.bytes,h=this.bytePtr,a=this.bitPtr,c=0,u=0;for(;n>0&&!(h>=o.length);){const t=8-a;if(!(n>=t)){const t=s[n]<<a;c|=(o[h]&t)>>a<<u,a+=n;break}{const e=s[t]<<a;c|=(o[h]&e)>>a<<u,h++,a=0,u+=t,n-=t}}return i&&(this.bitPtr=a,this.bytePtr=h,this.bitsRead_+=r),c}peekBits_rtl(t,e){const r=parseInt(t,10);let n=r;if(t!==n||n<=0)return 0;const i=e||!1;let o=this.bytes,h=this.bytePtr,a=this.bitPtr,c=0;for(;n>0&&!(h>=o.length);){const t=8-a;if(!(n>=t)){c<<=n;const t=8-n-a;c|=(o[h]&s[n]<<t)>>t,a+=n;break}c<<=t,c|=s[t]&o[h],h++,a=0,n-=t}return i&&(this.bitPtr=a,this.bytePtr=h,this.bitsRead_+=r),c}getBits(){return((255&this.bytes[this.bytePtr])<<16)+((255&this.bytes[this.bytePtr+1])<<8)+(255&this.bytes[this.bytePtr+2])>>>8-this.bitPtr&65535}readBits(t){return this.peekBits(t,!0)}peekBytes(t,e){const r=parseInt(t,10);if(t!==r||r<0)throw"Error!  Called peekBytes() with a non-positive integer: "+t;if(0===r)return new Uint8Array;for(;0!=this.bitPtr;)this.readBits(1);if(r>this.getNumBitsLeft()/8)throw"Error!  Overflowed the bit stream! n="+r+", bytePtr="+this.bytePtr+", bytes.length="+this.bytes.length+", bitPtr="+this.bitPtr;const n=e||!1,i=new Uint8Array(r);let s=this.bytes,o=this.bytePtr,h=r;for(;h>0;){const t=s.length-o,e=Math.min(h,t);if(i.set(s.subarray(o,o+e),r-h),o+=e,o>=s.length)break;h-=e}return n&&(this.bytePtr+=r,this.bitsRead_+=8*r),i}readBytes(t){return this.peekBytes(t,!0)}}class h{constructor(t){if("number"!=typeof t||t<=0)throw"Error! ByteBuffer initialized with '"+t+"'";this.data=new Uint8Array(t),this.ptr=0}insertByte(t){this.data[this.ptr++]=t}insertBytes(t){this.data.set(t,this.ptr),this.ptr+=t.length}writeNumber(t,e){if(e<1||!e)throw"Trying to write into too few bytes: "+e;if(t<0)throw"Trying to write a negative number ("+t+") as an unsigned number to an ArrayBuffer";if(t>Math.pow(2,8*e)-1)throw"Trying to write "+t+" into only "+e+" bytes";const r=[];for(;e-- >0;){const e=255&t;r.push(e),t>>=8}this.insertBytes(r)}writeSignedNumber(t,e){if(e<1)throw"Trying to write into too few bytes: "+e;const r=Math.pow(2,8*e-1);if(t>=r||t<-r)throw"Trying to write "+t+" into only "+e+" bytes";const n=[];for(;e-- >0;){const e=255&t;n.push(e),t>>=8}this.insertBytes(n)}writeASCIIString(t){for(let e=0;e<t.length;++e){const r=t.charCodeAt(e);if(r<0||r>255)throw"Trying to write a non-ASCII string!";this.insertByte(r)}}}class a{constructor(t,e,r){if(!(t instanceof ArrayBuffer))throw"Error! BitArray constructed with an invalid ArrayBuffer object";const n=e||0,i=r||t.byteLength;this.bytes=new Uint8Array(t,n,i),this.pages_=[],this.ptr=0,this.bytesRead_=0}getNumBytesRead(){return this.bytesRead_}getNumBytesLeft(){const t=this.bytes.byteLength-this.ptr;return this.pages_.reduce((t,e)=>t+e.length,t)}movePointer_(t){for(this.ptr+=t,this.bytesRead_+=t;this.ptr>=this.bytes.length&&this.pages_.length>0;)this.ptr-=this.bytes.length,this.bytes=this.pages_.shift()}peekNumber(t){const e=parseInt(t,10);if(t!==e||e<0)throw"Error!  Called peekNumber() with a non-positive integer";if(0===e)return 0;if(t>4)throw"Error!  Called peekNumber("+t+") but this method can only reliably read numbers up to 4 bytes long";if(this.getNumBytesLeft()<e)throw"Error!  Overflowed the byte stream while peekNumber()! n="+e+", ptr="+this.ptr+", bytes.length="+this.getNumBytesLeft();let r=0,n=this.bytes,i=0,s=this.ptr;for(let t=0;t<e;++t)r|=n[s++]<<8*t,s>=n.length&&(n=this.pages_[i++],s=0);return r}readNumber(t){const e=this.peekNumber(t);return this.movePointer_(t),e}peekSignedNumber(t){let e=this.peekNumber(t);const r=Math.pow(2,8*t-1);return e>=r&&(e-=2*r),e}readSignedNumber(t){const e=this.peekSignedNumber(t);return this.movePointer_(t),e}peekBytes(t,e){const r=parseInt(t,10);if(t!==r||r<0)throw"Error!  Called peekBytes() with a non-positive integer";if(0===r)return new Uint8Array;if(r>this.getNumBytesLeft())throw"Error!  Overflowed the byte stream during peekBytes! n="+r+", ptr="+this.ptr+", bytes.length="+this.getNumBytesLeft();const n=new Uint8Array(r);let i=this.bytes,s=this.ptr,o=r,h=0;for(;o>0;){const t=i.length-s,e=Math.min(o,t);n.set(i.subarray(s,s+e),r-o),s+=e,s>=i.length&&(i=this.pages_[h++],s=0),o-=e}return e&&this.movePointer_(r),n}readBytes(t){return this.peekBytes(t,!0)}peekString(t){const e=parseInt(t,10);if(t!==e||e<0)throw"Error!  Called peekString() with a non-positive integer";if(0===e)return"";if(e>this.getNumBytesLeft())throw"Error!  Overflowed the byte stream while peekString()! n="+e+", ptr="+this.ptr+", bytes.length="+this.getNumBytesLeft();let r=new Array(e),n=this.bytes,i=0,s=this.ptr;for(let t=0;t<e;++t)r[t]=String.fromCharCode(n[s++]),s>=n.length&&(n=this.pages_[i++],s=0);return r.join("")}readString(t){const e=this.peekString(t);return this.movePointer_(t),e}push(t){if(!(t instanceof ArrayBuffer))throw"Error! ByteStream.push() called with an invalid ArrayBuffer object";this.pages_.push(new Uint8Array(t)),this.movePointer_(0)}tee(){const t=new a(this.bytes.buffer);return t.bytes=this.bytes,t.ptr=this.ptr,t.pages_=this.pages_.slice(),t.bytesRead_=this.bytesRead_,t}}}])}));
//# sourceMappingURL=bitjs.js.map