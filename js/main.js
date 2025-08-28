function observeLazyImages(){
  const imgs = document.querySelectorAll('img[data-src]');
  console.log("Images trouvées pour lazy-load :", imgs.length); // <--- debug
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const img = e.target;
          console.log("Chargement de :", img.dataset.src); // <--- debug
          img.src = img.dataset.src;
          img.addEventListener('load', function onLoad(){
            img.classList.remove('lazy-loading');
            img.classList.add('loaded');
            img.removeEventListener('load', onLoad);
          });
          img.removeAttribute('data-src');
          o.unobserve(img);
        }
      });
    }, {rootMargin: "200px 0px"});
    imgs.forEach(img => obs.observe(img));
  } else {
    // fallback sans IntersectionObserver
    imgs.forEach(img => {
      img.src = img.dataset.src;
      img.addEventListener('load', function onLoad(){
        img.classList.remove('lazy-loading');
        img.classList.add('loaded');
        img.removeEventListener('load', onLoad);
      });
      img.removeAttribute('data-src');
    });
  }
}