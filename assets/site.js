(function(){
  var D=window.I18N||{en:{},zh:{}};
  var nodes=[].slice.call(document.querySelectorAll('[data-i18n]'));
  nodes.forEach(function(n){n.dataset.ko=n.innerHTML});
  var titleKo=document.title, titleKey=document.body.dataset.titleKey||((document.getElementById('bodykey')||{}).dataset||{}).titleKey;
  function get(){
    var q=(location.search.match(/[?&]lang=(ko|en|zh)/)||[])[1];
    if(q) return q;
    try{return localStorage.getItem('ah-lang')||'ko'}catch(e){return 'ko'}
  }
  function apply(l){
    nodes.forEach(function(n){
      var k=n.dataset.i18n;
      n.innerHTML=(l==='ko'||!D[l]||D[l][k]==null)?n.dataset.ko:D[l][k];
    });
    document.documentElement.lang=l==='zh'?'zh':l;
    document.title=(l!=='ko'&&titleKey&&D[l][titleKey])?D[l][titleKey]:titleKo;
    document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===l?'true':'false')});
    try{localStorage.setItem('ah-lang',l)}catch(e){}
    document.dispatchEvent(new CustomEvent('ah-lang'));
  }
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.lang)})});
  apply(get());

  var burger=document.querySelector('.burger'), menu=document.getElementById('menu');
  if(burger) burger.addEventListener('click',function(){
    var o=menu.classList.toggle('open'); burger.setAttribute('aria-expanded',o?'true':'false');
  });

  document.querySelectorAll('.chip').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false')});
      var f=c.dataset.f;
      document.querySelectorAll('#evGrid .ev').forEach(function(e){e.hidden=!(f==='all'||e.dataset.cat===f)});
    });
  });

  // 행사 사례: data/cases.json에서 읽어 렌더 (새 행사는 JSON에 추가만 하면 됨)
  var casesBox=document.getElementById('cases'), linksBox=document.getElementById('caseLinks');
  if(casesBox&&linksBox){
    var CASE_LIST=null;
    function renderCases(list){
      var L=document.documentElement.lang==='zh'?'zh':(document.documentElement.lang==='en'?'en':'ko');
      function t(o){return o[L]||o.ko}
      linksBox.innerHTML=list.map(function(c){return '<a href="#'+c.id+'">'+t(c.title)+' →</a>'}).join('');
      casesBox.innerHTML=list.map(function(c,i){
        var gal=c.photos.map(function(ph){return '<button type="button" class="ph'+(ph.wide?' wide':'')+'" data-full="img/'+ph.src+'" data-cap="'+ph.alt+'"><img src="img/'+ph.src+'" alt="'+ph.alt+'" loading="lazy"></button>'}).join('');
        var facts=c.facts.map(function(f){return '<li>'+t(f)+'</li>'}).join('');
        return '<section class="sec case" id="'+c.id+'"><div class="wrap"><div class="case-head"><div><div class="eyebrow">'+(c.eyebrow||('Case '+String(i+1).padStart(2,'0')))+'</div><h2>'+t(c.title)+'</h2></div><p class="muted">'+t(c.text)+'</p></div><div class="gallery-grid">'+gal+'</div><ul class="equip case-facts">'+facts+'</ul></div></section>'
      }).join('');
      bindCases(); bindLightbox(casesBox);
    }
    fetch('data/cases.json').then(function(r){return r.json()}).then(function(list){CASE_LIST=list;renderCases(list)});
    document.addEventListener('ah-lang',function(){if(CASE_LIST)renderCases(CASE_LIST)});
  }
  function bindCases(){
  var caseLinks=[].slice.call(document.querySelectorAll('.case-links a[href^="#case-"]'));
  var cases=[].slice.call(document.querySelectorAll('section.case'));
  function showCase(id,scroll){
    cases.forEach(function(c){c.classList.toggle('active',c.id===id)});
    caseLinks.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+id?'true':'false')});
    if(scroll){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
  }
  if(caseLinks.length&&cases.length){
    caseLinks.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();history.replaceState(null,'',a.getAttribute('href'));showCase(a.getAttribute('href').slice(1),true)})});
    var h=location.hash.slice(1); showCase(cases.some(function(c){return c.id===h})?h:cases[0].id,false);
  }
  }
  bindCases();

  var lb=document.getElementById('lb'),img=document.getElementById('lbImg'),cap=document.getElementById('lbCap');
  function bindLightbox(root){
    (root||document).querySelectorAll('[data-full]').forEach(function(b){
      if(b.dataset.bound) return; b.dataset.bound='1';
      b.addEventListener('click',function(){
        img.src=b.dataset.full; img.alt=b.dataset.cap||''; cap.textContent=b.dataset.cap||'';
        if(lb.showModal) lb.showModal();
      });
    });
  }
  bindLightbox();
  if(lb){document.getElementById('lbClose').addEventListener('click',function(){lb.close()});
    lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});}

  var ca=document.getElementById('copyAddr');
  if(ca) ca.addEventListener('click',function(){
    var t='서울 서초구 반포동 650 세빛섬 채빛섬 1층 애니버셔리홀 (올림픽대로 2085-14)', old=ca.innerHTML;
    function done(){ca.textContent='✓';setTimeout(function(){ca.innerHTML=old},1500)}
    function fb(){var r=document.createRange();r.selectNodeContents(document.getElementById('addr'));var s=getSelection();s.removeAllRanges();s.addRange(r)}
    try{navigator.clipboard.writeText(t).then(done,fb)}catch(e){fb()}
  });

  var f=document.getElementById('enq');
  if(f) f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(id){return (document.getElementById(id).value||'').trim()};
    var err=document.getElementById('formErr');
    if(!v('f-name')||!v('f-mail')||!v('f-tel')||!v('f-date')||!v('f-guests')){err.hidden=false;err.scrollIntoView({block:'center'});return}
    err.hidden=true;
    var types=[].map.call(f.querySelectorAll('input[name=type]:checked'),function(c){return c.value}).join(', ')||'-';
    var meal=(f.querySelector('input[name=meal]:checked')||{}).value||'-';
    var hours=(v('f-start')||'?')+' ~ '+(v('f-end')||'?');
    var body='성함·회사 / Name: '+v('f-name')+'\n이메일 / Email: '+v('f-mail')+'\n연락처 / Phone: '+v('f-tel')+'\n희망 날짜 / Date: '+v('f-date')+'\n사용 시간 / Hours: '+hours+'\n예상 인원 / Guests: '+v('f-guests')+'\n행사 종류 / Type: '+types+'\n식사 형태 / Meal: '+meal+'\n\n'+v('f-msg');
    location.href='mailto:anniversary.kr@gmail.com?subject='+encodeURIComponent('[대관 문의] '+types+' '+v('f-date')+' '+v('f-guests')+'명')+'&body='+encodeURIComponent(body);
  });

  // scroll reveal
  try{
    var els=document.querySelectorAll('.sec > .wrap, .space-sec > .wrap, .cta-in, .hero-text, .keyfacts');
    if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
      els.forEach(function(el){el.classList.add('rv');io.observe(el)});
    }
  }catch(e){}
})();
