// Particle network
(function(){
  const c=document.getElementById('bg'),x=c.getContext('2d');
  let w,h,ps=[],mx=-1e3,my=-1e3;
  function size(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px'}
  function init(){
    size();
    const n=Math.min(90,Math.floor((innerWidth*innerHeight)/16000));
    ps=Array.from({length:n},()=>({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.4*devicePixelRatio,
      vy:(Math.random()-.5)*.4*devicePixelRatio,
      r:(Math.random()*1.6+.4)*devicePixelRatio
    }));
  }
  function tick(){
    x.clearRect(0,0,w,h);
    const max=140*devicePixelRatio;
    for(let i=0;i<ps.length;i++){
      const p=ps[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      const dx=p.x-mx,dy=p.y-my,dm=Math.hypot(dx,dy);
      if(dm<160*devicePixelRatio){p.x+=dx/dm*.6;p.y+=dy/dm*.6}
      x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);
      x.fillStyle='rgba(180,190,255,.6)';
      x.fill();

      for(let j=i+1;j<ps.length;j++){
        const q=ps[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<max){
          x.strokeStyle='rgba(124,92,255,'+(1-d/max)*.35+')';
          x.lineWidth=devicePixelRatio*.6;
          x.beginPath();
          x.moveTo(p.x,p.y);
          x.lineTo(q.x,q.y);
          x.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  addEventListener('resize',init);
  addEventListener('mousemove',e=>{
    mx=e.clientX*devicePixelRatio;
    my=e.clientY*devicePixelRatio;
  });

  addEventListener('mouseleave',()=>{
    mx=my=-1e4;
  });

  init();
  tick();
})();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>{
  io.observe(el);
});