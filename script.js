/* CoinLumen News — site interactivity
 * Handles: sticky navbar styling on scroll, mobile menu, FAQ accordion,
 * smooth in-page anchor scrolling with navbar offset, and footer year.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavbarScroll();
    initMobileMenu();
    initFaqAccordion();
    initSmoothScroll();
    initFooterYear();
  });

  /* Give the fixed navbar a translucent, blurred background once the user
     scrolls away from the top of the page. */
  function initNavbarScroll() {
    var nav = document.getElementById("site-navbar");
    if (!nav) return;
    var scrolled = ["bg-background/80", "backdrop-blur-md", "shadow-lg"];
    var top = ["bg-background/0", "backdrop-blur-0"];

    function update() {
      if (window.scrollY > 24) {
        nav.classList.remove.apply(nav.classList, top);
        nav.classList.add.apply(nav.classList, scrolled);
      } else {
        nav.classList.remove.apply(nav.classList, scrolled);
        nav.classList.add.apply(nav.classList, top);
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* Toggle the mobile navigation panel. */
  function initMobileMenu() {
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-mobile");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = !menu.classList.contains("hidden");
      if (isOpen) {
        close();
      } else {
        menu.classList.remove("hidden");
        toggle.setAttribute("aria-expanded", "true");
      }
    });

    // Close the menu after choosing a link.
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });
  }

  /* Expand/collapse FAQ answers and animate the + icon into an ×. */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var answer = item.querySelector(".faq-answer");
      var icon = item.querySelector("svg");

      function setOpen(open) {
        item.setAttribute("aria-expanded", open ? "true" : "false");
        if (answer) answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
        if (icon) icon.style.transform = open ? "rotate(45deg)" : "rotate(0deg)";
      }

      function toggle() {
        var open = item.getAttribute("aria-expanded") === "true";
        // Close sibling items for a classic accordion feel.
        items.forEach(function (other) {
          if (other !== item && other.getAttribute("aria-expanded") === "true") {
            other.setAttribute("aria-expanded", "false");
            var a = other.querySelector(".faq-answer");
            var i = other.querySelector("svg");
            if (a) a.style.maxHeight = "0px";
            if (i) i.style.transform = "rotate(0deg)";
          }
        });
        setOpen(!open);
      }

      item.addEventListener("click", toggle);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });

    // Keep an open answer sized correctly after a resize.
    window.addEventListener("resize", function () {
      document.querySelectorAll('.faq-item[aria-expanded="true"] .faq-answer').forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    });
  }

  /* Smoothly scroll to same-page sections, accounting for the fixed navbar. */
  function initSmoothScroll() {
    var nav = document.getElementById("site-navbar");
    var offset = nav ? nav.offsetHeight + 12 : 80;
    var here = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === -1) return;

      var parts = href.split("#");
      var path = parts[0].split("/").pop();
      var id = parts[1];
      if (!id) return;

      // Only intercept links that point to a section on the current page.
      var samePage = path === "" || path === here;
      if (!samePage) return;

      link.addEventListener("click", function (e) {
        var target = document.getElementById(id);
        if (!target) return; // let the browser handle it
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
        if (history.replaceState) history.replaceState(null, "", "#" + id);
      });
    });
  }

  function initFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
