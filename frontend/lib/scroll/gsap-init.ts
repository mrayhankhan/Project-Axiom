import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function initGSAP() {
    if (typeof window === 'undefined') return;
    // Prevent multiple registrations
    if ((gsap as any)._registered) return;

    gsap.registerPlugin(ScrollTrigger);
    (gsap as any)._registered = true;

    // Optional: Set defaults
    gsap.defaults({
        ease: "power2.out",
        duration: 1
    });
}
