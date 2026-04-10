# Machine Learning Repo Alignment Plan

## Problem

`machine-learning.ts` currently surfaces about 22 of the 33 top-level folders in `instruction-material/AI-Level-2`.

The repo still contains several additional modeling labs, starter variants, and capstone-style projects that are not represented in the live course.

Examples currently not surfaced in the course:

- `ML1-Customer-Segmentation-Interview-Starter`
- `ML2-KNN-Car-Classification-Updated`
- `ML3-Email-Spam-Classification`
- `ML4-Diabetes-Diagnosis-With-Neural-Networks`
- `ML5-Predicting-Life-Expectancy`
- `ML5-Simple-Polynomial-Regression`
- `ML5-Simple-Polynomial-Regression-Starter`
- `ML6-Predicting-House-Prices`
- `ML7-Weather-Image-Classifier`
- `ML8-Master-Project`

## Plan

1. Separate unmatched folders into:
    - genuinely missing modules the course should expose
    - starter or updated variants that should collapse under one canonical project
    - older or weaker exercises that should remain hidden
2. Expand `machine-learning.ts` so the public course reflects the full intended progression from clustering and classification into regression, neural networks, and capstone work.
3. Normalize every multi-variant project to one canonical student link and, where appropriate, one gated solution or starter link.
4. Avoid exposing both `Starter` and `Updated` folders as separate projects unless they represent distinct teaching stages.
5. Add repo cleanup notes for any redundant folders that should eventually be renamed, archived, or deleted.

## Validation

- each intended Machine Learning module has a visible corresponding project in `machine-learning.ts`
- starter and updated duplicates are not presented as separate first-class lessons unless explicitly justified
