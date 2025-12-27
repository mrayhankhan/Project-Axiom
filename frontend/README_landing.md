# Landing Page Implementation Guide

This directory contains the implementation of the Apple-style scroll-driven landing page for Project Axiom.

## Overview

The landing page (`/`) is built using Next.js, Tailwind CSS, and GSAP (GreenSock Animation Platform). It features:

-   **Scroll-driven Animations**: Sections pin and scrub based on scroll position using `ScrollTrigger`.
-   **Code-generated Visuals**: All visuals are implemented in code (SVG/Canvas) within `components/landing/visuals/`.
-   **Theme Awareness**: Fully supports Light and Dark modes using `next-themes` and shared tokens.
-   **Performance**: Visuals use `requestAnimationFrame` and are optimized for performance.

## Key Components

-   `components/landing/Hero.tsx`: The hero section with rotating text and entrance animations.
-   `components/landing/BentoGrid.tsx`: A dynamic grid of feature tiles with random swap animations.
-   `components/landing/FeatureSection.tsx`: A reusable wrapper that handles the pinning and scrubbing logic for each feature.
-   `components/landing/visuals/*.tsx`: Individual visual components for each feature (Ingest, Vectorize, QA, etc.).

## Setup & Dependencies

The following dependencies are required:

```bash
npm install gsap @types/gsap classnames
```

GSAP is initialized in `lib/scroll/gsap-init.ts` to ensure it only runs on the client side.

## Customization

-   **Theme Colors**: Edit `tokens/theme-tokens.ts` to adjust the color palette used by the visuals.
-   **Animations**: Tweak the GSAP timelines in `FeatureSection.tsx` or individual visual components to adjust timing and easing.

## Analytics

To add Google Analytics or other trackers, insert the script in `app/layout.tsx`. The landing page is designed to be performant and should not be significantly impacted by lightweight analytics scripts.

## Troubleshooting

-   **Hydration Mismatch**: Ensure all GSAP logic is wrapped in `useEffect` or `useLayoutEffect` and only runs on the client.
-   **Scroll Issues**: If pinning feels jerky, check that `ScrollTrigger` is correctly registered and that the layout doesn't have conflicting `overflow` properties.
