import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const machineLearningCourse: RawCourse = {
	name: "Machine Learning",
	modules: [
		{
			title: "ML0 Setup, Tooling, and Data Workflow",
			curriculum: [
				{
					title: "Preferred Tools and Environment",
					content:
						"Standardize the course around `Google Colab` for the main workflow, with `VS Code` or `PyCharm` as the local follow-on environment when notebook work is ready to move into local modules. Set up Python, pandas, NumPy, matplotlib, seaborn, scikit-learn, and notebook support before the first real model so environment issues do not derail the conceptual lessons."
				},
				{
					title: "Notebook Cells vs. Reusable Python Modules",
					content:
						"Keep notebooks useful for quick exploration while still organizing reusable helpers, cleaning steps, and plotting logic into functions that can move into `.py` files later. This keeps the course from feeling like one long sequence of disconnected notebook cells."
				},
				{
					title: "Data Cleaning and Visualization First",
					content:
						"Before any model is trained, inspect columns, missing values, scales, and class balance. Basic plotting and train/test thinking should be treated as part of the baseline workflow, not as optional polish after the algorithm appears."
				},
				{
					title: "Model Comparison as the Course Habit",
					content:
						"Most serious datasets should be tested with at least two approaches. One model run is only a starting point, not the end of the reasoning."
				},
				{
					title: "ML0 Setup, Tooling, and Data Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML0 Setup, Tooling, and Data Workflow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification"
				}
			],
			supplementalProjects: [
				{
					title: "ML0 Setup, Tooling, and Data Workflow: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML0 Setup, Tooling, and Data Workflow",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification"
				}
			]
		},
		{
			title: "ML1 K-Means Clustering",
			curriculum: [
				{
					title: "Introduction to Machine Learning",
					content:
						"AI is about building intelligent systems, and machine learning (ML) is the subset where systems learn patterns from data. Everyday examples include spam filters learning what emails to block and Netflix learning what shows to recommend based on viewing history. The four main ML types are reinforcement learning (learning by reward and punishment), unsupervised learning (finding patterns without labels), supervised learning (learning from labeled examples), and semi-supervised learning (mix of labeled and unlabeled data). This course focuses mainly on unsupervised and supervised learning."
				},
				{
					title: "Unsupervised Learning & Clustering",
					content:
						"Unsupervised learning takes a dataset without labels and tries to find patterns or groupings in it. Customer segmentation is a motivating example: a store owner can group customers by characteristics like age, income, or spending behavior to better target marketing. Clustering is the process of finding distinct groups (clusters) of similar data points. A simple 2D example uses points A(1,1), B(2,1), C(3,3), and D(4,3). After plotting them, {A,B} visually form one cluster and {C,D} form another. Algorithms become necessary when there are hundreds or thousands of points instead of just four."
				},
				{
					title: "K-Means Clustering Algorithm",
					content:
						"K-means clustering is a popular algorithm that partitions data into k clusters. A centroid is the mean of all points in a cluster, thought of as the cluster's center. Each point is assigned to the cluster whose centroid it is closest to, usually using Euclidean distance sqrt((y2 - y1)^2 + (x2 - x1)^2). In a four-point example using A, B, C, and D with k = 2, the steps are: choose k, pick initial centroids such as A and B, assign each point to the nearest centroid, recompute centroids by averaging point coordinates in each cluster, and repeat until centroids stop changing. One or two computed iterations make the distance calculations visible and show that results can depend on the initial random centroids."
				},
				{
					title: "Google Colab Setup",
					content:
						"Google Colab is the main IDE for this course and requires a Google account. Log in at https://colab.research.google.com, bookmark it, open the `Welcome to Colaboratory` notebook, and inspect the core features. Create a new notebook (File → New notebook), locate left-sidebar tools like Table of Contents, Find and Replace, and Files, then add code and text cells, run code, and reorder cells. Finish by creating a variable, printing it, printing a name in a second cell, and adding a short descriptive text cell before using Runtime → Restart and run all."
				},
				{
					title: "ML1 Project 1: Customer Segmentation",
					content: `**Goal:** Build k-means clustering from scratch to group customers by annual income and spending score.

**Setup:**
- Create a dedicated Google Drive folder for machine-learning projects.
- Upload the Kaggle customer segmentation dataset.
- Mount Google Drive in Colab and read the CSV with pandas.
- Inspect the columns and select annual income plus spending score as the two clustering features.

**Exploration:**
- Create a scatterplot of income versus spending score before clustering.
- Estimate how many groups appear visually and record why that estimate might be uncertain.

**Algorithm steps:**
1. Choose \`k\`, such as \`k = 5\`.
2. Store the data points in a list or array.
3. Choose \`k\` random initial centroids.
4. Store current centroids, previous centroids, and each customer's assigned cluster index.
5. Repeat until the centroids stop changing:
   - Compute Euclidean distance from each point to each centroid.
   - Assign each point to the nearest centroid.
   - Copy current centroids to previous centroids with \`deepcopy\`.
   - Recompute each centroid by averaging all points assigned to that cluster.

**Checkpoints:**
- The final plot uses different colors for different clusters.
- The algorithm is run more than once so random initialization is visible.
- At least two \`k\` values are compared.
- The written summary explains the dataset, the clustering goal, the final groups, and one surprising or uncertain pattern.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Updated",
					datasetLink:
						"https://www.kaggle.com/vjchoudhary7/customer-segmentation-tutorial-in-python",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_project_1.mp4"
				},
				{
					title: "ML1 Project 2: Disney Movie Clustering",
					content: `**Goal:** Use scikit-learn k-means to cluster Disney movies by release year and inflation-adjusted revenue.

**Data preparation:**
- Load the Disney movie dataset in Colab.
- Extract the release date and inflation-adjusted revenue columns.
- Convert the release date string into a numeric release year.
- Build a two-column feature matrix using year and inflation-adjusted revenue.

**Model steps:**
1. Plot the raw data before clustering.
2. Choose a starting value for \`k\`.
3. Use scikit-learn's k-means implementation and call \`fit_predict()\` to generate cluster assignments.
4. Inspect \`cluster_centers_\` so the centroid locations are not treated as hidden magic.
5. Plot the clustered scatterplot.

**Comparison checks:**
- Try multiple \`k\` values.
- Compare how the cluster shapes, boundaries, and centroid positions change.
- Explain whether the clusters reveal meaningful movie-era patterns or mainly reflect the scale of the revenue data.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Updated",
					datasetLink:
						"https://www.kaggle.com/prateekmaj21/disney-movies",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "ML1 Supplemental Project 1: Flower Clustering",
					content: `**Goal:** Cluster iris flowers by petal length and petal width.

**Required workflow:**
- Load the \`iris.csv\` file into a notebook.
- Use either scikit-learn k-means or a from-scratch implementation based on the customer segmentation project.
- Plot the raw data before clustering.
- Plot the clustered data with a different color for each cluster.

**Reflection checks:**
- Compare the visually estimated number of groups with the chosen value of \`k\`.
- Explain how the clusters relate to the three iris species.
- Name one limitation of clustering flowers without using the species labels during training.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Flower-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Flower-Clustering",
					datasetLink:
						"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_supplemental_project_1.mp4"
				}
			]
		},
		{
			title: "ML2 K-Nearest Neighbors",
			curriculum: [
				{
					title: "Introduction to Supervised Learning",
					content:
						"Supervised learning trains on a dataset where both inputs and outputs (labels) are known. The algorithm learns a mapping from inputs to outputs, then uses that mapping to predict labels on new inputs where the output is unknown. The core steps are building feature vectors from the raw data, associating each vector with a label, training on these input-output pairs, and then evaluating the model on new data."
				},
				{
					title: "Classification Basics",
					content:
						"Classification is a supervised learning task where the output is a discrete category. Spam vs. non-spam email is a simple example. Classification also connects back to customer segmentation: the clusters discovered with k-means can be treated as categories or labels, such as cluster 0, cluster 1, and cluster 2. Once each customer's cluster is known, a classifier can take a customer's income and spending score and predict the correct cluster for new customers."
				},
				{
					title: "K-Nearest Neighbors Algorithm",
					content:
						"K-nearest neighbors (KNN) is a simple classification method that labels a new input based on the majority label among its k closest neighbors in the training data. Use the sample dataset with points A(1,1; Cluster 1), B(2,1; Cluster 1), C(3,3; Cluster 2), D(4,3; Cluster 2), and an unlabeled point E(4,4). Plot the dataset and predict E's cluster visually. Then trace the KNN algorithm: choose k, such as k = 2, compute Euclidean distance from E to each point, identify the k closest neighbors, and assign E to the cluster appearing most often among those neighbors. The distance table shows that E is closest to C and D, both in Cluster 2, so KNN classifies E as Cluster 2."
				},
				{
					title: "Training, Validation, and Testing Data",
					content:
						"To evaluate a classifier properly, the dataset is split into training, validation, and testing sets. Training data is used to fit the model; validation data is used to tune hyperparameters, such as k, and check accuracy while making adjustments; and testing data is held out and used only at the end to measure final performance. Most course projects use training and testing sets: training for model fitting and testing to estimate how well the classifier generalizes to new data."
				},
				{
					title: "ML2 Project 1: KNN Customer Segment Classification",
					content: `**Goal:** Predict a customer's cluster segment from annual income and spending score using K-nearest neighbors.

**Inputs:**
- Start from saved customer segmentation work, or reload the dataset and recreate the feature columns.
- Use the cluster assignments from k-means as labels.
- Build feature vectors in the form \`[income, spendingScore]\`.

**Model steps:**
1. Choose a KNN value such as \`k = 3\` or \`k = 5\`.
2. Split the data into training and testing sets.
3. Implement KNN manually or use scikit-learn's \`KNeighborsClassifier\`.
4. Evaluate the test-set accuracy.
5. Compare predicted labels with the original cluster labels.

**Transfer check:**
- Create at least one hypothetical customer feature vector.
- Predict that customer's segment.
- Check the result visually against the cluster plot and explain whether the prediction makes sense.

**Reflection:** Explain how \`k\` was chosen, how well the classifier performed, and what might happen if the clusters from the previous project were noisy.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated",
					datasetLink:
						"https://www.kaggle.com/vjchoudhary7/customer-segmentation-tutorial-in-python",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml2_project_1.mp4"
				},
				{
					title: "ML2 Project 2: KNN Car Classification",
					content: `**Goal:** Build a KNN classifier that predicts car acceptability from categorical car features.

**Data setup:**
- Download the classic car evaluation dataset.
- Identify the target label: acceptability.
- Identify the features: buying price, maintenance cost, doors, passengers, luggage boot, and safety.
- Read the dataset documentation before encoding values.

**Encoding task:**
- Many columns are strings, so convert category values into numeric codes.
- Use clear dictionaries for each column instead of relying on unexplained numbers.
- Use \`pandas.replace()\` or an equivalent method to apply the replacement table.

**Model steps:**
1. Construct feature vectors from the encoded columns.
2. Store labels from the acceptability column: \`unacc\`, \`acc\`, \`good\`, or \`vgood\`.
3. Split the data with \`train_test_split()\`.
4. Train scikit-learn's \`KNeighborsClassifier\`.
5. Compute test-set accuracy.

**Checkpoints:**
- Classify one hypothetical car feature vector.
- Explain whether the result seems reasonable.
- Summarize encoding choices, accuracy, and one surprising result or limitation.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification",
					datasetLink:
						"https://sci2s.ugr.es/keel/dataset.php?cod=56#sub2",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml2_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "K Nearest Neighbors: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "K Nearest Neighbors",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated"
				},
				{
					title: "K Nearest Neighbors supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML2 K-Nearest Neighbors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-01-ml2-k-nearest-neighbors-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-01-ml2-k-nearest-neighbors-supplemental-2/solution"
				},
				{
					title: "K Nearest Neighbors supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML2 K-Nearest Neighbors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-02-ml2-k-nearest-neighbors-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-02-ml2-k-nearest-neighbors-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML3 Naive Bayes",
			curriculum: [
				{
					title: "Naive Bayes Overview",
					content:
						"Naive Bayes is a supervised classification method based on probability rules. It models the probability of each possible label given the input features and chooses the label with the highest probability. The word naive refers to the simplifying assumption that features are conditionally independent given the label, which makes the math easier and still works surprisingly well in many real-world problems."
				},
				{
					title: "Naive Bayes with the Iris Dataset",
					content:
						"The iris flower dataset (sepal length, sepal width, petal length, petal width, species) is a practical Naive Bayes classification example. The labels are the three species setosa, versicolor, and virginica, and the feature vector is [sepal_length, sepal_width, petal_length, petal_width]. Feature order is fixed. The process is: split the data into training and testing sets, use the training data to estimate probabilities for each species, and classify new feature vectors by choosing the label with the highest conditional probability. Accuracy improves when features are informative and when there is enough training data."
				},
				{
					title: "ML3 Project 1: Iris Dataset Classification",
					content: `**Goal:** Build a Naive Bayes classifier for the iris dataset.

**Data preparation:**
- Load the CSV from the provided URL.
- Separate the data into \`X\` feature vectors and \`y\` labels.
- Use \`pandas.drop()\` to remove the species column when constructing \`X\`.
- Print the first few rows of \`X\` and \`y\` with \`head()\` to verify that features and labels still align.

**Model steps:**
1. Split the data into training and testing sets.
2. Choose a suitable Naive Bayes variant, such as \`MultinomialNB\` when the feature assumptions fit.
3. Call \`fit()\` on the training data.
4. Call \`predict()\` on the test data.
5. Compute accuracy with \`accuracy_score()\`.

**Transfer check:** Create a few custom feature vectors, predict their species, and note that these examples may not exist in the original dataset.

**Reflection:** Summarize the dataset, model accuracy, and any classifications that seemed surprising or uncertain.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification",
					datasetLink:
						"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml3_project_1.mp4"
				},
				{
					title: "ML3 Project 2: Email Spam Classification",
					content: `**Goal:** Use Naive Bayes to classify emails as spam or not spam.

**Data cleaning:**
- Load the spam mails dataset in Colab.
- Drop irrelevant columns such as message IDs or duplicate label columns.
- Remove duplicate rows.
- Confirm which column contains the email text and which column contains the spam/ham label.

**Text preprocessing:**
- Remove punctuation.
- Convert text to lowercase.
- Filter out common stopwords such as \`the\`, \`is\`, and other high-frequency function words.
- Use scikit-learn's \`CountVectorizer\` with the custom preprocessing function to produce bag-of-words features.

**Model steps:**
1. Build the label list for spam or ham.
2. Split the data into training and testing sets, such as 80% training and 20% testing.
3. Train a classifier such as \`MultinomialNB\`.
4. Evaluate accuracy on the test set.
5. Inspect a few misclassified examples.

**Reflection checks:**
- Record training time and model accuracy.
- Explain why Naive Bayes is a useful baseline for text classification.
- Name one risk of relying only on accuracy or only on word counts.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Email-Spam-Classification",
					datasetLink:
						"https://www.kaggle.com/venky73/spam-mails-dataset",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml3_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Naive Bayes: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Naive Bayes",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification"
				},
				{
					title: "Naive Bayes supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML3 Naive Bayes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-03-ml3-naive-bayes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-03-ml3-naive-bayes-supplemental-2/solution"
				},
				{
					title: "Naive Bayes supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML3 Naive Bayes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-04-ml3-naive-bayes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-04-ml3-naive-bayes-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML3.5 Decision Trees and Interpretable Models",
			curriculum: [
				{
					title: "Decision Trees as Split-Based Reasoning",
					content:
						"Decision trees are supervised models that repeatedly ask the most informative question available at each split. This connects to interpretable rule-based classification, not just to another library call."
				},
				{
					title: "Entropy, Gini, and Overfitting at an Intuitive Level",
					content:
						"Keep the math light but honest: a good split reduces uncertainty, and a tree that grows without restraint can memorize noise. This is the best place in the course to make bias-variance tradeoffs visible through an inspectable model."
				},
				{
					title: "Tree Models as a Bridge between Rules and Learned Models",
					content:
						"Trees connect early rule-based intuition with later statistical models. A tree is often easier to explain than a neural net, which makes it useful for comparison and for building confidence in model behavior."
				},
				{
					title: "Decision Tree Lab",
					content:
						"Build a decision tree classifier on a familiar dataset such as Iris, Titanic, or customer churn, visualize the main splits, and compare how the model changes when the maximum depth is constrained."
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Diabetes-Diagnosis-With-Neural-Networks"
				}
			],
			supplementalProjects: [
				{
					title: "ML3.5 Decision Trees and Interpretable Models: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Diabetes-Diagnosis-With-Neural-Networks"
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-05-ml3-5-decision-trees-and-interpretable-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-05-ml3-5-decision-trees-and-interpretable-models-supplemental-2/solution"
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-06-ml3-5-decision-trees-and-interpretable-models-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-06-ml3-5-decision-trees-and-interpretable-models-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML4 Neural Networks",
			curriculum: [
				{
					title: "Neurons and Activation Functions",
					content: `A neural network is another technique for classification and regression. The smallest useful unit is a neuron.

**Neuron model:**
- A neuron takes a fixed number of inputs and produces one output.
- Each input has a corresponding weight.
- The neuron also has a bias value.
- The weighted sum is passed through an activation function.

**Details:**
- If a neuron has two inputs, it needs two weights: \`w1\` and \`w2\`.
- The weighted input terms are \`x1*w1\` and \`x2*w2\`.
- The bias is added after the weighted terms: \`x1*w1 + x2*w2 + b\`.
- A sigmoid graph is useful here because the sigmoid function always returns a value between 0 and 1.
- Common activation functions include sigmoid and ReLU.

**Output formula:** \`y = f(x1*w1 + x2*w2 + b)\`

**Worked example:**
1. Let \`x1 = 0\`, \`x2 = 1\`, \`w1 = 1\`, \`w2 = 2\`, and \`b = 1\`.
2. Use sigmoid as the activation function.
3. Compute the weighted sum: \`(0)(1) + (1)(2) + 1 = 3\`.
4. Apply the activation function: \`f(3) = 0.953\` using a sigmoid calculator.

**Checkpoints:** Explain what changes when a weight changes, what changes when the bias changes, and why an activation function is needed at all.`
				},
				{
					title: "ML4 Project 1: Build a Neuron Class",
					content: `**Goal:** Build a small \`Neuron\` class so the neuron formula becomes executable code.

**Class design:**
- Store the weights as instance attributes.
- Store the activation function as an instance attribute.
- Pass the activation function into the constructor so different functions can be tested later.

**Method contract:**
- The \`run()\` method should receive the two inputs, \`x1\` and \`x2\`.
- It should also receive or use the bias value.
- It should compute the weighted sum and return the activated output.

**Support function:** Write a standalone sigmoid function that takes one numeric input and returns the sigmoid output.

**Checkpoints:**
- Create at least one \`Neuron\` instance.
- Run the worked example from the lesson.
- Change one weight and explain why the output changes.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_1.mp4"
				},
				{
					title: "Neural Network Structure",
					content:
						"A neural network is a collection of neurons organized in layers. A typical structure includes an input layer that passes in feature values, one or more hidden layers where neurons compute intermediate representations, and an output layer that produces the final prediction. In a small network with two inputs, a hidden layer of two neurons, and a single output neuron, the inputs go into both hidden neurons; each hidden neuron computes its output; then the output neuron takes those two hidden outputs as inputs, applies its own weights and activation, and produces the final output. A worked numeric example makes the continuous result traceable instead of treating the network as a black box."
				},
				{
					title: "ML4 Project 2: Simple Neural Network Simulation",
					content: `**Goal:** Use the \`Neuron\` class to simulate a tiny neural network.

**Network shape:**
- Two numeric inputs.
- One hidden layer with two neurons.
- One output neuron.
- A bias value used in each neuron calculation.

**Build steps:**
1. Initialize \`x1\`, \`x2\`, and \`b\`.
2. Create two \`Neuron\` objects for the hidden layer, each with its own weights and activation function.
3. Create a third \`Neuron\` object for the output layer.
4. Feed the original inputs into the hidden neurons.
5. Feed the hidden-neuron outputs into the output neuron.
6. Print each intermediate output so the data flow is visible.

**Experiments:**
- Change one hidden-layer weight and compare the final output.
- Change the output activation function and compare the final output.
- Explain why this network is still a simulation, not a trained model.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_2.mp4"
				},
				{
					title: "Neural Networks for Classification",
					content: `Neural networks can be used for classification tasks.

**Feature connection:**
- Each feature becomes an input value in the input layer.
- During training, each feature vector is fed forward through the network.
- The network produces an output that is compared to the true label.

**Training idea:**
- A loss function measures how far the prediction is from the true label.
- Backpropagation computes how much each weight contributed to that error.
- The optimizer updates weights to reduce loss over many examples.
- Training is the search for weights and biases that generalize, not just weights that memorize the training set.

**Classification output:** Neural-network outputs are continuous, so classification needs a mapping from output values to categories. A binary classifier might round a value between 0 and 1, while a multi-class classifier often uses softmax.

**Tooling note:** Keras is a high-level library that handles many implementation details for building and training neural networks.`
				},
				{
					title: "ML4 Project 3: Diabetes Diagnosis with Neural Networks",
					content: `**Goal:** Build a neural network that predicts whether a patient record indicates diabetes.

**Data setup:**
- Download and inspect the Pima Indians Diabetes dataset.
- Identify which columns are features and which column is the label.
- Upload the data to Google Drive and mount Drive in Colab.
- Read the CSV into pandas.
- Separate the feature matrix \`X\` from the label vector \`y\`.

**Model steps:**
1. Split the dataset into training and testing sets.
2. Build a Keras model for binary classification.
3. Use one or two dense hidden layers with ReLU activations as a reasonable starting point.
4. Use a final sigmoid output layer for the binary prediction.
5. Compile the model with an appropriate loss function and optimizer.
6. Train on the training data and evaluate on the test data.

**Experiments:**
- Compare different epoch counts.
- Compare different batch sizes.
- Watch both performance and training time.

**Reflection:** Summarize the dataset, network structure, accuracy, and one prediction pattern that should be interpreted cautiously.`,
					projectLink:
						"https://colab.research.google.com/drive/1CLK1xyg-6rvgj2Z8KtTkt2y4sGYL-dTG",
					solutionLink:
						"https://colab.research.google.com/drive/1tlWrkVmPQC3KPPgfLXAz6l9pk70jkS5b",
					datasetLink:
						"https://www.kaggle.com/uciml/pima-indians-diabetes-database",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_3.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Neural Networks: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Neural Networks",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation"
				},
				{
					title: "Neural Networks supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML4 Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-07-ml4-neural-networks-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-07-ml4-neural-networks-supplemental-2/solution"
				},
				{
					title: "Neural Networks supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML4 Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-08-ml4-neural-networks-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-08-ml4-neural-networks-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML5 Introduction to Regression",
			curriculum: [
				{
					title: "Regression vs. Classification",
					content:
						"Regression and classification both use supervised learning and labeled datasets, but regression predicts a continuous numeric value rather than a discrete category. Predicting house prices is a common example because outputs can take many possible numeric values. In regression, it is acceptable and expected to be off by some margin; the goal is to minimize average error rather than be exactly correct on every example."
				},
				{
					title: "Linear Regression Basics",
					content:
						"Linear regression models the relationship between an input x and an output y using a straight line: y = m x + b. Example data points can be graphed against several potential lines to compare which line better fits the data and why. In practice, libraries compute m (slope) and b (intercept) to minimize error over the whole dataset. Correlation describes the direction and strength of a relationship: a positive correlation means y tends to increase as x increases, a negative correlation means y tends to decrease as x increases, and the magnitude (close to 1 vs. close to 0) indicates strength."
				},
				{
					title: "ML5 Project 1: Simple Linear Regression",
					content: `**Goal:** Fit and interpret a simple linear regression model.

**Graph first:**
- Open the starter code in Colab.
- Plot the given \`x\` and \`y\` data as a scatterplot.
- Decide whether the data appears to follow a roughly straight-line trend.

**Model steps:**
1. Use scikit-learn's \`LinearRegression\` class.
2. Fit the model to the data.
3. Print the slope and y-intercept.
4. Print the \`R^2\` score.
5. Use the model to predict \`y\` for a chosen \`x\`.
6. Plot the line of best fit on top of the scatterplot.

**Interpretation checks:**
- Describe whether the relationship is positive or negative.
- Use both the graph and \`R^2\` to decide whether the relationship looks strong, weak, or moderate.
- Try predictions for \`x\` values outside the original dataset and discuss whether those extrapolations seem reasonable.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Linear-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_1.mp4"
				},
				{
					title: "Polynomial Regression",
					content:
						"Not all relationships are linear; some are better modeled with curves. Data that follows a U-shaped or curved pattern can be modeled with polynomial regression, which fits equations like y = a x^2 + b x + c (or higher-degree polynomials) to the data. Polynomial regression adds terms with higher powers of x to capture curvature, and scikit-learn can generate polynomial features and fit these models similarly to linear regression."
				},
				{
					title: "ML5 Project 2: Simple Polynomial Regression",
					content: `**Goal:** Compare linear regression with polynomial regression on curved data.

**Initial inspection:**
- Plot the given \`x\` and \`y\` data.
- Decide whether a straight line looks appropriate or whether the trend appears curved.

**Linear baseline:**
- Fit a linear regression model.
- Plot the line over the data.
- Examine residuals and average error.

**Polynomial model:**
1. Use scikit-learn's \`PolynomialFeatures\` with \`LinearRegression\`.
2. Start with a quadratic model unless the data clearly needs another degree.
3. Print the learned coefficients and intercept.
4. Plot the curve on top of the data.

**Comparison checks:**
- Compare typical error for the linear and polynomial models.
- Predict the same chosen \`x\` value with both models.
- Explain which model captures the trend better and whether the extra complexity is justified.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_2.mp4"
				},
				{
					title: "ML5 Project 3: Predicting Life Expectancy",
					content: `**Goal:** Use WHO life expectancy data to build and compare regression models.

**Data setup:**
- Upload the dataset to Google Drive.
- Create a Colab notebook and mount Drive.
- Read the CSV into pandas.
- Identify input features, such as health, economic, and demographic variables.
- Use life expectancy as the target output.

**Model comparison:**
1. Split the data into training and testing sets.
2. Build a linear regression model.
3. Measure test performance.
4. Build a polynomial or feature-expanded regression model.
5. Evaluate the second model on the same test split.

**Reflection checks:**
- Compare which model fits better.
- Decide whether the added complexity is justified.
- Summarize which factors seem most correlated with life expectancy.
- Name one reason correlation in this dataset does not automatically prove causation.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Predicting-Life-Expectancy",
					datasetLink:
						"https://www.kaggle.com/kumarajarshi/life-expectancy-who",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_3.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Introduction to Regression: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Introduction to Regression",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Linear-Regression-Updated"
				},
				{
					title: "Introduction to Regression supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML5 Introduction to Regression",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-09-ml5-introduction-to-regression-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-09-ml5-introduction-to-regression-supplemental-2/solution"
				},
				{
					title: "Introduction to Regression supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML5 Introduction to Regression",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-10-ml5-introduction-to-regression-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-10-ml5-introduction-to-regression-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML6 Regression with Neural Networks",
			curriculum: [
				{
					title: "Neural Networks for Regression",
					content:
						"Neural networks can also be used for regression, not just classification. For nonlinear or complex relationships, neural networks can approximate a curved function that fits the data more flexibly than polynomial regression. The tradeoffs matter: networks usually require more data, take longer to train, and are harder to interpret, so they are best used when simpler models are not accurate enough."
				},
				{
					title: "Evaluating Regression Models",
					content:
						"Mean squared error (MSE) and mean absolute error (MAE) are standard metrics for regression. Both measure average prediction error: MAE averages absolute differences, while MSE averages squared differences, which penalizes large errors more heavily. A good regression model aims to minimize these values on both training and test data. Overfitting happens when a model fits the training data extremely well but performs poorly on new data; it has memorized rather than generalized. Train-test splits, such as 80% training and 20% testing, help check generalization."
				},
				{
					title: "ML6 Project 1: Predicting House Prices with Neural Networks",
					content: `**Goal:** Build a neural-network regression model for housing-price prediction.

**Data setup:**
- Create a new Colab notebook.
- Load the Boston housing dataset from Keras.
- Split the data into training and testing sets.
- Normalize input features with \`StandardScaler\` or a similar tool so feature scales are comparable.

**Model steps:**
1. Design a dense neural network for regression.
2. Use ReLU or a similar activation in hidden layers.
3. Use a linear output layer for the predicted numeric price.
4. Compile with a regression loss such as MSE and a suitable optimizer.
5. Train on the training data.

**Evaluation:**
- Record mean absolute error over epochs.
- Plot MAE versus epoch.
- Evaluate on the test set and print mean squared error.
- Plot predicted versus actual house prices with a \`y = x\` reference line.

**Reflection:** Explain how normalization, network architecture, and training epochs influenced accuracy and overfitting.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML6-Predicting-House-Prices",
					datasetLink:
						"https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml6_project_1.mp4"
				},
				{
					title: "Regression with Neural Networks: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Regression with Neural Networks",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Regression with Neural Networks: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Regression with Neural Networks",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML6-Predicting-House-Prices"
				},
				{
					title: "Regression with Neural Networks supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML6 Regression with Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-11-ml6-regression-with-neural-networks-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-11-ml6-regression-with-neural-networks-supplemental-2/solution"
				},
				{
					title: "Regression with Neural Networks supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML6 Regression with Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-12-ml6-regression-with-neural-networks-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-12-ml6-regression-with-neural-networks-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML7 Image Classifier",
			curriculum: [
				{
					title: "Image Data and Classification",
					content:
						"Images are arrays of pixel values, so they can be used as input to machine learning models just like numerical datasets. Each pixel can store information such as brightness or RGB color values. Image classification assigns a label to each image, for example rainy, sunny, cloudy, or sunrise. Modern image classifiers are typically neural networks that learn from many labeled examples how patterns in pixel data correspond to categories."
				},
				{
					title: "ML7 Project 1: Weather Image Classifier",
					content: `**Goal:** Build a neural network that classifies weather images as rainy, sunny, cloudy, or sunrise.

**Data setup:**
- Upload the dataset to a Google Drive folder.
- Mount Drive in Colab.
- Use Keras image-loading tools to define training, validation, and test generators.
- Handle image rescaling, batching, and directory loading explicitly.

**Model choices:**
- Use a simple convolutional neural network when the goal is image-specific learning.
- A dense network after flattening can be used as a comparison, but it should be discussed as a weaker baseline for image structure.
- Compile with a suitable multi-class classification loss.

**Evaluation steps:**
1. Train on the training set while monitoring validation accuracy.
2. Evaluate on the test set.
3. Load individual example images.
4. Run \`model.predict()\` on those images.
5. Interpret the largest predicted probability as the predicted class.

**Reflection checks:**
- Compare predictions with true labels.
- Discuss both success and failure cases.
- Summarize the dataset, model architecture, test accuracy, and any images where the model struggled.`,
					projectLink:
						"https://colab.research.google.com/drive/12HpOOjmQgf5sLmrTgknSFX24aSln6rT6?usp=sharing",
					solutionLink:
						"https://colab.research.google.com/drive/1YvuhSoBOXsV7Iip3Xu5AGgQC4LmJWbnL?usp=sharing",
					datasetLink:
						"https://data.mendeley.com/datasets/4drtyfjtfy/",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml7_project_1.mp4"
				},
				{
					title: "Further Reading on ML Models",
					content:
						"Provide optional reading to deepen understanding of advanced concepts used in modern ML: loss functions (how models measure their error during training and why different problems use different loss definitions), convolutional neural networks (CNNs) for image processing and why convolutions help detect patterns like edges and textures, and the idea of a `model` as a trained artifact that can be deployed and reused. Skim articles on loss functions, convolutional networks, and machine learning models from sources such as Google's ML Crash Course, IBM, Microsoft, and Databricks, then connect those ideas back to the weather image classifier built in the course."
				},
				{
					title: "Image Classifier: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Image Classifier",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Image Classifier: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Image Classifier",
						section: "extension"
					}),
					projectLink:
						"https://colab.research.google.com/drive/12HpOOjmQgf5sLmrTgknSFX24aSln6rT6?usp=sharing",
					solutionLink:
						"https://colab.research.google.com/drive/1YvuhSoBOXsV7Iip3Xu5AGgQC4LmJWbnL?usp=sharing"
				},
				{
					title: "Image Classifier supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML7 Image Classifier",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-13-ml7-image-classifier-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-13-ml7-image-classifier-supplemental-2/solution"
				},
				{
					title: "Image Classifier supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML7 Image Classifier",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-14-ml7-image-classifier-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-14-ml7-image-classifier-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
			curriculum: [
				{
					title: "Classification Metrics beyond Accuracy",
					content:
						"Accuracy, precision, recall, F1, and the confusion matrix are different lenses on model quality. Key idea: why a single percentage can hide the wrong failure mode, especially on imbalanced data."
				},
				{
					title: "Regression Metrics and Residual Thinking",
					content:
						"Make residuals, MAE, MSE, and `R^2` part of the recurring regression workflow. Skill target: Explain what a bad prediction looks like on the graph and in the summary metrics."
				},
				{
					title: "Dataset Choice by Difficulty and Model Fit",
					content:
						"Build a small internal dataset bank by difficulty: tiny synthetic demos for concept explanation, medium structured datasets for classification and regression, and broader capstone candidates for comparison projects."
				},
				{
					title: "Compare at Least Two Models per Serious Project",
					content:
						"Include a short comparison note whenever two plausible models can be tried on the same problem. This is the habit that turns the course from a sequence of demos into real machine-learning thinking."
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression"
				}
			],
			supplementalProjects: [
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression"
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-15-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-15-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-2/solution"
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-16-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-16-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML8 Master Project",
			curriculum: [
				{
					title: "Master Project Planning",
					content: `The Master Project is a capstone built around a real dataset and a substantial machine-learning problem.

**Allowed problem types:**
- Classification, such as fake news detection, credit card fraud detection, or Titanic survival prediction.
- Regression, such as loan amount prediction, Bitcoin price prediction, stock price prediction, or medical insurance cost prediction.
- A comparison project that uses more than one course algorithm on the same dataset.

**Possible algorithms:** k-means, KNN, Naive Bayes, neural networks, regression, and related evaluation tools.

**Scoping checks:**
- The dataset is accessible and understandable.
- The target variable is clearly defined.
- The problem fits personal interests well enough to sustain debugging and analysis.
- The result can be evaluated with an appropriate metric.`
				},
				{
					title: "Master Project Implementation",
					content: `**Goal:** Turn the scoped capstone idea into a two-week build plan.

**Planning decisions:**
- Identify input features.
- Identify the target label or regression output.
- Choose evaluation metrics.
- Decide which two algorithms to compare.
- For classification, a useful comparison might be Naive Bayes versus a neural network.
- For regression, a useful comparison might be linear or polynomial regression versus a neural network.

**Notebook workflow:**
1. Create a new Colab notebook.
2. Upload or connect to the dataset.
3. Clean the data.
4. Engineer or select features.
5. Split the data into training and testing sets.
6. Train the first model.
7. Train the comparison model.
8. Evaluate both models with the same metric.
9. Document the process with explanatory text cells.

**Checkpoint cadence:** Plan for substantial independent implementation and debugging, with periodic review checkpoints that focus on evidence, not just whether the notebook runs.`
				},
				{
					title: "ML8 Project 1: Master Project Workspace",
					content:
						"Use the canonical capstone workspace in the repo as the starting structure for the final project. Compare at least two models, justify the evaluation metric, and leave the notebook organized enough to share as a portfolio artifact.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML8-Master-Project"
				},
				{
					title: "Master Project Examples",
					content:
						"Example notebooks for similar projects, such as a Titanic survival predictor or a medical insurance cost predictor, provide useful structure: data exploration, feature selection, model building, evaluation, and reflection on results. These examples are inspiration, not templates to copy. Adapt techniques or visualizations only when they fit the chosen dataset and problem."
				},
				{
					title: "Master Project Presentation",
					content:
						"When the project reaches a solid, working state, write a concise project summary explaining which concepts from the course were used (clustering, classification, regression, neural networks, train–test split, etc.) and what was learned about the data."
				},
				{
					title: "Course Recap & Next Steps",
					content: `**Recap targets:**
- Unsupervised learning and clustering.
- Supervised learning and classification.
- KNN, Naive Bayes, neural networks, regression, overfitting, evaluation, and image classification.
- The difference between a working notebook and a justified modeling result.

**Master Project connection:**
- Identify which techniques were used.
- State what evidence supports the results.
- Name the strongest limitation that remains.
- Explain what would be improved with more time, data, or compute.

**Next-step options:** Strong follow-on paths include USACO training for advanced competitive programming, AP Computer Science, or language-specific Level 1 courses in Java, JavaScript, or C++.

**Portfolio framing:** Treat the Master Project as evidence of a complete data/modeling workflow, including data cleaning, model selection, evaluation, comparison, and cautious interpretation.`
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML8-Master-Project"
				},
				{
					title: "Master Project supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML8 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-17-ml8-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-17-ml8-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML8 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-18-ml8-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-18-ml8-master-project-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation Starter Build: Implementation Lab",
			curriculum: [
				{
					title: "Customer Segmentation Starter Build: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation Starter Build: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation Starter Build: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation"
				},
				{
					title: "Customer Segmentation Starter Build: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation Starter Build: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation"
				},
				{
					title: "Customer Segmentation Starter Build supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-19-applied-studio-12-customer-segmentation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-19-applied-studio-12-customer-segmentation-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation Starter Build supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-20-applied-studio-12-customer-segmentation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-20-applied-studio-12-customer-segmentation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation Interview: Implementation Lab",
			curriculum: [
				{
					title: "Customer Segmentation Interview: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation Interview: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation Interview: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Interview-Starter"
				},
				{
					title: "Customer Segmentation Interview: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation Interview: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Interview-Starter"
				},
				{
					title: "Customer Segmentation Interview supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-21-applied-studio-13-customer-segmentation-interview-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-21-applied-studio-13-customer-segmentation-interview-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation Interview supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-22-applied-studio-13-customer-segmentation-interview-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-22-applied-studio-13-customer-segmentation-interview-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation: Implementation Lab",
			curriculum: [
				{
					title: "Customer Segmentation: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter"
				},
				{
					title: "Customer Segmentation: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter"
				},
				{
					title: "Customer Segmentation supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-23-applied-studio-14-customer-segmentation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-23-applied-studio-14-customer-segmentation-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-24-applied-studio-14-customer-segmentation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-24-applied-studio-14-customer-segmentation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Disney Movie Clustering Starter Build: Implementation Lab",
			curriculum: [
				{
					title: "Disney Movie Clustering Starter Build: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Disney Movie Clustering Starter Build: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Disney Movie Clustering Starter Build: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering"
				},
				{
					title: "Disney Movie Clustering Starter Build: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Disney Movie Clustering Starter Build: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering"
				},
				{
					title: "Disney Movie Clustering Starter Build supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-25-applied-studio-15-disney-movie-clustering-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-25-applied-studio-15-disney-movie-clustering-supplemental-2/solution"
				},
				{
					title: "Disney Movie Clustering Starter Build supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-26-applied-studio-15-disney-movie-clustering-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-26-applied-studio-15-disney-movie-clustering-supplemental-3/solution"
				}
			]
		},
		{
			title: "Disney Movie Clustering: Implementation Lab",
			curriculum: [
				{
					title: "Disney Movie Clustering: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Disney Movie Clustering: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Disney Movie Clustering: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter"
				},
				{
					title: "Disney Movie Clustering: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Disney Movie Clustering: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter"
				},
				{
					title: "Disney Movie Clustering supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-27-applied-studio-16-disney-movie-clustering-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-27-applied-studio-16-disney-movie-clustering-supplemental-2/solution"
				},
				{
					title: "Disney Movie Clustering supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-28-applied-studio-16-disney-movie-clustering-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-28-applied-studio-16-disney-movie-clustering-supplemental-3/solution"
				}
			]
		},
		{
			title: "KNN Car Classification: Implementation Lab",
			curriculum: [
				{
					title: "KNN Car Classification: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "KNN Car Classification: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "KNN Car Classification: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Updated"
				},
				{
					title: "KNN Car Classification: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "KNN Car Classification: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Updated"
				},
				{
					title: "KNN Car Classification supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-29-applied-studio-17-knn-car-classification-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-29-applied-studio-17-knn-car-classification-supplemental-2/solution"
				},
				{
					title: "KNN Car Classification supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"KNN Car Classification: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-30-applied-studio-17-knn-car-classification-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-30-applied-studio-17-knn-car-classification-supplemental-3/solution"
				}
			]
		}
	]
};
