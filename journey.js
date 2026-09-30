(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const items=[...document.querySelectorAll('.jr-item')],rail=document.querySelector('.jrail'),J=document.querySelector('.journey');
const jo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)items.forEach(i=>i.classList.toggle('active',i.dataset.t===e.target.id))}),{rootMargin:'-45% 0px -45% 0px'});
document.querySelectorAll('.jstage,.jroute').forEach(s=>jo.observe(s));
if(J&&rail)new IntersectionObserver(es=>es.forEach(e=>rail.classList.toggle('show',e.isIntersecting)),{threshold:.02}).observe(J);
items.forEach(i=>i.addEventListener('click',()=>document.getElementById(i.dataset.t).scrollIntoView({behavior:reduce?'auto':'smooth'})));

const R=document.querySelector('.jroute'); if(!R)return;
const path=R.querySelector('#routePath'),done=R.querySelector('#routeDone'),car=R.querySelector('.car'),ms=R.querySelector('.mscale'),map=R.querySelector('.map3d');
const len=path.getTotalLength();done.style.strokeDasharray=len;
// build a small 3D car from boxes
function box(x,y,z,w,l,h,c){const b=document.createElement('div');b.className='bx';b.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${l}px;transform:translateZ(${z}px)`;
 const f=(css,cl)=>{const d=document.createElement('div');d.style.cssText=css+`;background:${c}`;d.className=cl||'';b.appendChild(d)};
 f(`width:${w}px;height:${l}px;transform:translateZ(${h}px)`,'f3');
 f(`left:${w}px;width:${h}px;height:${l}px;transform-origin:0 0;transform:rotateY(-90deg)`,'f1');
 f(`width:${h}px;height:${l}px;transform-origin:0 0;transform:rotateY(-90deg)`,'f1');
 f(`top:${l}px;width:${w}px;height:${h}px;transform-origin:0 0;transform:rotateX(90deg)`,'f2');
 f(`width:${w}px;height:${h}px;transform-origin:0 0;transform:rotateX(90deg)`,'f2');
 car.appendChild(b)}
car.insertAdjacentHTML('afterbegin','<div class="cshadow"></div>');
box(-30,-14,4,60,28,11,'#9E1B24');box(-12,-11,15,30,22,10,'#F4EFE4');
[[-22,-16],[14,-16],[-22,12],[14,12]].forEach(p=>box(p[0],p[1],0,12,4,9,'#111'));
box(26,-10,9,4,5,3,'#ffd76a');box(26,5,9,4,5,3,'#ffd76a');
// pins snap to nearest point on the path
const pins=[...R.querySelectorAll('.pin')].map(el=>{const x=+el.dataset.x,y=+el.dataset.y;el.style.left=x+'px';el.style.top=y+'px';
 let best=0,bd=1e9;for(let l=0;l<=len;l+=len/400){const p=path.getPointAtLength(l),d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best=l}}
 return{el,f:best/len,row:R.querySelector(`.rlist [data-p="${el.dataset.p}"]`)}});
function set(p){const l=p*len,a=path.getPointAtLength(l),b=path.getPointAtLength(Math.min(len,l+3));
 car.style.transform=`translate3d(${a.x}px,${a.y}px,0) rotateZ(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}deg)`;
 done.style.strokeDashoffset=len*(1-p);
 pins.forEach(n=>{const on=p>=n.f-.01;n.el.classList.toggle('on',on);n.row&&n.row.classList.toggle('on',on)})}
function fit(){ms.style.transform=`scale(${Math.min(1,map.clientWidth/840)})`}
let tk=false;function upd(){const r=R.getBoundingClientRect();set(Math.max(0,Math.min(1,-r.top/(r.height-innerHeight))));tk=false}
fit();addEventListener('resize',fit);
if(reduce){set(1)}else{addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd()}
})();
