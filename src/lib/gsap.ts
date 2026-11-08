'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Registered once; importing this module from any client component is enough.
gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: 'expo.out', duration: 1.1 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power2.out',
} as const;
