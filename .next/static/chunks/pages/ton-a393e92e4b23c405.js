(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[62],{4374:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/ton",function(){return n(6993)}])},6993:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return w}});var r=n(5893),s=n(7294),l=n(2959),a=n(6104),o=n(3491),i=n(4121),d=n(3395),c=n(8764).lW,u=n(8764).lW;class f{static createFromAddress(e){return new f(e)}static createFromConfig(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r={code:t,data:function(e){let t=(0,a.beginCell)(),n=function(e){let t=c.from(e),n=c.from([1]);return function(e){let t=function(e,t){let n=[];for(;e.byteLength>0;)n.push(e.slice(0,t)),e=e.slice(t);return n}(e,127);if(0===t.length)return(0,a.beginCell)().endCell();if(1===t.length)return(0,a.beginCell)().storeBuffer(t[0]).endCell();let n=(0,a.beginCell)();for(let e=t.length-1;e>=0;e--){let r=t[e];if(n.storeBuffer(r),e-1>=0){let e=(0,a.beginCell)();e.storeRef(n),n=e}}return n.endCell()}(t=c.concat([n,t]))}(e.collectionContentUrl);t.storeRef(n);let r=(0,a.beginCell)();return r.storeBuffer(u.from(e.commonContentUrl)),t.storeRef(r.asCell()),(0,a.beginCell)().storeAddress(e.ownerAddress).storeUint(e.nextItemIndex,64).storeRef(t).storeRef(e.nftItemCode).storeRef((0,a.beginCell)().storeUint(e.royaltyParams.royaltyFactor,16).storeUint(e.royaltyParams.royaltyBase,16).storeAddress(e.royaltyParams.royaltyAddress)).endCell()}(e)};return new f((0,a.contractAddress)(n,r),r)}async sendDeploy(e,t,n){await e.internal(t,{value:n,sendMode:a.SendMode.PAY_GAS_SEPARATELY,body:(0,a.beginCell)().endCell()})}async sendMintNft(e,t,n){let r=(0,a.beginCell)();r.storeAddress(n.itemOwnerAddress);let s=(0,a.beginCell)();s.storeBuffer(u.from(n.itemContentUrl)),r.storeRef(s.endCell()),await e.internal(t,{value:n.value,sendMode:a.SendMode.PAY_GAS_SEPARATELY,body:(0,a.beginCell)().storeUint(1,32).storeUint(n.queryId,64).storeUint(n.itemIndex,64).storeCoins(n.amount).storeRef(r.endCell()).endCell()})}async sendChangeOwner(e,t,n){await e.internal(t,{value:n.value,sendMode:a.SendMode.PAY_GAS_SEPARATELY,body:(0,a.beginCell)().storeUint(3,32).storeUint(n.queryId,64).storeAddress(n.newOwnerAddress).endCell()})}async getCollectionData(e){let t=(await e.get("get_collection_data",[])).stack;return{nextItemId:t.readBigNumber(),collectionContent:t.readCell(),ownerAddress:t.readAddress()}}async getItemAddressByIndex(e,t){let n=new a.TupleBuilder;return n.writeNumber(t),(await e.get("get_nft_address_by_index",n.build())).stack.readAddress()}constructor(e,t){this.address=e,this.init=t}}class m{static createFromAddress(e){return new m(e)}static createFromConfig(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r={code:t,data:(0,a.beginCell)().storeUint(e.index,64).storeAddress(e.collectionAddress).storeAddress(e.ownerAddress).storeRef(e.content).storeUint(e.pointValue,32).endCell()};return new m((0,a.contractAddress)(n,r),r)}async getNftData(e){let t=(await e.get("get_nft_data",[])).stack,n=t.readNumber(),r=t.readBigNumber(),s=t.readAddress();return{init:n,index:r,collectionAddress:s,ownerAddress:t.readAddress(),content:t.readCell(),pointValue:t.readNumber()}}constructor(e,t){this.address=e,this.init=t}}let g=(e,t)=>{let[n,r]=(0,s.useState)(!1),[a,c]=(0,s.useState)(!1),[u,g]=(0,s.useState)(null),w=(0,s.useRef)(!1),{network:C}=(0,i.e)();return(0,s.useEffect)(()=>{let n=async()=>{if(null===e||null===t){console.log("nftCollection or walletAddress is null");return}let n=await (0,d.getHttpEndpoint)({network:C===l.sX.MAINNET?"mainnet":"testnet"}),s=new o.TonClient({endpoint:n}),a=s.open(f.createFromAddress(e)),i=(await a.getCollectionData()).nextItemId;for(let e=0;e<i;e++){let n=await a.getItemAddressByIndex(e);if(s){let e=s.open(m.createFromAddress(n)),l=await e.getNftData();if(t.toString()===l.ownerAddress.toString()){r(!0),console.log("nftItemData",l),g(l);break}}}c(!0)},s=async()=>{w.current||(w.current=!0,await n(),w.current=!1)},a=setInterval(s,5e4);return s(),()=>{w.current=!1,clearInterval(a)}},[e,t]),{isOwnerStatus:n,checkStatus:a,NFTData:u}};var w=()=>{let[e,t]=(0,s.useState)(!1),n=a.Address.parse("EQC8cTgmeDjB3I120aOnVkDrwYAqEn_8ou4ifZtdDiPTcmHY"),c=(0,l.MW)(),{network:u,sender:m,walletAddress:w}=(0,i.e)(),{isOwnerStatus:C,checkStatus:A,NFTData:b}=g(n,w),y=(0,s.useCallback)(async(e,t,n)=>{for(let s=0;s<10;s++){var r;if(await h(2e3),(null===(r=(await n.getContractState(t)).lastTransaction)||void 0===r?void 0:r.lt)!==e){console.log("Transaction ".concat(e," finalized"));break}}},[]),h=e=>new Promise(t=>setTimeout(t,e)),x=Math.floor(1e4*Math.random()),N=(0,s.useCallback)(async()=>{if(""===c)return;t(!0);let e=await (0,d.getHttpEndpoint)({network:u===l.sX.MAINNET?"mainnet":"testnet"}),r=new o.TonClient({endpoint:e});if(!r)return;let s=r.open(f.createFromAddress(n));try{var i,g;let e=await s.getCollectionData();await s.sendMintNft(m,{value:(0,a.toNano)("0.04"),queryId:x,amount:(0,a.toNano)("0.014"),itemIndex:e.nextItemId,itemOwnerAddress:a.Address.parse(c),itemContentUrl:"item.json"});let t=await r.getContractState(n);console.log(t);let l=null!==(g=null===(i=t.lastTransaction)||void 0===i?void 0:i.lt)&&void 0!==g?g:"";console.log("Last transaction: ".concat(l)),await y(l,n,r)}catch(e){console.error(e)}finally{t(!1)}},[c]);return(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center min-h-screen bg-sky-100",children:[(0,r.jsx)(l.P6,{}),(0,r.jsxs)("div",{className:"max-w-2xl mx-auto p-6",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"TON NFT Minter (with Spline)"}),(0,r.jsxs)("div",{className:"space-y-6",children:[!A&&(0,r.jsx)("p",{className:"text-center font-bold text-lg",children:"Connect wallet first"}),A&&!C&&(0,r.jsxs)("button",{onClick:()=>{N()},disabled:e||C,className:"w-full px-4 py-2 rounded-md text-white flex items-center justify-center gap-2\n              ".concat(e?"bg-gray-400":"bg-blue-600 hover:bg-blue-700"),children:[e&&(0,r.jsx)("div",{className:"w-4 h-4 animate-spin"}),e?"Minting...":"Mint NFT"]}),A&&C&&b&&(0,r.jsx)("div",{className:"text-center",children:(0,r.jsx)("p",{children:"You are the owner of the NFT collection!!"})})]})]})]})}}},function(e){e.O(0,[888,774,179],function(){return e(e.s=4374)}),_N_E=e.O()}]);