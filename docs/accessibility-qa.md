# Accessibility QA Checklist

This checklist complements the automated `npm run a11y` axe smoke suite. Run it before shipping layout, navigation, course-reader, admin, scheduler, or account-management changes that affect keyboard or assistive-technology users.

## Screen Reader Pass

- macOS VoiceOver: open `/`, `/courses`, `/profile`, `/signup`, `/admin/mdmail`, and `/admin/student-management`; use `VO + Right Arrow` through the page, then jump by headings, landmarks, buttons, form controls, and links.
- Windows NVDA: repeat the same routes in Firefox or Chrome when a Windows machine is available; verify browse mode and focus mode both announce the active control and destination clearly.
- Confirm modal dialogs announce their title and description, trap focus while open, close with Escape, and return users to a predictable place.
- Confirm tablists announce the selected tab and arrow-key navigation changes tabs without trapping users in the control.
- Confirm embedded scheduler, wheel, and spreadsheet surfaces have a clear fallback link or static fallback content before the iframe.

## Keyboard Pass

- Start at the browser address bar and tab through each page without using the mouse.
- Verify visible focus on every control, including header navigation, footer theme toggle, course outline buttons, resource links, admin tabs, send buttons, modal close buttons, and iframe fallback links.
- Confirm no hidden control receives focus and no keyboard trap occurs inside the scheduler, spreadsheet, wheel, or modal overlays.

## Contrast And Motion Pass

- Check light mode and dark mode at desktop and mobile widths.
- Verify primary text, muted text, buttons, form controls, alerts, course resource links, and code snippets remain readable.
- With reduced motion enabled, confirm videos do not autoplay/loop and animated loading states do not become the only status cue.

## Required Automated Evidence

- `npm run a11y`
- `npm run -w front-end test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
