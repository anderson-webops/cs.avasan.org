# Machine Learning Rework Plan

## Setup and Tooling

Preferred IDEs: `PyCharm` or `VS Code`.

Official links:

- [PyCharm install guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code Python guide](https://code.visualstudio.com/docs/languages/python)
- [Python downloads](https://www.python.org/downloads/?m=landing)

macOS walkthrough:

1. Install Python 3 from python.org.
2. Install PyCharm or VS Code.
3. If using VS Code, install `Python` and `Jupyter`.
4. Create a virtual environment with `python3 -m venv .venv`.
5. Install `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `jupyter`, and `seaborn`.

Windows walkthrough:

1. Install Python 3 from python.org and enable `Add Python to PATH`.
2. Install PyCharm or VS Code.
3. If using VS Code, install `Python` and `Jupyter`.
4. Create a virtual environment with `py -m venv .venv`.
5. Install `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `jupyter`, and `seaborn`.

Course-specific notes:

- Keep notebook support available, but also teach how to run the same code from `.py` modules.
- If neural network modules remain, add TensorFlow or PyTorch only when those units begin, not during initial setup.

## Positioning

The current `Machine Learning` course is a strong start, but it needs clearer
explanations, more scaffolding, more datasets, and a fuller progression through
classic models. It currently reads closer to `AI Level 2`.

## Key Rework Goals

- Improve explanations and pacing
- Add more videos for concept explanation
- Add more datasets and smaller practice sets
- Add decision trees
- Make every project easier to start and easier to explain afterward

## Recommended New Sequence

### Module 1: What Machine Learning Is

- supervised vs unsupervised vs reinforcement
- features, labels, training data, test data

### Module 2: Data Preparation and Visualization

- pandas review
- plotting
- train/test split
- normalization concepts

### Module 3: K-Means Clustering

- keep existing cluster work, but simplify the first explanations

### Module 4: K-Nearest Neighbors

- classify simple feature spaces
- more visual examples before code

### Module 5: Naive Bayes

- better probabilistic intuition
- stronger text-classification examples

### Module 6: Decision Trees

- splits
- entropy or Gini at an intuitive level
- interpretability
- overfitting

### Module 7: Linear Regression

- trends
- residuals
- prediction error

### Module 8: Neural Networks

- simplify and tighten the neuron/unit explanation
- more visuals before keras code

### Module 9: Model Evaluation

- accuracy, precision, recall, F1
- confusion matrix
- why one metric is not enough

### Module 10: Capstone

- compare at least two models on one dataset

## Video Strategy

Add short media to each module:

- one concept explainer
- one coding walkthrough
- one project demo

## Dataset Strategy

Create a small internal dataset list by difficulty:

- tiny synthetic datasets for concept demos
- medium public datasets for projects
- one open-ended capstone dataset bank

## Good Additions

- Titanic
- Iris
- Diabetes
- Wine quality
- Digits
- Housing
- Spam text
- Customer churn

## Expansion Ideas

- Add model interpretability tools
- Add feature engineering labs
- Add ensemble methods after decision trees
- Add a deployment or model-serving appendix
