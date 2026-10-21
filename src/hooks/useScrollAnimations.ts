import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Animate sections on scroll
    const cards = document.querySelectorAll('.animate-on-scroll');
    cards.forEach((card, i) => {
      const direction = i % 2 === 0 ? -30 : 30;
      gsap.fromTo(card,
        { opacity: 0, y: 40, x: direction },
        {
          opacity: 1, y: 0, x: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Hero title parallax
    const hero = document.querySelector('.hero-section');
    if (hero) {
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
    }

    // Skill tags stagger
    gsap.fromTo('.skill-tag',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1, scale: 1,
        duration: 0.4,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Counter animation for stats
    const counters = document.querySelectorAll('.animate-counter');
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0');
      gsap.fromTo(el,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Parallax effect on profile image
    gsap.to('.profile-img', {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
}
