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


  // Shared, always-visible navigation; no hidden menu required.
  const onAboutPage = window.location.pathname.endsWith('/about.html')
  const onHomePage = /(?:\/|\/index\.html)$/.test(window.location.pathname)
  const onWorkPage = !onAboutPage && !onHomePage
  document.querySelectorAll('.custom-navbar .container-fluid').forEach((container) => {
    container.innerHTML = '<nav class="portfolio-topnav" aria-label="Primary navigation">' +
      '<a href="index.html" class="portfolio-topnav__link' + (onHomePage && !window.location.hash ? ' is-current' : '') + '">Home</a>' +
      '<a href="index.html#selected-projects" class="portfolio-topnav__link' + (onWorkPage || (onHomePage && window.location.hash === '#selected-projects') ? ' is-current' : '') + '">The Work</a>' +
      '<a href="about.html" class="portfolio-topnav__link' + (onAboutPage ? ' is-current' : '') + '">About Me</a>' +
      '</nav>' +
      '<div class="portfolio-topnav__actions">' +
      '<a class="portfolio-topnav__linkedin" href="https://www.linkedin.com/in/kim-seng-ng-047b543/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"><i class="bi bi-linkedin" aria-hidden="true"></i></a>' +
      '<a class="portfolio-topnav__contact" href="mailto:kimseng.ng@gmail.com">Contact <span aria-hidden="true">↗</span></a>' +
      '</div>'
  })
  const oldExpandedMenu = document.querySelector('#main-navbar')
  if (oldExpandedMenu) oldExpandedMenu.remove()

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
