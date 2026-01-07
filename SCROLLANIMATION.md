# Scroll Animation Implementation Guide for Landing Pages

This is a comprehensive guide for implementing scroll-triggered animations in a Next.js landing page, based on patterns from the U4nor Recruitment webapp.

---

## Prerequisites

### Required Dependencies
```bash
npm install framer-motion lucide-react
```

### Required Imports (Every Animated Component)
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
```

> [!IMPORTANT]
> All animated components MUST include `'use client';` directive at the top since Framer Motion requires client-side JavaScript.

---

## Core Animation Patterns

### Pattern 1: Basic Scroll-Triggered Fade-In with Slide

This is the **most commonly used pattern** for section headers and content blocks.

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="text-center mb-16"
>
  <h2>Section Title</h2>
  <p>Section description</p>
</motion.div>
```

**Key Properties:**
| Property | Value | Purpose |
|----------|-------|---------|
| `initial` | `{ opacity: 0, y: 30 }` | Start invisible, 30px below final position |
| `whileInView` | `{ opacity: 1, y: 0 }` | Animate to visible at final position |
| `viewport` | `{ once: true }` | Only trigger animation once (prevents re-triggering on scroll back) |
| `transition` | `{ duration: 0.6 }` | Animation takes 600ms |

---

### Pattern 2: Staggered List/Grid Items with Delays

For cards, features, or any list of items that should animate in sequence.

```tsx
const items = [
  { title: 'Item 1', delay: 0.1 },
  { title: 'Item 2', delay: 0.2 },
  { title: 'Item 3', delay: 0.3 },
  { title: 'Item 4', delay: 0.4 },
];

// Inside JSX:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: item.delay }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <Card>
        <CardContent>
          <h3>{item.title}</h3>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

**Timing Formula:**
- Start delays at `0.1` seconds
- Increment by `0.1` for each subsequent item
- Keep delays under `1.0` second for good UX

---

### Pattern 3: Alternating Direction Animation (Mobile Lists)

For vertical timelines or lists where items alternate entering from left/right.

```tsx
{steps.map((step, index) => (
  <motion.div
    key={step.title}
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: step.delay }}
    className="flex items-center space-x-4"
  >
    {/* Step content */}
  </motion.div>
))}
```

---

### Pattern 4: Scale-In Animation (Badges, Icons, CTAs)

For elements that should "pop" into view.

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full"
>
  <CheckCircle className="w-4 h-4 mr-2" />
  Badge Text
</motion.div>
```

**Variation - Spring Animation for More "Bounce":**
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.2, type: "spring" }}
>
  {/* Content */}
</motion.div>
```

---

### Pattern 5: Interactive Hover Effects

For buttons, cards, and interactive elements.

```tsx
// Card with lift effect on hover
<motion.div
  whileHover={{ y: -5 }}
  whileTap={{ scale: 0.95 }}
  className="group cursor-pointer"
>
  <Card className="hover:shadow-xl transition-all duration-300">
    {/* Card content */}
  </Card>
</motion.div>

// Icon with rotation on hover
<motion.div
  whileHover={{ scale: 1.1, rotate: 5 }}
  className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary"
>
  <Icon className="w-8 h-8" />
</motion.div>

// Button with scale effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-8 py-3 rounded-lg font-semibold"
>
  Click Me
</motion.button>
```

---

### Pattern 6: Carousel/Slider with AnimatePresence

For testimonial carousels or image sliders.

```tsx
const [currentIndex, setCurrentIndex] = useState(0);

<div className="relative h-[400px]">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0"
    >
      {/* Card/Slide content */}
    </motion.div>
  </AnimatePresence>
</div>
```

**Navigation Controls:**
```tsx
const goToPrevious = () => {
  setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
};

const goToNext = () => {
  setCurrentIndex((prev) => (prev + 1) % items.length);
};
```

---

### Pattern 7: Hero Section Initial Load Animations

For the hero section (first screen), use `animate` instead of `whileInView` with staggered delays.

```tsx
// Headline
<motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-6xl font-bold"
>
  Main Headline
</motion.h1>

// Subtext (0.2s delay)
<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
>
  Supporting text
</motion.p>

// Badge (0.4s delay with scale)
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
>
  <Badge>Tagline</Badge>
</motion.div>

// CTA Buttons (0.6s delay)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
  className="flex gap-4"
>
  <Button>Primary CTA</Button>
  <Button variant="outline">Secondary CTA</Button>
</motion.div>

// Stats (0.8s delay)
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
  className="grid grid-cols-3 gap-8"
>
  {/* Stats content */}
