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
						"Standardize the course around `Google Colab` for the main workflow, with `VS Code` or `PyCharm` as the local follow-on environment when students are ready to move beyond notebooks. Set up Python, pandas, NumPy, matplotlib, seaborn, scikit-learn, and notebook support before the first real model so environment issues do not derail the conceptual lessons."
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
					content:
						"Using Google Colab and the Kaggle customer segmentation dataset, build k-means clustering from scratch to group customers by annual income and spending score. First, create a dedicated folder in Google Drive for the ML projects and upload the dataset there. In Colab, mount Google Drive using the Files sidebar, then read the CSV with pandas (for example, data = pd.read_csv('/content/drive/MyDrive/MachineLearning/Mall_Customers.csv')). Examine the columns and decide which to use for clustering (annual income and spending score). Create a scatterplot of income vs. spending score before clustering and ask how many clusters are visible by eye. Initialize k (e.g., k = 5), construct a list or array of data points, and choose k random points as initial centroids. Set up data structures for centroids, old centroids, and an array holding each customer's cluster index. Implement a loop that repeats until centroids stop changing: compute distances from each point to each centroid using Euclidean distance, assign each point to the nearest centroid, copy current centroids to old centroids using deepcopy, and recompute each centroid by averaging all points in that cluster. After convergence, call draw_clustered_graph() from the starter code to plot the final clusters. Run the algorithm multiple times and observe that clusters may change slightly due to random initialization. Experiment with different k values and compare the resulting cluster structures. Wrap up with a short written or spoken summary explaining the dataset, the goal of clustering, the findings, and any surprising patterns noticed.",
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
					content:
						"Use k-means via scikit-learn to cluster Disney movies by year and inflation-adjusted revenue. In Colab, read in the Disney movie dataset from Kaggle, then extract the release year and inflation columns. Because the release date is stored as a string, build a new list or column containing just the year as an integer. Create a scatterplot of year vs. inflation-based revenue before clustering and discuss how hard it is to visually see separate groups. Set k to a few different values and use scikit-learn's k-means implementation: build a 2D feature matrix, call fit_predict() to get cluster assignments, and access cluster_centers_ for centroids. Call draw_clustered_graph() to plot the clustered scatterplot. Experiment with multiple k values and compare how cluster shapes and boundaries change. End with a short written or spoken explanation of what the dataset contains, what was investigated, and anything surprising in how the movies grouped by time and inflation.",
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
					content:
						"Using the provided starter code and the iris flower dataset, implement or apply k-means clustering to group flowers by petal length and petal width. Load the iris.csv file from the given URL into your notebook. Either use scikit-learn's k-means or write the algorithm from scratch (as in the customer segmentation project). Plot the raw (unclustered) data first, then plot the clustered data with different colors for each cluster. Compare how many clusters you see visually versus the k you choose in code and discuss how the clusters relate to the three iris species.",
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
					content:
						"Using the previous customer segmentation dataset and your clustering results, build a KNN classifier that predicts a customer's segment from annual income and spending score. In Colab, start from your saved segmentation work or reload the dataset and re-create the features and labels (cluster assignments). Decide on a value of k (for example, 3 or 5) and build feature vectors [income, spending score] for each customer. Split your data into training and testing sets. Implement KNN either manually (computing distances, finding nearest neighbors, and doing majority vote) or via scikit-learn's KNeighborsClassifier. Use the test set to compute accuracy and compare predictions to the original cluster labels. Create at least one new ‘fake' customer feature vector and predict its segment, then check visually against your cluster plot. Write a short explanation of how k was chosen, how well the classifier performed, and whether the classification of the new customer makes sense.",
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
					content:
						"Build a KNN classifier to predict car ‘acceptability' using the classic car evaluation dataset. In Colab, download the dataset and inspect its documentation to identify the target label (acceptability) and the features (buying, maintenance, doors, persons, luggage boot, safety). Notice that many features are categorical strings rather than numbers; design dictionaries mapping each category value to a numeric code and use pandas.replace() to encode them. Construct feature vectors from the encoded columns and labels from the acceptability column, whose possible values are {unacc, acc, good, vgood}. Split the data into training and testing sets with train_test_split(). Use scikit-learn's KNeighborsClassifier to train the model and compute accuracy on the test set. Create your own feature vector describing a hypothetical car and classify it; discuss whether the result seems reasonable. Finish by summarizing the dataset, your feature encoding choices, model accuracy, and any surprising results.",
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
					content:
						"In Colab, build a Naive Bayes classifier for the iris dataset. Load the CSV from the provided URL, then separate it into X (feature vectors) and y (labels). Use pandas.drop() to remove the species column when constructing X. Print the first few rows of X and y with head() to verify that the features and labels align (X[i] corresponds to y[i]). Split the data into training and testing sets. Use scikit-learn's MultinomialNB or another suitable Naive Bayes variant, call fit() on the training data, then call predict() on the test data and compute accuracy with accuracy_score(). Finally, create a few custom feature vectors and have the classifier predict their species, noting that these examples may not exist in the original dataset. Summarize the dataset, model accuracy, and any surprising classifications.",
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
					content:
						"Use Naive Bayes to classify emails as spam or not spam with a realistic text dataset. In Colab, load the spam mails dataset from Kaggle and drop irrelevant columns such as messageid and label columns that are not needed for modeling. Remove duplicate rows. Write a preprocessing function that removes punctuation, lowercases the text, and filters out common stopwords such as `the`, `is`, and other high-frequency function words to avoid over-emphasizing them. Use scikit-learn's CountVectorizer with your custom preprocessing function to turn each email into a bag-of-words feature vector. Build a list of labels corresponding to whether each email is spam or ham. Split the data into training and testing sets, for example 80% training and 20% testing, train a Naive Bayes classifier such as MultinomialNB, and evaluate its accuracy on the test set. Record training time, misclassifications, why Naive Bayes is a good baseline for text classification, the dataset content, the target being detected, the model's accuracy, and any surprising results.",
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
					content:
						"Another technique for classification is a neural network.\n\nA neural network is built out of neurons. A neuron is a node in a graph that takes in a specific number of inputs then produces a single output by doing some math on the inputs.\n\nA neuron contains some number of predetermined weights. The number of weights in a neuron is equivalent to the number of inputs to that neuron. For instance, the neuron above would have two weights in it (`w1` and `w2`).\n\nOnce the neuron takes an input, it calculates the output first multiplying each input by its corresponding weight: `x1*w1` and `x2*w2.`\n\nThen, the neuron adds together each of these products along with a bias value called *b*: `x1*w1 + x2*w2 + b`.\n\nFinally, the neuron passes the sum through a special function called an activation function f to turn the output into a predictable form. A sigmoid graph is useful here because the sigmoid function always returns a value between 0 and 1. Some common activation functions are sigmoid and ReLU.\n\nThe output of the activation function is the output of the neuron: `y = f(x1*w1 + x2*w2 + b)`.\n\nExample input to the neuron:\n\tlet `x1 = 0`, `x2 = 1`, `w1 = 1`, `w2 = 2`, `b = 1`, `activation function = sigmoid`\n\t`x1*w1 + x2*w2 + b = (0)(1) + (1)(2) + 1 = 3`\n\t`f(3) = 0.953` (using a sigmoid calculator online)"
				},
				{
					title: "ML4 Project 1: Build a Neuron Class",
					content:
						"What instance attributes should the Neuron class have? The `Neuron` class needs the weights (`w1` and `w2`) and the activation function (You may need to pass in a function as an argument).\nWhat parameters does the `run()` method need? It needs the two inputs (`x1` and `x2`) into the neuron and the bias.\nOutside the class, write a sigmoid function that takes in a single input and returns the output of the sigmoid function.\nCreate an instance of `Neuron` and pass an input into it.",
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
					content:
						"Using the Neuron class from the previous project, simulate a simple neural network with two inputs, one hidden layer with two neurons, and one output neuron. Initialize input values x1, x2, and a bias b. Create two Neuron objects to represent the hidden layer, each with its own weights and activation function, for example sigmoid. Create a third Neuron object to represent the output layer, possibly using ReLU as the activation. Feed the input (x1, x2, b) into each hidden neuron, collect their outputs, then feed these outputs and the bias into the output neuron. Print intermediate results from each neuron so the flow of data through the network is easy to follow. Compare how changing weights or activation functions changes the final output.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_2.mp4"
				},
				{
					title: "Neural Networks for Classification",
					content:
						"Neural networks can be used for classification tasks. Connect back to feature vectors: each feature becomes an input node in the input layer. During training, each feature vector is fed forward through the network to produce an output, which is compared to the true label using a loss function that measures how far off the prediction is. Backpropagation computes gradients of the loss with respect to the network's weights and updates those weights to reduce loss over time. Training is essentially the process of finding weights and biases that minimize loss over all training examples. Outputs of a network for classification are continuous, so classification needs a mapping from the output to discrete categories, such as rounding a single output between 0 and 1 or using softmax for multi-class problems. Keras is a high-level library that handles many implementation details for building and training neural networks."
				},
				{
					title: "ML4 Project 3: Diabetes Diagnosis with Neural Networks",
					content:
						"In Colab, use keras to build a neural network that predicts whether patients in the Pima Indians Diabetes dataset have diabetes. Download and inspect the dataset from Kaggle, identifying which columns will serve as features and which column is the label. Upload the data to Google Drive and mount it in Colab. Read the CSV into pandas, separate it into a feature matrix X and a labels vector y, and then split into training and testing sets. Use keras (via TensorFlow) to build a suitable network architecture for binary classification (for example, one or two dense hidden layers with ReLU activations and a final output layer with sigmoid). Compile the model with an appropriate loss function and optimizer, train it on the training data, and evaluate accuracy on the test set. Experiment with different numbers of epochs and batch sizes, observing how performance and training time change. Summarize the dataset contents, your network structure, model accuracy, and any surprising patterns in the predictions.",
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
					content:
						"In Colab, open the starter code for simple linear regression. Plot the given x and y data as a scatterplot and decide whether the data appears to follow a roughly straight-line trend. Use scikit-learn's LinearRegression class to fit a model to the data. Extract and print the slope, y-intercept, correlation (R^2 score), and use the model to predict y for a given x. Plot the line of best fit on top of the scatterplot to visually confirm that it matches the trend. Describe whether the relationship is positive or negative and whether it appears strong, weak, or moderate based on both the graph and R^2 value. Try predictions for x values not in the original dataset and discuss whether those predictions seem reasonable.",
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
					content:
						"Using the starter code in Colab, plot the given x and y data and discuss whether a straight line looks appropriate or whether the shape appears curved. First build a linear regression model and plot its line; evaluate how well it fits by examining residuals and the average error. Then build a polynomial regression model (for example, quadratic) using scikit-learn's PolynomialFeatures plus LinearRegression. Print the learned coefficients and intercept, and plot the resulting curve along with the data. Compare the fit quality and typical error of the linear versus polynomial models. For a chosen x value, compute predictions from both models and compare them to the actual y; discuss which model appears to capture the trend better.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_2.mp4"
				},
				{
					title: "ML5 Project 3: Predicting Life Expectancy",
					content:
						"In Colab, use WHO life expectancy data to build and compare regression models. Upload the dataset to Google Drive, create a Colab notebook, and mount Drive. Read the CSV into pandas, identify multiple features (such as health, economic, and demographic variables) as inputs, and life expectancy as the target output. Split data into training and testing sets. Build a linear regression model using scikit-learn and measure its performance with the model's score on the test data. Then build a polynomial regression model (for example by expanding some features or using polynomial transformations) and evaluate its score as well. Compare which model fits the data better and discuss whether extra complexity is justified. Summarize which factors seem most correlated with life expectancy and which model gave more reliable predictions.",
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
					content:
						"In Colab, build a neural network regression model for the Boston housing dataset using keras. Create a new notebook, then load the dataset from keras and split it into training and testing sets. Use StandardScaler or a similar tool to normalize input features (so they have similar scales), which helps the network train more effectively. Design a neural network with one or more dense hidden layers suitable for regression, using an appropriate activation (such as ReLU) in hidden layers and a linear activation in the output layer. Compile the model with a loss function appropriate for regression (such as MSE) and a suitable optimizer. Train the model on the training data and record the mean absolute error over epochs; plot MAE vs. epoch to show how error decreases as training progresses. Evaluate the model on the test set, printing mean squared error to gauge performance. Finally, plot predicted vs. actual house prices for the test set on a scatterplot with the line y = x for reference; points close to this line indicate accurate predictions. Summarize how normalization, network architecture, and training epochs influence accuracy and overfitting.",
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
					content:
						"In Colab, build a neural network to classify weather images (rainy, sunny, cloudy, sunrise). Upload the dataset to a Google Drive folder and mount Drive in Colab. Use Keras's ImageDataGenerator to define training, validation, and test image generators, handling image rescaling, batching, and directory loading. Design a neural network appropriate for image data—either a simple convolutional neural network (CNN) or a dense network after flattening the images. Compile the model with a suitable loss function for multi-class classification and train it on the training set while monitoring validation accuracy. Evaluate the trained model on the test set to estimate real-world performance. Then load individual images from an example set, run model.predict() on them, and interpret the outputs by taking the index of the largest predicted probability to determine the predicted class. Compare predictions with true labels and discuss success and failure cases. Summarize the dataset, model architecture, test accuracy, and any images where the model struggled.",
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
						hasReference: false
					}),
					projectLink:
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
					content:
						"The Master Project is a capstone built around a real dataset and a substantial machine learning problem. The project can be classification or regression and can use any combination of algorithms learned throughout the course: k-means, KNN, Naive Bayes, neural networks, regression, and related tools. Suggested directions include classification tasks such as fake news detection, credit card fraud detection, and Titanic survival prediction, or regression tasks such as loan amount prediction, Bitcoin price prediction, stock price prediction, and medical insurance cost. Pick one idea that genuinely fits personal interests and clearly define the problem to solve."
				},
				{
					title: "Master Project Implementation",
					content:
						"Once the topic and dataset are chosen, scope the project. Identify the input features, target labels or regression outputs, and evaluation metrics. Decide which two algorithms to compare: for classification, perhaps Naive Bayes vs. a neural network; for regression, maybe linear/polynomial regression vs. a neural network. Set up a new Colab notebook, upload or connect to the dataset, and perform standard steps: data cleaning, feature engineering, train–test split, model training, evaluation, and comparison. Use clear code cells and explanatory text cells to document the process. Aim for a project that spans about two weeks, with substantial implementation and debugging done independently with periodic review checkpoints."
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
					content:
						"Wrap up the course by recapping the major ideas learned: unsupervised learning and clustering, supervised learning and classification, KNN, Naive Bayes, neural networks, regression, overfitting and evaluation, and image classification. Connect those ideas to the Master Project by identifying which techniques were used, what evidence supports the results, and what limitations remain. Recommended next courses can be chosen based on interests and confidence; strong options include USACO training for advanced competitive programming, AP Computer Science, or language-specific Level 1 courses in Java, JavaScript, or C++. Treat the Master Project as a portfolio piece that demonstrates a complete data/modeling workflow."
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
						hasReference: false
					}),
					projectLink:
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
						hasReference: false
					}),
					projectLink:
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
						hasReference: false
					}),
					projectLink:
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
						hasReference: false
					}),
					projectLink:
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
