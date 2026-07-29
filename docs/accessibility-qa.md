# Accessibility QA Checklist

This checklist complements the automated `npm run a11y` axe smoke suite. Run it before shipping changes to public navigation, the five-course reader, the Python IDE, course-resource rendering, or Julio's private teacher account.

## Screen Reader Pass

- On macOS with VoiceOver, open `/`, `/python-ide`, `/course-resource?asset=%2Fcourse-assets%2Fpython%2Fturtle-project-reference.md%23turtle-command-reference&label=Turtle+command+reference`, and `/admin`. Use `VO + Right Arrow`, then navigate by headings, landmarks, buttons, form controls, and links.
- On Windows with NVDA, repeat the public-route pass in Firefox or Chrome when a Windows machine is available. Verify that browse mode and focus mode both announce the active control and its destination.
- On `/`, confirm the selector announces exactly Scratch Levels 1 and 2, Python Levels 1 and 2, and PyGames. Confirm the selected course, section controls, lesson links, and resource labels are understandable without visual context.
- Open `/admin` while logged out. Confirm the teacher sign-in fields, remember-me checkbox, submit button, and any validation error are announced clearly.
- With Julio's code-provisioned teacher session, open `/admin` and confirm the teacher heading and account-security fields are announced clearly.

## Keyboard Pass

- Start at the browser address bar and move through every public page without a mouse.
- Verify visible focus on the skip link, header navigation, `/admin` sign-in form, course selector, course outline buttons, resource links, and Python IDE controls.
- Confirm the public course library never requires an account prompt and does not expose a signup control.
- Confirm no hidden control receives focus and no keyboard trap occurs in the teacher sign-in form, course reader, or Python IDE.

## Contrast And Motion Pass

- Check light and dark mode at mobile, tablet, and desktop widths.
- Verify primary text, muted text, buttons, form controls, alerts, code, canvas labels, and course resource links remain readable.
- With reduced motion enabled, confirm animation is not the only status cue and IDE output remains understandable.

## Required Automated Evidence

- `npm run a11y`
- `npm run -w front-end test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
