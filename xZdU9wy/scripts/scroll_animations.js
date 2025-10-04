function initScrollAnimations(threeObject) {
    gsap.registerPlugin(ScrollTrigger);

    if (threeObject) {
        gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        }).to(threeObject.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 4,
            z: Math.PI,
            ease: "none",
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll("section[id]").forEach((section) => {
        const elementsToAnimate = section.querySelectorAll('.section-title, .section-text, .service-card, form, .social-link, #aurevo img, .w-40.h-40');
        
        gsap.from(elementsToAnimate, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    });
}

export { initScrollAnimations };
