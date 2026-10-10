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

  var lb=document.getElementById('lb'),img=document.getElementById('lbImg'),cap=document.getElementById('lbCap');
  document.querySelectorAll('[data-full]').forEach(function(b){
    b.addEventListener('click',function(){
      img.src=b.dataset.full; img.alt=b.dataset.cap||''; cap.textContent=b.dataset.cap||'';
      if(lb.showModal) lb.showModal();
    });
  });
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
    if(!v('f-name')||!v('f-tel')){err.hidden=false;return}
    err.hidden=true;
    var sel=document.getElementById('f-type'); var type=sel.options[sel.selectedIndex].textContent;
    var body='성함·회사 / Name: '+v('f-name')+'\n연락처 / Contact: '+v('f-tel')+'\n희망 날짜 / Date: '+v('f-date')+'\n예상 인원 / Guests: '+v('f-guests')+'\n행사 종류 / Type: '+type+'\n\n'+v('f-msg');
    location.href='mailto:anniversary.kr@gmail.com?subject='+encodeURIComponent('[대관 문의] '+type+' '+v('f-date'))+'&body='+encodeURIComponent(body);
  });
})();
