/* ─── Mobile nav toggle ─────────────────────────────────── */
const menuToggle = document.querySelector(".menu-toggle");
const siteNav    = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when any nav link is tapped
    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            document.body.classList.remove("nav-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close when tapping outside the nav
    document.addEventListener("click", (e) => {
        if (
            document.body.classList.contains("nav-open") &&
            !siteNav.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            document.body.classList.remove("nav-open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* ─── Navbar scroll tint ───────────────────────────────── */
(function () {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 60) {
                    navbar.style.background = "rgba(6, 2, 3, 0.94)";
                } else {
                    navbar.style.background = "";
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ─── Scroll reveal with stagger ──────────────────────── */
(function () {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    // Pre-apply staggered delay from data-reveal-delay attr
    revealItems.forEach((el) => {
        const delay = el.dataset.revealDelay;
        if (delay) {
            el.style.transitionDelay = `${Number(delay) * 80}ms`;
        }
    });

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((el) => observer.observe(el));
})();

/* ─── Auto-stagger sibling cards ──────────────────────── */
(function () {
    const parents = document.querySelectorAll(
        ".bento-grid, .stats-grid, .feature-columns, .values-grid, .step-grid, .track-grid, .bulletin-list, .video-grid"
    );

    parents.forEach((parent) => {
        const children = Array.from(parent.children).filter(
            (c) => c.hasAttribute("data-reveal")
        );
        children.forEach((child, i) => {
            // Only apply if no explicit delay already set
            if (!child.dataset.revealDelay) {
                child.style.transitionDelay = `${i * 70}ms`;
            }
        });
    });
})();

/* ─── Animated stat counters ──────────────────────────── */
(function () {
    const statNumbers = document.querySelectorAll("[data-count]");
    if (!statNumbers.length) return;

    function animateCounter(element) {
        const target   = Number(element.dataset.count || 0);
        const duration = 1800;
        const start    = performance.now();

        function tick(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const value    = Math.round(target * eased);
            element.textContent = value.toLocaleString() + "+";
            if (progress < 1) window.requestAnimationFrame(tick);
        }

        window.requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
        statNumbers.forEach((el) => {
            el.textContent = Number(el.dataset.count || 0).toLocaleString() + "+";
        });
        return;
    }

    const statsObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                // Small delay per card index for a cascade effect
                const delay = Array.from(statNumbers).indexOf(entry.target) * 100;
                setTimeout(() => animateCounter(entry.target), delay);
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));
})();

/* ─── Floating cards parallax tilt ────────────────────── */
(function () {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices

    const cards = document.querySelectorAll(".floating-card, .stat-card, .bento-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const tiltX  = dy * -4;
            const tiltY  = dx *  4;

            card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
            card.style.transition = "transform 60ms linear";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "transform 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        });
    });
})();

/* ─── Hero image subtle parallax ──────────────────────── */
(function () {
    const frame = document.querySelector(".hero-image-frame");
    if (!frame || window.matchMedia("(pointer: coarse)").matches) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const img = frame.querySelector(".hero-primary-image");
                if (img) {
                    img.style.transform = `scale(1.06) translateY(${scrolled * 0.06}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ─── Smooth anchor scroll ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset = 90;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
    });
});