</motion.div>
```

---

## Advanced Effects

### Animated Gradient Background

```tsx
<section className="relative min-h-screen overflow-hidden">
  <style>{`
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-bg {
      background: linear-gradient(
        135deg,
        #FFFFFF 0%,
        #FFF0F5 25%,
        #FFE4E1 50%,
        #FFF0F5 75%,
        #FFFFFF 100%
      );
      background-size: 400% 400%;
      animation: gradientShift 5s ease infinite;
    }
    .dark .animate-gradient-bg {
      background: linear-gradient(
        135deg,
        #0f172a 0%,
        #2D0A0D 25%,
        #450a0a 50%,
        #2D0A0D 75%,
        #0f172a 100%
      );
      background-size: 400% 400%;
      animation: gradientShift 5s ease infinite;
    }
  `}</style>

  <div className="absolute inset-0 animate-gradient-bg" />
  
  {/* Content on top */}
  <div className="relative z-10">
    {/* Your content */}
  </div>
</section>
```

---

### Floating Particle System

Create ambient particles that float upward. **Must be client-side generated** to avoid hydration errors.

```tsx
interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

const [stars, setStars] = useState<Star[]>([]);

useEffect(() => {
  const generatedStars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 1,        // 1-9px
    top: Math.random() * 100,            // 0-100%
    left: Math.random() * 100,           // 0-100%
    duration: Math.random() * 8 + 4,     // 4-12s
    delay: Math.random() * 5,            // 0-5s
    opacity: Math.random() * 0.5 + 0.1,  // 0.1-0.6
  }));
  setStars(generatedStars);
}, []);

// In JSX:
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {stars.map((star) => (
    <motion.div
      key={star.id}
      initial={{
        opacity: star.opacity,
        scale: 0.5
      }}
      animate={{
        opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
        scale: [0.5, 1, 0.5],
        y: [0, -150, 0]
      }}
      transition={{
        duration: star.duration * 0.5,
        delay: star.delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        width: `${star.size}px`,
        height: `${star.size}px`,
        top: `${star.top}%`,
        left: `${star.left}%`,
      }}
    >
      <div className={`w-full h-full rounded-full ${
        star.size > 4
          ? 'bg-gray-400/30 dark:bg-gray-500/30 shadow-lg'
          : 'bg-gray-300/25 dark:bg-gray-400/25'
      }`} />
    </motion.div>
  ))}
</div>
```

---

### Rotating Orbital Elements

Decorative circles that rotate infinitely.

```tsx
{/* Clockwise rotation */}
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-300/20 rounded-full"
/>

{/* Counter-clockwise rotation */}
<motion.div
  animate={{ rotate: -360 }}
  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  className="absolute bottom-1/3 right-1/4 w-40 h-40 border border-gray-300/15 rounded-full"
/>
```

---

### Gradient Blur Blobs (Pulsing)

```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
<div 
  className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse" 
  style={{ animationDelay: '1s' }} 
/>
```

---

### Scroll Indicator (Bouncing)

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 1.2 }}
  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
>
  <div className="animate-bounce">
    <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
      <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
    </div>
  </div>
</motion.div>
```

---

## Complete Section Template

Here's a complete section component combining all patterns:

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon1, Icon2, Icon3 } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    { icon: Icon1, title: 'Feature 1', description: 'Description 1', delay: 0.1 },
    { icon: Icon2, title: 'Feature 2', description: 'Description 2', delay: 0.2 },
    { icon: Icon3, title: 'Feature 3', description: 'Description 3', delay: 0.3 },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Pattern 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Section Title
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Section description goes here
          </p>
        </motion.div>

        {/* Feature Grid - Pattern 2 + 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                {/* Icon with hover rotation */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Pattern 1 + 5 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-primary text-white font-semibold"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
```

---

## Best Practices Checklist

- [ ] Add `'use client';` to every animated component
- [ ] Use `viewport={{ once: true }}` to prevent re-triggering
- [ ] Keep transition durations between 0.5-0.8 seconds
- [ ] Stagger delays by 0.1-0.2 seconds for sequential items
- [ ] Generate random values in `useEffect` to avoid hydration errors
- [ ] Combine CSS transitions with Framer Motion for smoother effects
- [ ] Use `ease: "easeOut"` for natural-feeling animations
- [ ] Add `pointer-events-none` to decorative animated elements
- [ ] Test with `prefers-reduced-motion` for accessibility

---

## Animation Values Quick Reference

| Animation Type | Duration | Delay Step | Easing |
|---------------|----------|------------|--------|
| Fade in | 0.6s | 0.1s | default |
| Slide up | 0.6-0.8s | 0.1s | easeOut |
| Scale | 0.6s | 0.2s | default/spring |
| Carousel slide | 0.5s | N/A | default |
| Infinite rotation | 20-30s | N/A | linear |
