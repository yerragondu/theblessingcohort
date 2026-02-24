# The Blessing CoHort - AI Coding Instructions

## Project Overview

This is a multi-page static website for a faith-based mission organization supporting pastors in unreached regions. Built with vanilla HTML/CSS/JavaScript - no frameworks, bundlers, or build tools.

## Architecture & File Organization

**Core Pages:**

- [index.html](index.html) - Homepage with hero slideshow, mission video, origin story, team section
- [give.html](give.html) - Donation/partnership information page
- [where-we-are-right-now.html](where-we-are-right-now.html) - Current mission status and work structure

**Assets Structure:**

- `assets/images/` - Team photos (dad-2.jpg, dp1.jpg, madison.webp) and slideshow images (v1.png through v5.png)
- `assets/video/` - Video content directory
- `css/style.css` - Single stylesheet (1295 lines) with all styling
- `js/main.js` - Single script file with all interactions

## Design System & Patterns

### CSS Custom Properties (`:root` in style.css)

Always use CSS variables for consistency:

```css
--primary: #c41e3a;
--primary-dark: #8b0000;
--dark: #1a1a1a;
--shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
```

### Consistent Section Structure

All content sections follow this pattern:

```html
<section class="section">
  <h2>Section Title</h2>
  <p class="section-text">Description text</p>
  <!-- Section-specific content -->
</section>
```

### Header Navigation

Fixed header with gradient background (`.site-header`). Navigation links use underline animation on hover via `::after` pseudo-elements. The "Join the Journey" button is styled with `.give-btn` class.

### Reusable Components

- **Contact Modal** - Shared across all pages via `#contactModal` with overlay and form
- **Footer** - Identical footer structure on all pages with brand, links, contact info, and social media
- **Floating Contact Bubble** - Bottom-right button (`#contactBubble`) that opens contact modal

## JavaScript Interaction Patterns

### Modal System ([main.js](js/main.js))

Contact modal controlled by:

- `#contactBubble` (floating button) and `#contactBubbleAlt` (CTA button) - triggers
- `#closeContact` (X button) and `#contactOverlay` (backdrop) - close handlers
- Escape key listener for accessibility
- Auto-closes after 3 seconds on successful form submission

### Form Handling

Web3Forms integration (no backend needed):

- Action URL: `https://api.web3forms.com/submit`
- Access key stored in hidden input field
- Async `fetch()` with FormData
- Success message display (`#successMsg`) with fade-in animation

### Scroll Animations

IntersectionObserver pattern applied to all `.section` elements:

- Initial opacity: 0
- Triggers `fadeInUp 0.6s` animation when 10% visible
- Threshold: 0.1, rootMargin: "0px 0px -50px 0px"

### Image Optimization

Lazy loading implemented for images with `data-src` attribute using IntersectionObserver.

## Styling Conventions

### Gradient Backgrounds

Linear gradients are used extensively:

- Header: `linear-gradient(135deg, rgba(20,20,30,0.95) 0%, rgba(30,20,40,0.95) 100%)`
- Body: `linear-gradient(135deg, #f8f9fa 0%, #e8eef5 100%)`
- Buttons: `linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)`

### Typography

- Primary font: 'Inter' (body text)
- Secondary font: 'Poppins' (headings, decorative)
- Loaded from Google Fonts in `<head>`

### Responsive Breakpoint

Main breakpoint at 768px (`@media (max-width: 768px)`)

## Content & Content Updates

### Team Member Cards

Located in `.team-grid` on [index.html](index.html). Each uses inline style for avatar background-image:

```html
<div
  class="avatar"
  style="background-image: url('assets/images/dp1.jpg')"
></div>
```

### Hero Slideshow

Uses 4 slides with staggered animations. Background images set via nth-child selectors in CSS, referencing v1.png through v4.png (v5.png available but not currently used).

### Scripture & Quotes

Faith-based content appears as:

- `.scripture` spans in hero sections
- `.quote` paragraphs in footers
- Part of brand identity, maintain reverent tone

## Development Workflow

**No build process** - edit files and refresh browser.

**File linking:**

- CSS: `<link rel="stylesheet" href="css/style.css" />`
- JS: `<script src="js/main.js"></script>` (end of body)
- Images: relative paths from HTML location

**Testing checklist:**

1. Contact modal open/close on all pages
2. Form submission success flow
3. Scroll animations trigger correctly
4. Header shadow effect on scroll
5. Responsive layout at mobile breakpoint

## Common Modifications

**Adding new page:** Copy header/footer from existing page, link CSS/JS, update nav active states.

**New team member:** Add `.team-card` div in `.team-grid`, place image in `assets/images/`, use inline style pattern.

**Styling changes:** Prefer updating CSS variables in `:root` over hardcoded values for consistency.

**Contact form changes:** Update form fields in all HTML files (modal is duplicated, not shared as component).
