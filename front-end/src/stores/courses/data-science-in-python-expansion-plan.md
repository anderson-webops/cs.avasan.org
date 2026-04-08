# Data Science in Python Expansion Plan

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
5. Install `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `streamlit`, and `altair`.

Windows walkthrough:

1. Install Python 3 from python.org and enable `Add Python to PATH`.
2. Install PyCharm or VS Code.
3. If using VS Code, install `Python` and `Jupyter`.
4. Create a virtual environment with `py -m venv .venv`.
5. Install `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `streamlit`, and `altair`.

Course-specific notes:

- This course should allow both notebook-first work and app-style dashboard work.
- Add Google Colab as an optional backup path for students with weaker local machines.

## Positioning

This course should sit between core Python and machine learning. It should
teach how to load, clean, inspect, visualize, and communicate with data before
students jump into predictive models.

## Audience and Prerequisites

- Completed `Python Level 2`
- Comfortable with lists, dictionaries, functions, loops, and files
- Helpful but not required: `Python Level 3`

## Core Outcomes

- Use pandas for tabular data work
- Build clear plots and dashboards
- Ask good questions of a dataset
- Clean messy data and document assumptions
- Communicate findings visually and in writing

## Recommended Structure

### Module 1: What Data Science Is

- asking questions
- collecting evidence
- cleaning and interpreting results

### Module 2: Notebooks and Workflow

- Google Colab vs local notebooks
- cells, markdown, reproducibility, organization

### Module 3: pandas Foundations

- reading CSVs
- selecting columns
- filtering rows
- grouping and aggregation

### Module 4: Cleaning and Validation

- missing values
- duplicates
- inconsistent formatting
- type conversion

### Module 5: Visualization Basics

- line, bar, scatter, histogram, box plot
- choosing the right chart
- misleading charts and bad scales

### Module 6: Storytelling with Data

- framing a question
- writing a concise analysis
- deciding what matters

### Module 7: Statistics in Context

- averages, spread, correlation, outliers
- what correlation does and does not mean

### Module 8: Interactive Dashboards

- Streamlit for interactive apps
- Altair for cleaner declarative charts
- when to use each

### Module 9: Domain Projects

- sports
- movies
- finance
- public datasets
- environmental datasets

### Module 10: Data Science Capstone

- question
- dataset
- cleaning
- analysis
- dashboard
- presentation

## Streamlit and Altair Recommendation

Yes, both should be added near the back half of the course.

- `Altair` should be used to teach high-quality chart construction
- `Streamlit` should be used for end-of-course interactive dashboards

This gives students something more interactive and portfolio-friendly than
static notebook outputs.

## Example Project Outlines

- Analyze school or tutoring attendance trends
- Build a movie revenue dashboard
- Compare NBA or soccer player statistics
- Create a Streamlit app for filtering and plotting housing data
- Build an Altair dashboard for weather trends

## Expansion Ideas

- Add SQL and database querying
- Add spreadsheet interoperability
- Add geospatial mapping with simple public datasets
- Add a lightweight intro to experimentation and A/B testing
