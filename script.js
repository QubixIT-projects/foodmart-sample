// ---- Config ----
const WHATSAPP_NUMBER = "94770000000"; // replace with real Ayngara WhatsApp number

// ---- Mobile nav ----
const burger = document.querySelector('.burger');
const navlinks = document.querySelector('.navlinks');
if(burger){
  burger.addEventListener('click', ()=>{
    navlinks.classList.toggle('open');
    burger.classList.toggle('active');
  });
  navlinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> navlinks.classList.remove('open'));
  });
}

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{ threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
revealEls.forEach(el=> io.observe(el));

// ---- WhatsApp quote helper ----
function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll('[data-wa]').forEach(btn=>{
  const msg = btn.getAttribute('data-wa') || "Hello Ayngara, I'd like to request a quotation for bulk / wholesale supply.";
  btn.setAttribute('href', waLink(msg));
  btn.setAttribute('target', '_blank');
  btn.setAttribute('rel', 'noopener');
});

// ---- Quote form -> WhatsApp ----
const quoteForm = document.getElementById('quoteForm');
if(quoteForm){
  quoteForm.addEventListener('submit', function(e){
    e.preventDefault();
    const f = new FormData(quoteForm);
    const business = f.get('business') || '-';
    const contact = f.get('contact') || '-';
    const phone = f.get('phone') || '-';
    const type = f.get('type') || '-';
    const products = f.get('products') || '-';
    const qty = f.get('qty') || '-';
    const location = f.get('location') || '-';

    const message =
`New Quotation Request - Ayngara Food Mart
Business Name: ${business}
Contact Person: ${contact}
Phone/WhatsApp: ${phone}
Business Type: ${type}
Products Required: ${products}
Quantity: ${qty}
Delivery Location: ${location}`;

    window.open(waLink(message), '_blank', 'noopener');
  });
}

// ---- Product filter (products page) ----
const filterPills = document.querySelectorAll('.filter-pill');
const productCards = document.querySelectorAll('.product-card');
filterPills.forEach(pill=>{
  pill.addEventListener('click', ()=>{
    filterPills.forEach(p=> p.classList.remove('active'));
    pill.classList.add('active');
    const cat = pill.getAttribute('data-filter');
    productCards.forEach(card=>{
      const show = cat === 'all' || card.getAttribute('data-cat') === cat;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---- Category tile flip (tap on touch devices) ----
document.querySelectorAll('.t-tile').forEach(tile=>{
  tile.addEventListener('click', ()=> tile.classList.toggle('flipped'));
});

// ---- Why-us accordion (mobile) ----
document.querySelectorAll('.why-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.why-item.open').forEach(o=> o.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// ---- Sticky header shadow ----
const header = document.querySelector('header.site');
if(header){
  window.addEventListener('scroll', ()=>{
    header.style.boxShadow = window.scrollY > 8 ? '0 6px 18px rgba(23,19,15,.08)' : 'none';
  });
}


// ---- Parallax: background drifts slower than content ----
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layers = [...document.querySelectorAll('.hero-video, .page-hero-img')]
    .map(el=>({el, box: el.parentElement, speed: 0.25}));
  const panel = document.querySelector('.hero-panel');
  if(!layers.length) return;
  let ticking = false;
  function update(){
    const vh = window.innerHeight;
    layers.forEach(l=>{
      const r = l.box.getBoundingClientRect();
      if(r.bottom < 0 || r.top > vh) return;
      l.el.style.transform = 'translate3d(0,' + (-r.top * l.speed).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();


// ---- Phase 1: smooth scroll + masked headlines ----
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split section headings into masked words (text nodes only, keeps <em> etc.)
  let n = 0;
  document.querySelectorAll('.section-head h2, .page-hero h1').forEach(h=>{
    if(reduce) return;
    n = 0;
    (function walk(node){
      [...node.childNodes].forEach(c=>{
        if(c.nodeType === 3){
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t=>{
            if(!t) return;
            if(/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'mw';
            const i = document.createElement('span'); i.textContent = t; i.style.setProperty('--i', n++);
            w.appendChild(i); frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if(c.nodeType === 1){ walk(c); }
      });
    })(h);
    // page-hero h1 is not inside .reveal: trigger it on load
    if(!h.closest('.reveal')) requestAnimationFrame(()=> requestAnimationFrame(()=> h.classList.add('mw-in')));
  });

  // Lenis smooth scroll (desktop wheel; touch stays native for best mobile feel)
  if(!reduce && window.Lenis){
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
})();

// ---- Clickable HORECA / Food Mart cards ----
document.querySelectorAll('.segment-card').forEach(c=>{const a=c.querySelector('h3 a');if(!a)return;c.style.cursor='pointer';c.addEventListener('click',e=>{if(!e.target.closest('a'))location.href=a.href})});
