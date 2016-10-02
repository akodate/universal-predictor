import sys
import pandas as pd
import numpy as np
import sklearn.datasets
from sklearn.preprocessing import LabelEncoder
from sklearn.cross_validation import train_test_split
import autosklearn.classification
import matplotlib.pyplot as plt

target = sys.argv[1]
time = int(sys.argv[2])
print("Target:", target)
print("Time:", time)

try:
  iris = sklearn.datasets.load_iris()
  X = pd.DataFrame(iris.data)
  y = pd.DataFrame(iris.target)

  y = LabelEncoder().fit_transform(y)

  def run_train_test_split(df, target):
      test_size = 0.2
      
      print("Train/test split executed, test size =", test_size)
      return train_test_split(df, target, test_size=test_size)

  X_train, X_test, y_train, y_test = run_train_test_split(X, y)

  X_train = np.ascontiguousarray(X_train)
  X_test = np.ascontiguousarray(X_test)

  print("Running auto-sklearn...")

  automl = autosklearn.classification.AutoSklearnClassifier(time_left_for_this_task=time, 
                                                            per_run_time_limit=1, 
                                                            ml_memory_limit=10000)
  automl.fit(X_train, y_train)

  score = automl.score(X_test,y_test)
  predictions = automl.predict(X_test)
  probas = automl.predict_proba(X_test)

except Exception as e:
  print("Error occurred.")
  print(e)
finally:
  print("X_train:", X[:3])
  print("y_train:", y[:10])
  print("Score:", score)
  print("Predictions", predictions[:10])
  print("Probabilities", probas[:3])




  sys.stdout.flush()