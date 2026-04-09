import type { RawCourse } from "./types";

export const machineLearningCourse: RawCourse = {
	name: "Machine Learning",
	modules: [
		{
			title: "ML1 K-Means Clustering",
			curriculum: [
				{
					title: "Introduction to Machine Learning",
					content:
						"Explain that AI is about building intelligent systems, and machine learning (ML) is the subset where systems learn patterns from data. Give everyday examples such as spam filters learning what emails to block and Netflix learning what shows to recommend based on viewing history. Briefly introduce the four main ML types: reinforcement learning (learning by reward and punishment), unsupervised learning (finding patterns without labels), supervised learning (learning from labeled examples), and semi-supervised learning (mix of labeled and unlabeled data). Emphasize that this course will focus mainly on unsupervised and supervised learning."
				},
				{
					title: "Unsupervised Learning & Clustering",
					content:
						"Introduce unsupervised learning as taking a dataset without labels and trying to find patterns or groupings in it. Use customer segmentation as a motivating example: a store owner can group customers by characteristics like age, income, or spending behavior to better target marketing. Define clustering as the process of finding distinct groups (clusters) of similar data points. Work through a simple 2D example with points A(1,1), B(2,1), C(3,3), and D(4,3). Plot them and visually identify that {A,B} form one cluster and {C,D} form another. Discuss why algorithms are needed when there are hundreds or thousands of points instead of just four."
				},
				{
					title: "K-Means Clustering Algorithm",
					content:
						"Introduce k-means clustering as a popular algorithm that partitions data into k clusters. Define a centroid as the mean of all points in a cluster, thought of as the cluster\'s center. Explain that each point is assigned to the cluster whose centroid it is closest to, usually using Euclidean distance sqrt((y2 - y1)^2 + (x2 - x1)^2). Use the A, B, C, D example to walk through k-means for k = 2: (1) choose k, (2) pick initial centroids (e.g., A and B), (3) assign each point to the nearest centroid, (4) recompute centroids by averaging point coordinates in each cluster, and (5) repeat until centroids stop changing. Show one or two iterations, computing distances and new centroids, and highlight that results can depend on the initial random centroids."
				},
				{
					title: "Google Colab Setup",
					content:
						"Introduce Google Colab as the main IDE for this course and note that it requires a Google account. Log in at https://colab.research.google.com, bookmark it, open the `Welcome to Colaboratory` notebook, and skim the core features together. Create a new notebook (File → New notebook), point out the left sidebar tools like Table of Contents, Find and Replace, and Files, then add code and text cells, run code, and reorder cells. Finish by creating a variable, printing it, printing a name in a second cell, and adding a short descriptive text cell before using Runtime → Restart and run all."
				},
				{
					title: "ML1 Project 1: Customer Segmentation",
					content:
						"Using Google Colab and the Kaggle customer segmentation dataset, build k-means clustering from scratch to group customers by annual income and spending score. First, create a dedicated folder in Google Drive for the ML projects and upload the dataset there. In Colab, mount Google Drive using the Files sidebar, then read the CSV with pandas (for example, data = pd.read_csv('/content/drive/MyDrive/MachineLearning/Mall_Customers.csv')). Examine the columns and decide which to use for clustering (annual income and spending score). Create a scatterplot of income vs. spending score before clustering and ask how many clusters are visible by eye. Initialize k (e.g., k = 5), construct a list or array of data points, and choose k random points as initial centroids. Set up data structures for centroids, old centroids, and an array holding each customer\'s cluster index. Implement a loop that repeats until centroids stop changing: compute distances from each point to each centroid using Euclidean distance, assign each point to the nearest centroid, copy current centroids to old centroids using deepcopy, and recompute each centroid by averaging all points in that cluster. After convergence, call draw_clustered_graph() from the starter code to plot the final clusters. Run the algorithm multiple times and observe that clusters may change slightly due to random initialization. Experiment with different k values and compare the resulting cluster structures. Wrap up with a short written or spoken summary explaining the dataset, the goal of clustering, the findings, and any surprising patterns noticed.",
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
						"Use k-means via scikit-learn to cluster Disney movies by year and inflation-adjusted revenue. In Colab, read in the Disney movie dataset from Kaggle, then extract the release year and inflation columns. Because the release date is stored as a string, build a new list or column containing just the year as an integer. Create a scatterplot of year vs. inflation-based revenue before clustering and discuss how hard it is to visually see separate groups. Set k to a few different values and use scikit-learn\'s k-means implementation: build a 2D feature matrix, call fit_predict() to get cluster assignments, and access cluster_centers_ for centroids. Call draw_clustered_graph() to plot the clustered scatterplot. Experiment with multiple k values and compare how cluster shapes and boundaries change. End with a short written or spoken explanation of what the dataset contains, what was investigated, and anything surprising in how the movies grouped by time and inflation.",
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
						"Using the provided starter code and the iris flower dataset, implement or apply k-means clustering to group flowers by petal length and petal width. Load the iris.csv file from the given URL into your notebook. Either use scikit-learn\'s k-means or write the algorithm from scratch (as in the customer segmentation project). Plot the raw (unclustered) data first, then plot the clustered data with different colors for each cluster. Compare how many clusters you see visually versus the k you choose in code and discuss how the clusters relate to the three iris species.",
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
						"Define supervised learning as training on a dataset where both inputs and outputs (labels) are known. Explain that the algorithm learns a mapping from inputs to outputs, then uses that mapping to predict labels on new inputs where the output is unknown. Emphasize that the core steps are building feature vectors from the raw data, associating each vector with a label, training on these input–output pairs, and then evaluating the model on new data."
				},
				{
					title: "Classification Basics",
					content:
						"Introduce classification as a supervised learning task where the output is a discrete category. Use spam vs. non-spam email as a simple example. Connect classification back to the customer segmentation project: the clusters discovered with k-means can be treated as categories or labels (e.g., cluster 0, cluster 1, cluster 2, etc.). Explain that once you know which cluster each customer belongs to, you can train a classifier that takes a customer\'s income and spending score and predicts the correct cluster for new customers."
				},
				{
					title: "K-Nearest Neighbors Algorithm",
					content:
						"Introduce k-nearest neighbors (KNN) as a simple classification method that labels a new input based on the majority label among its k closest neighbors in the training data. Use the sample dataset with points A(1,1; Cluster 1), B(2,1; Cluster 1), C(3,3; Cluster 2), D(4,3; Cluster 2), and an unlabeled point E(4,4). Plot the dataset and predict E\'s cluster visually. Then walk through the KNN algorithm: choose k (e.g., k = 2), compute Euclidean distance from E to each point, identify the k closest neighbors, and assign E to the cluster appearing most often among those neighbors. Show the distance table and highlight that E is closest to C and D, both in Cluster 2, so KNN classifies E as Cluster 2."
				},
				{
					title: "Training, Validation, and Testing Data",
					content:
						"Explain that to evaluate a classifier properly, the dataset is split into training, validation, and testing sets. Training data is used to fit the model; validation data is used to tune hyperparameters (like k) and check accuracy while making adjustments; and testing data is held out and used only at the end to measure final performance. For most course projects, focus on splitting into training and testing sets, using training for model fitting and testing to estimate how well the classifier generalizes to new data."
				},
				{
					title: "ML2 Project 1: KNN Customer Segment Classification",
					content:
						"Using the previous customer segmentation dataset and your clustering results, build a KNN classifier that predicts a customer\'s segment from annual income and spending score. In Colab, start from your saved segmentation work or reload the dataset and re-create the features and labels (cluster assignments). Decide on a value of k (for example, 3 or 5) and build feature vectors [income, spending score] for each customer. Split your data into training and testing sets. Implement KNN either manually (computing distances, finding nearest neighbors, and doing majority vote) or via scikit-learn\'s KNeighborsClassifier. Use the test set to compute accuracy and compare predictions to the original cluster labels. Create at least one new ‘fake\' customer feature vector and predict its segment, then check visually against your cluster plot. Write a short explanation of how k was chosen, how well the classifier performed, and whether the classification of the new customer makes sense.",
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
						"Build a KNN classifier to predict car ‘acceptability\' using the classic car evaluation dataset. In Colab, download the dataset and inspect its documentation to identify the target label (acceptability) and the features (buying, maintenance, doors, persons, luggage boot, safety). Notice that many features are categorical strings rather than numbers; design dictionaries mapping each category value to a numeric code and use pandas.replace() to encode them. Construct feature vectors from the encoded columns and labels from the acceptability column, whose possible values are {unacc, acc, good, vgood}. Split the data into training and testing sets with train_test_split(). Use scikit-learn\'s KNeighborsClassifier to train the model and compute accuracy on the test set. Create your own feature vector describing a hypothetical car and classify it; discuss whether the result seems reasonable. Finish by summarizing the dataset, your feature encoding choices, model accuracy, and any surprising results.",
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
			supplementalProjects: []
		},
		{
			title: "ML3 Naive Bayes",
			curriculum: [
				{
					title: "Naive Bayes Overview",
					content:
						"Introduce Naive Bayes as a supervised classification method based on probability rules. Explain that it models the probability of each possible label given the input features and chooses the label with the highest probability. Mention that ‘naive\' refers to the simplifying assumption that features are conditionally independent given the label, which makes the math easier and still works surprisingly well in many real-world problems."
				},
				{
					title: "Naive Bayes with the Iris Dataset",
					content:
						"Use the iris flower dataset (sepal length, sepal width, petal length, petal width, species) to explain how Naive Bayes classification works in practice. Identify the labels as the three species setosa, versicolor, and virginica, and the feature vector as [sepal_length, sepal_width, petal_length, petal_width]. Stress that the feature order is fixed. Describe the process of splitting the data into training and testing sets, using the training data to estimate probabilities (how likely each feature pattern is for each species), and then classifying new feature vectors by choosing the label with the highest conditional probability. Emphasize that accuracy improves when features are informative and when there is enough training data."
				},
				{
					title: "ML3 Project 1: Iris Dataset Classification",
					content:
						"In Colab, build a Naive Bayes classifier for the iris dataset. Load the CSV from the provided URL, then separate it into X (feature vectors) and y (labels). Use pandas.drop() to remove the species column when constructing X. Print the first few rows of X and y with head() to verify that the features and labels align (X[i] corresponds to y[i]). Split the data into training and testing sets. Use scikit-learn\'s MultinomialNB or another suitable Naive Bayes variant, call fit() on the training data, then call predict() on the test data and compute accuracy with accuracy_score(). Finally, create a few custom feature vectors and have the classifier predict their species, noting that these examples may not exist in the original dataset. Summarize the dataset, model accuracy, and any surprising classifications.",
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
						"Use Naive Bayes to classify emails as spam or not spam with a realistic text dataset. In Colab, load the spam mails dataset from Kaggle and drop irrelevant columns such as messageid and label columns that aren\'t needed for modeling. Remove duplicate rows. Write a preprocessing function that removes punctuation, lowercases the text, and filters out common stopwords like ‘the\', ‘is\', and ‘and\' to avoid over-emphasizing them. Use scikit-learn\'s CountVectorizer with your custom preprocessing function to turn each email into a bag-of-words feature vector. Build a list of labels corresponding to whether each email is spam or ham. Split the data into training and testing sets (e.g., 80% training, 20% testing), train a Naive Bayes classifier (such as MultinomialNB), and evaluate its accuracy on the test set. Discuss training time, any misclassifications, and why Naive Bayes is a good baseline for text classification. Wrap up with a short explanation of the dataset content, what you were trying to detect, your model\'s accuracy, and any surprising results.",
					projectLink:
						"https://colab.research.google.com/drive/1nV9spL17iCWHZMhJMzdWwjJ_Td6ZarIY",
					solutionLink:
						"https://colab.research.google.com/drive/1cwE9wp5LQ74Va3OtGnCoAjhCXkeYGPQy",
					datasetLink:
						"https://www.kaggle.com/venky73/spam-mails-dataset",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml3_project_2.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "ML4 Neural Networks",
			curriculum: [
				{
					title: "Neurons and Activation Functions",
					content:
						"Another technique or tool we can use for classification is called a neural network.\n\n" +
						"A neural network is built out of neurons. A neuron is a node in a graph that takes in a specific number of inputs then produces a single output by doing some math on the inputs.\n\n" +
						"A neuron contains some number of predetermined weights. The number of weights in a neuron is equivalent to the number of inputs to that neuron. For instance, the neuron above would have two weights in it (`w1` and `w2`).\n\n" +
						"Once the neuron takes an input, it calculates the output first multiplying each input by its corresponding weight: `x1\*w1` and `x2\*w2.`\n\n" +
						"Then, the neuron adds together each of these products along with a bias value called *b*: `x1\*w1 + x2\*w2 + b`.\n\n" +
						"Finally, the neuron passes the sum through a special function called an activation function f to turn the output into a nice predictable form. Show the a picture of the sigmoid function. The sigmoid function, for example, always returns a value between 0 and 1. Some common activation functions are the sigmoid and the relu functions.\n\n" +
						"The output of the activation function is the output of the neuron: `y = f(x1\*w1 + x2\*w2 + b)`.\n\n" +
						"Let's walk through this example of an input to the above neuron:\n" +
						"\tlet `x1 = 0`, `x2 = 1`, `w1 = 1`, `w2 = 2`, `b = 1`, `activation function = sigmoid`\n" +
						"\t`x1\*w1 + x2\*w2 + b = (0)(1) + (1)(2) + 1 = 3`\n" +
						"\t`f(3) = 0.953` (using a sigmoid calculator online)"
					// content:
					// 	"Introduce a neuron as a basic computational unit that takes multiple inputs and produces a single output. Explain that each neuron has weights (w1, w2, …) corresponding to each input and a bias term b. For two inputs x1 and x2, the neuron computes z = x1*w1 + x2*w2 + b and then passes z through an activation function f to get the final output y = f(z). Show or describe common activation functions such as sigmoid (outputs between 0 and 1) and ReLU (rectified linear unit). Work through a numeric example with x1 = 0, x2 = 1, w1 = 1, w2 = 2, b = 1, and a sigmoid activation, computing z and then f(z)."
				},
				{
					title: "ML4 Project 1: Build a Neuron Class",
					content:
						"What instance attributes should the Neuron class have? The `Neuron` class needs the weights (`w1` and `w2`) and the activation function (You may need to pass in a function as an argument).\n" +
						"What parameters does the `run()` method need? It needs the two inputs (`x1` and `x2`) into the neuron and the bias.\n" +
						"Outside the class, write a sigmoid function that takes in a single input and returns the output of the sigmoid function.\n" +
						"Create an instance of `Neuron` and pass an input into it.",
					// content:
					// 	"In Colab, implement a Neuron class that encapsulates the behavior of a single neuron. Decide on instance attributes such as a list or array of weights and an activation function passed in at initialization. Implement a run() method that takes input values (e.g., x1 and x2) plus a bias and computes the neuron\'s output by multiplying inputs by their weights, summing with the bias, and applying the activation function. Write a standalone sigmoid function that takes a numeric input and returns 1 / (1 + exp(-x)). Create an instance of Neuron using chosen weights and sigmoid as the activation, then call run() with various inputs to confirm the output matches manual calculations. Conclude with a short explanation of how the class works and what surprised you about implementing activation functions as function arguments.",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_1.mp4"
				},
				{
					title: "Neural Network Structure",
					content:
						"Explain that a neural network is a collection of neurons organized in layers. Describe the typical structure: an input layer that simply passes in the feature values, one or more hidden layers where neurons compute intermediate representations, and an output layer that produces the final prediction. Walk through a small example network with two inputs, a hidden layer of two neurons, and a single output neuron. Describe how data flows: inputs go into both hidden neurons; each hidden neuron computes its output; then the output neuron takes those two hidden outputs as inputs, applies its own weights and activation, and produces the final output. Use a worked numeric example similar to the one in the text to show how this network produces a continuous result."
				},
				{
					title: "ML4 Project 2: Simple Neural Network Simulation",
					content:
						"Using the Neuron class from the previous project, simulate a simple neural network with two inputs, one hidden layer with two neurons, and one output neuron. Initialize input values x1, x2, and a bias b. Create two Neuron objects to represent the hidden layer, each with its own weights and activation function (for example, sigmoid). Create a third Neuron object to represent the output layer, possibly using ReLU as the activation. Feed the input (x1, x2, b) into each hidden neuron, collect their outputs, then feed these outputs and the bias into the output neuron. Print intermediate results from each neuron so the flow of data through the network is easy to follow. Discuss how changing weights or activation functions changes the final output.",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_2.mp4"
				},
				{
					title: "Neural Networks for Classification",
					content:
						"Explain how neural networks can be used for classification tasks. Connect back to feature vectors: each feature becomes an input node in the input layer. During training, each feature vector is fed forward through the network to produce an output, which is compared to the true label using a loss function that measures how far off the prediction is. Describe backpropagation as the process of computing gradients of the loss with respect to the network\'s weights and updating those weights to reduce loss over time. Emphasize that training is essentially finding weights and biases that minimize loss over all training examples. Note that outputs of a network for classification are continuous, so we need a mapping from the output to discrete categories, such as rounding a single output between 0 and 1 or using softmax for multi-class problems. Introduce keras as a high-level library that handles many of the implementation details for building and training neural networks."
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
			supplementalProjects: []
		},
		{
			title: "ML5 Introduction to Regression",
			curriculum: [
				{
					title: "Regression vs. Classification",
					content:
						"Contrast regression with classification: both use supervised learning and labeled datasets, but in regression the output is a continuous numeric value rather than a discrete category. Use predicting house prices as an example where outputs can take many possible numeric values. Emphasize that in regression it is acceptable and expected to be off by some margin and that the goal is to minimize average error rather than be exactly correct on every example."
				},
				{
					title: "Linear Regression Basics",
					content:
						"Introduce linear regression as modeling the relationship between an input x and an output y using a straight line y = m x + b. Draw example data points on a graph and show several potential lines; discuss which line better fits the data and why. Explain that in practice we use libraries to compute m (slope) and b (intercept) to minimize error over the whole dataset. Briefly describe correlation: a positive correlation means y tends to increase as x increases, a negative correlation means y tends to decrease as x increases, and the magnitude (close to 1 vs. close to 0) indicates strength of the relationship."
				},
				{
					title: "ML5 Project 1: Simple Linear Regression",
					content:
						"In Colab, open the starter code for simple linear regression. Plot the given x and y data as a scatterplot and ask whether the data appears to follow a roughly straight-line trend. Use scikit-learn\'s LinearRegression class to fit a model to the data. Show how to extract and print the slope, y-intercept, correlation (R^2 score), and use the model to predict y for a given x. Plot the line of best fit on top of the scatterplot to visually confirm that it matches the trend. Describe whether the relationship is positive or negative and whether it appears strong, weak, or moderate based on both the graph and R^2 value. Encourage trying predictions for x values not in the original dataset and discuss whether those predictions seem reasonable.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML_Simple-Linear-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_1.mp4"
				},
				{
					title: "Polynomial Regression",
					content:
						"Not all relationships are linear; some are better modeled with curves. Show an example of data that follows a U-shaped or curved pattern and introduce polynomial regression as fitting equations like y = a x^2 + b x + c (or higher degree polynomials) to the data. Polynomial regression adds terms with higher powers of x to capture curvature, and scikit-learn can generate polynomial features and fit these models similarly to linear regression."
				},
				{
					title: "ML5 Project 2: Simple Polynomial Regression",
					content:
						"Using the starter code in Colab, plot the given x and y data and discuss whether a straight line looks appropriate or whether the shape appears curved. First build a linear regression model and plot its line; evaluate how well it fits by examining residuals and the average error. Then build a polynomial regression model (for example, quadratic) using scikit-learn\'s PolynomialFeatures plus LinearRegression. Print the learned coefficients and intercept, and plot the resulting curve along with the data. Compare the fit quality and typical error of the linear versus polynomial models. For a chosen x value, compute predictions from both models and compare them to the actual y; discuss which model appears to capture the trend better.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML_Simple-Polynomial-Regression-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML_Simple-Polynomial-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_2.mp4"
				},
				{
					title: "ML5 Project 3: Predicting Life Expectancy",
					content:
						"In Colab, use WHO life expectancy data to build and compare regression models. Upload the dataset to Google Drive, create a Colab notebook, and mount Drive. Read the CSV into pandas, identify multiple features (such as health, economic, and demographic variables) as inputs, and life expectancy as the target output. Split data into training and testing sets. Build a linear regression model using scikit-learn and measure its performance with the model\'s score on the test data. Then build a polynomial regression model (for example by expanding some features or using polynomial transformations) and evaluate its score as well. Compare which model fits the data better and discuss whether extra complexity is justified. Summarize which factors seem most correlated with life expectancy and which model gave more reliable predictions.",
					projectLink:
						"https://colab.research.google.com/drive/1BAz3vBA8UefNbI5ejqjlEaKtJshEK3Bc",
					solutionLink:
						"https://colab.research.google.com/drive/1v08pPhtCoA6J8IdqT1c7SXemnA3exlcd#scrollTo=7BRzG9FlRD_L",
					datasetLink:
						"https://www.kaggle.com/kumarajarshi/life-expectancy-who",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_3.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "ML6 Regression with Neural Networks",
			curriculum: [
				{
					title: "Neural Networks for Regression",
					content:
						"Explain that neural networks can also be used for regression, not just classification. Emphasize that for nonlinear or complex relationships, neural networks can approximate a curved function that fits the data more flexibly than polynomial regression. Note the tradeoffs: networks usually require more data, take longer to train, and are harder to interpret, so they are best used when simpler models are not accurate enough."
				},
				{
					title: "Evaluating Regression Models",
					content:
						"Introduce mean squared error (MSE) and mean absolute error (MAE) as standard metrics for regression. Both measure average prediction error: MAE averages absolute differences, while MSE averages squared differences, which penalizes large errors more heavily. Explain that a good regression model aims to minimize these values on both training and test data. Discuss overfitting: if a model fits the training data extremely well but performs poorly on new data, it has memorized rather than generalized. Reinforce the importance of train–test splits (for example, 80% training and 20% testing) to check generalization."
				},
				{
					title: "ML6 Project 1: Predicting House Prices with Neural Networks",
					content:
						"In Colab, build a neural network regression model for the Boston housing dataset using keras. Create a new notebook, then load the dataset from keras and split it into training and testing sets. Use StandardScaler or a similar tool to normalize input features (so they have similar scales), which helps the network train more effectively. Design a neural network with one or more dense hidden layers suitable for regression, using an appropriate activation (such as ReLU) in hidden layers and a linear activation in the output layer. Compile the model with a loss function appropriate for regression (such as MSE) and a suitable optimizer. Train the model on the training data and record the mean absolute error over epochs; plot MAE vs. epoch to show how error decreases as training progresses. Evaluate the model on the test set, printing mean squared error to gauge performance. Finally, plot predicted vs. actual house prices for the test set on a scatterplot with the line y = x for reference; points close to this line indicate accurate predictions. Summarize how normalization, network architecture, and training epochs influence accuracy and overfitting.",
					projectLink:
						"https://colab.research.google.com/drive/1yuCcN855nKnL_25zYHiN8QORMhIy2zLm",
					solutionLink:
						"https://colab.research.google.com/drive/1bQ4JWcP0K0_lMEVks-cQ10HOMXAawvXX",
					datasetLink:
						"https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml6_project_1.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "ML7 Image Classifier",
			curriculum: [
				{
					title: "Image Data and Classification",
					content:
						"Explain that images are just arrays of pixel values, so they can be used as input to machine learning models just like numerical datasets. Each pixel can store information such as brightness or RGB color values. Describe image classification as assigning a label to each image (for example, rainy vs. sunny vs. cloudy vs. sunrise). Emphasize that modern image classifiers are typically neural networks that learn from many labeled examples how patterns in pixel data correspond to categories."
				},
				{
					title: "ML7 Project 1: Weather Image Classifier",
					content:
						"In Colab, build a neural network to classify weather images (rainy, sunny, cloudy, sunrise). Upload the dataset to a Google Drive folder and mount Drive in Colab. Use Keras\'s ImageDataGenerator to define training, validation, and test image generators, handling image rescaling, batching, and directory loading. Design a neural network appropriate for image data—either a simple convolutional neural network (CNN) or a dense network after flattening the images. Compile the model with a suitable loss function for multi-class classification and train it on the training set while monitoring validation accuracy. Evaluate the trained model on the test set to estimate real-world performance. Then load individual images from an example set, run model.predict() on them, and interpret the outputs by taking the index of the largest predicted probability to determine the predicted class. Compare predictions with true labels and discuss success and failure cases. Summarize the dataset, model architecture, test accuracy, and any images where the model struggled.",
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
						"Provide optional reading to deepen understanding of advanced concepts used in modern ML: loss functions (how models measure their error during training and why different problems use different loss definitions), convolutional neural networks (CNNs) for image processing and why convolutions help detect patterns like edges and textures, and the idea of a `model` as a trained artifact that can be deployed and reused. Skim articles on loss functions, convolutional networks, and machine learning models from sources such as Google\'s ML Crash Course, IBM, Microsoft, and Databricks, then connect those ideas back to the weather image classifier built in the course."
				}
			],
			supplementalProjects: []
		},
		{
			title: "ML8 Master Project",
			curriculum: [
				{
					title: "Master Project Planning",
					content:
						"Introduce the Master Project as a capstone where the student chooses a real dataset and builds a substantial machine learning project around it. Explain that the project can be classification or regression and can use any combination of algorithms learned throughout the course (k-means, KNN, Naive Bayes, neural networks, regression, etc.). Browse suggested datasets and project ideas such as classification tasks (fake news detection, credit card fraud detection, Titanic survival prediction) or regression tasks (loan amount prediction, Bitcoin price prediction, stock price prediction, medical insurance cost), then pick one idea that genuinely fits the student\'s interests and clearly define the problem to solve."
				},
				{
					title: "Master Project Implementation",
					content:
						"Once the topic and dataset are chosen, scope the project. Identify the input features, target labels or regression outputs, and evaluation metrics. Decide which two algorithms to compare: for classification, perhaps Naive Bayes vs. a neural network; for regression, maybe linear/polynomial regression vs. a neural network. Set up a new Colab notebook, upload or connect to the dataset, and perform standard steps: data cleaning, feature engineering, train–test split, model training, evaluation, and comparison. Encourage writing clear code cells and explanatory text cells documenting the process. Aim for a project that spans about two weeks, with substantial implementation and debugging done independently while you provide guidance and code reviews."
				},
				{
					title: "Master Project Examples",
					content:
						"Show the example notebooks for similar projects, such as a Titanic survival predictor or a medical insurance cost predictor. Walk through how those examples are structured: data exploration, feature selection, model building, evaluation, and reflection on results. Use these examples as inspiration but ensure the project is original work and analysis, not just a copy. Discuss how techniques or visualizations from these examples might be adapted to the chosen dataset."
				},
				{
					title: "Master Project Presentation",
					content:
						"When the project reaches a solid, working state, write a concise project summary explaining which concepts from the course were used (clustering, classification, regression, neural networks, train–test split, etc.) and what was learned about the data."
				},
				{
					title: "Course Recap & Next Steps",
					content:
						"Wrap up the course by recapping the major ideas learned: unsupervised learning and clustering, supervised learning and classification, KNN, Naive Bayes, neural networks, regression, overfitting and evaluation, and image classification. Discuss how these pieces fit together in the Master Project. Then talk about recommended next courses based on interests and confidence—options might include USACO training for advanced competitive programming, AP Computer Science, or language-specific Level 1 courses in Java, JavaScript, or C++. Choose a path that best matches the goals at hand and treat the Master Project as a portfolio piece to share with teachers, mentors, or future programs."
				}
			],
			supplementalProjects: []
		}
	]
};
