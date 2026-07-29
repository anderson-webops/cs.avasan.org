# Graph Sketcher Browser Integration

## Decision

The original GraphSketcher cannot be deployed directly on the
`cs.avasan.org` Linux host. Its shared model and user interfaces are
Objective-C code coupled to Cocoa, UIKit, OmniGroup frameworks, and an Xcode
5.1-era build. The most
substantial upstream fork modernizes the macOS application but remains
Apple-only. A newer JavaScript project with the same name is an unrelated chart
maker, not a port.

The `cs.avasan.org` integration is therefore an independent browser adaptation.
It keeps graph editing in Vue, TypeScript, and SVG and never starts a drawing,
conversion, or compilation process on the back end. The Linux server only
serves static frontend assets.

## Compatibility Base

The browser editor follows the portable, versioned `.graphsketch` JSON model
used by the maintained Avalonia desktop port. Common documents preserve:

- canvas size, background, padding, and legend placement;
- linear and logarithmic axes, grid settings, titles, and tick spacing;
- point series, line and marker styles, fills, labels, and error bars;
- text and simple shape annotations.

The browser also imports plain-XML and ZIP-wrapped original `.ograph` documents
on the client. Imported files are never overwritten.

## Runtime and Safety Boundaries

- Expression plotting uses a small parser; it does not call `eval` or
  `Function`.
- Imported projects are normalized and bounded to 8 MB, 128 series, 100,000
  points, and 2,000 annotations.
- ZIP import runs in a dedicated, cancellable worker, extracts only one
  `contents.xml`, enforces compressed and expanded byte limits, and stops
  imports that exceed ten seconds.
- Autosave uses a downstream-namespaced browser `sessionStorage` entry. A
  duplicated tab may receive its own browser-managed copy, so students should
  clear and close every open Graph Sketcher tab before another student uses a
  shared computer.
- SVG, PNG, CSV, and `.graphsketch` exports are generated in the browser.
- No GraphSketcher route, model, or export operation is implemented in the
  Express API.

## Attribution

Graph Sketcher was created by Robin Stewart in 2007 and further developed by
The Omni Group. The original source was released in 2014 under the Omni Source
License 2007. This browser adaptation is not endorsed by or affiliated with the
original maintainers or The Omni Group. The permission notice is preserved at
`docs/third-party/graphsketcher-omni-source-license.txt` and published at
`/licenses/graphsketcher-omni-source-license.txt`.
