# Scratch classroom sequence

The September 26 growth sequence is refined by September 30: begin with Animate Your Name and one individual sprite-click reaction, retaining adjacent examples while learners add one action. Sound, size, color effects, turning, dialogue and backdrops are choices; loops and broadcasts are not required in this first project. Then explore keyboard movement, a dress-up worked example with two incomplete accessories, coordinates and reset, scenes and dialogue, loops, conditions, variables and a scored game. Finish by planning and building an independent mini-game from a blank workspace. Projects are Core; optional remixes are Practice. Normal is the shared task and Hard extends the same working project.

## Teacher workflow

1. Run the unchanged starter and predict one change together (about 5 minutes).
2. Model a single event/action pair or one completed sprite. For Dress-Up, use Hat; leave Badge and Boots for student work. Drag into position, read coordinates, then build the movement block.
3. Students complete Normal, explain their blocks, and perform the check (15–25 minutes).
4. Offer Hard or original costume/backdrop art once Normal works. Keep a working checkpoint. Discuss bitmap/vector art and real transparency.
5. Download each student's `.sb3`, reopen it, and finish with a short demonstration (5 minutes). School-approved tools may import the same files. No claim of institutional approval is implied.

The generation script creates twelve original, self-contained starters and optional teacher reference completions. Reference completions are for Normal; Hard intentionally allows multiple designs. Teacher files remain in the local teaching pack and are not published with student downloads. The separate blank independent-project download contains a backdrop and sprite but no scripts or solution; it is available through Start in IDE and the host New project button. Download existing work before replacing it.

```sh
node front-end/scripts/scratch/generate-projects.mjs /path/to/Starters /path/to/Teacher-Solutions
```

## References and authorship

The conceptual progression and coordinate-first dress-up teaching pattern were informed by [SFUSD MyCS Unit 1.4: Dress Up](https://sites.google.com/a/sfusd.edu/mycs-teacher/unit1/1-4), with its events/initialization sequence followed by loops, conditions and variables in later units. The MyCS pages identify a CC BY-NC-SA 4.0 license and inspiration from Harvey Mudd's MyCS curriculum. This implementation uses original lesson wording, block arrangements and robot artwork. It does not redistribute their student projects, images or lesson text, or relabel proprietary Juni projects.

Existing Scratch courses remain available in Classes. The school fork uses this sequence for its existing `scratch-level-1` course ID, retaining its five-course catalog and separate archived Python/Pygame references. Its previous Scratch Level 1 curriculum remains in Reference Materials below the new classroom sequence.

## Editor and deployment

The existing `/ide` page switches between Scratch blocks and the Python/Java workspace. Scratch loads only when selected. The official pinned Scratch GUI (with its asset base relocated) runs in an opaque sandboxed iframe; the adapter accepts only its parent window and a per-frame channel. No backend compilation or execution is introduced. Parent account cookies and DOM are inaccessible. Projects are imported/exported locally; public Scratch library assets may be fetched anonymously. Camera/microphone, cloud variables and external extensions are unavailable. All supplied starters embed their artwork and work without the external library.

The Vite plugin prepares the checksum-verified official distribution for dev/build without changing the site's npm dependency tree. The generated vendor directory is ignored; builds fail if the pinned download does not match. Only `/scratch-runtime/` public static assets receive wildcard CORS for the opaque frame. All other resource boundaries remain unchanged. Matching upstream source, licensing, trademarks and site adapter source are linked from the editor's credits.

Validate generated block references and real browser import/run/export before shipping. Keep local validation, pushed source, and verified production deployment distinct.
