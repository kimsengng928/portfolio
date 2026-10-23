/**
* Template Name: MyPortfolio
* Updated: Sep 18 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }


  // Shared expanded navigation for every page.
  // The brand returns visitors to the project gallery; Home in the menu still opens the page top.
  document.querySelectorAll('.navbar-brand').forEach((brand) => {
    if (brand.textContent.trim() === 'Kimseng Ng') brand.setAttribute('href', 'index.html#selected-projects')
  })

  const sharedMenu = document.querySelector('#main-navbar')
  if (sharedMenu) {
    const onAbout = window.location.pathname.endsWith('/about.html')
    sharedMenu.innerHTML = '<div class="container-fluid container-feed px-3 px-lg-4 py-2 py-md-5"><div class="row align-items-start">' +
      '<div class="col-md-2"><nav aria-label="Main menu"><ul class="custom-menu">' +
      '<li' + (onAbout ? '' : ' class="active"') + '><a href="index.html">Home</a></li>' +
      '<li' + (onAbout ? ' class="active"' : '') + '><a href="about.html">About Me</a></li>' +
      '</ul></nav></div><div class="col-md-6 d-none d-md-block"></div>' +
      '<div class="col-md-4 menu-contact"><h3 class="h5">Contact</h3>' +
      '<p><a href="mailto:kimseng.ng@gmail.com">kimseng.ng@gmail.com</a></p>' +
      '<p><a href="https://www.linkedin.com/in/kim-seng-ng-047b543/" target="_blank" rel="noopener noreferrer"><i class="bi bi-linkedin" aria-hidden="true"></i> LinkedIn ↗</a></p>' +
      '</div></div></div>'
  }

  const burgerMenu = select('.burger')
  on('click', '.burger', function() {
    if (burgerMenu) {
      burgerMenu.classList.toggle('active');
    }
  })

  const navCollapse = select('#main-navbar')
  const menuToggle = select('#main-menu-toggle')
  if (navCollapse && menuToggle && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
    navCollapse.addEventListener('shown.bs.collapse', function() {
      menuToggle.setAttribute('aria-expanded', 'true')
      menuToggle.setAttribute('aria-label', 'Close menu')
    })
    navCollapse.addEventListener('hidden.bs.collapse', function() {
      menuToggle.setAttribute('aria-expanded', 'false')
      menuToggle.setAttribute('aria-label', 'Open menu')
    })
  }

  window.addEventListener('load', () => {
    let portfolioContainer = select('#portfolio-grid');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.item',
      });

      let portfolioFilters = select('#filters [data-filter]', true);

      on('click', '#filters [data-filter]', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('active');
          if (el.setAttribute) {
            el.setAttribute('aria-pressed', 'false')
          }
        });
        this.classList.add('active');
        if (this.setAttribute) {
          this.setAttribute('aria-pressed', 'true')
        }

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh()
          }
        });
      }, true);
    }

  });

  const testimonialsEl = select('.testimonials-slider')
  if (testimonialsEl && typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('load', () => {
    if (typeof AOS === 'undefined' || reducedMotion) {
      return
    }
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()
