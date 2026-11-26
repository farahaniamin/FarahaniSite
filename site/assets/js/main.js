/* =============================================================================
   Resume site scripts (loaded after the theme's scripts.js)
   ============================================================================= */

$(function () {

    "use strict";

    $('.js-year').text(new Date().getFullYear());

    /* ---------------------------------------------------------------------------
       Contact form — static hosting (GitHub Pages) has no backend.
       data-endpoint set  -> POST as JSON (Formspree / Web3Forms style).
       data-endpoint empty -> open the visitor's mail client via mailto.
       --------------------------------------------------------------------------- */

    var form = document.getElementById('resume-contact');
    if (!form) return;

    function showMessage(type, text) {
        $(form).find('.messages').html('<div class="alert alert-' + type + '">' + text + '</div>');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };
        var endpoint = form.getAttribute('data-endpoint');

        if (!endpoint) {
            var subject = data.subject || ('Project inquiry from ' + data.name);
            var body = data.message + '\n\n— ' + data.name + ' (' + data.email + ')';
            window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);
            return;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw new Error(res.status);
            showMessage('success', 'Thanks! Your message has been sent — I will get back to you soon.');
            form.reset();
        }).catch(function () {
            showMessage('danger', 'Something went wrong. Please email me directly at ' + form.getAttribute('data-mailto') + '.');
        });
    });

});


/* =============================================================================
   Works — pinned horizontal scroll (from the theme's home-main page)
   ============================================================================= */

$(function () {
    if (!document.querySelector('.hr-container')) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
        const track = document.querySelector('.hr-container');
        const panels = gsap.utils.toArray('.hr-container .item-panel');
        gsap.to(panels, {
            x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
                id: 'works-horizontal', trigger: track,
                start: 'center center', pin: true, scrub: 0.6,
                end: () => '+=' + Math.max(1, track.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true
            }
        });
    });

    media.add('(max-width: 991px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('#highlights .stackCard');
        cards.forEach((card, index) => {
            gsap.from(card, {
                y: 35, opacity: 0.65, ease: 'none',
                scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 65%', scrub: true }
            });
            // Tall cards stay in normal flow so every image and link remains reachable.
            if (card.offsetHeight > window.innerHeight - 140 || index === cards.length - 1) return;
            gsap.to(card, {
                scale: 0.96, transformOrigin: 'top center', ease: 'none',
                scrollTrigger: {
                    trigger: card, start: 'top 90px',
                    endTrigger: cards[cards.length - 1], end: 'top 110px',
                    pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true
                }
            });
        });
    });

    // Start touch previews only while their card is visible.
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
    }, { threshold: 0.25 });
    document.querySelectorAll('.shot-panel').forEach(panel => observer.observe(panel));
    window.addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts.ready.then(() => ScrollTrigger.refresh());

});


/* =============================================================================
   Deep links (e.g. index.html#work from an article page)
   ============================================================================= */

$(window).on('load', function () {
    var target = window.location.hash && document.querySelector(window.location.hash);
    if (!target) return;
    // wait for the intro loader before jumping
    setTimeout(function () {
        var smoother = window.ScrollSmoother && ScrollSmoother.get();
        if (smoother) smoother.scrollTo(target, true, 'top 80px');
        else target.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
});
