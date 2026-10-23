# Portfolio expansion

Source: `MGL_Portfolio_Update_All_Images.zip`, supplied by the owner on 2026-10-17.

The 17 new screenshots are listed in `portfolio-expansion-assets.json`. Each has a 640 px and 1280 px WebP variant at quality 88, with no color adjustment, generated content, mockup, or crop. Original aspect ratios are retained. The new Madeireira HR products screenshot replaces its previous version; the archive contains 31 screens across 11 project families.

`dist/content.js` holds the case order, captions, image dimensions and editorial positions. Desktop positions use a 2400 × 1550 virtual canvas. Each case has an anchor; its secondary screens use offsets relative to that anchor. Keep the central headline area clear when editing coordinates.

`dist/site.js` creates one family per project and handles mouse traversal, coarse-pointer dragging, arrow keys, focus visibility and the existing GSAP reveal. Motion stops after settling or leaving the viewport. `dist/ui-final.js` places the same headline above the archive below 801 px. Mobile keeps the same case families in normal vertical flow, with alternating screen widths and no horizontal tracks.

`dist/portfolio-view.css` contains the scoped portfolio styles. Other sections, global grain, contact destinations, tracking and backend are unchanged.

Local QA: Chrome and WebKit at 1440, 1280, 1024, 430 and 390 px; image loading, grouping, mouse traversal, focus/keyboard access to every screen, hover, reduced motion and resize round-trips. Visual QA evidence is stored in the ignored `work/portfolio-expansion/` directory. No deployment is part of this change.
