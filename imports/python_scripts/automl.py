import sys
import pandas as pd
import numpy as np
from sklearn.cross_validation import train_test_split
from sklearn.preprocessing import LabelEncoder
import autosklearn.classification

csv_path = sys.argv[1]
target = sys.argv[2]
time = int(sys.argv[3])

try:
  df = pd.read_csv(csv_path)

  for col in df.columns.difference([target]):
      if not np.issubdtype(df[col], np.number):
          df[col] = LabelEncoder().fit_transform(df[col])

  X = df.drop(target, axis=1)
  y = df[target]

  def run_train_test_split(predictors, target):
      test_size = 0.2
      
      print("Train/test split executed, test size =", test_size)
      return train_test_split(predictors, target, test_size=test_size)

  X_train, X_test, y_train, y_test = run_train_test_split(X, y)

  X_train = np.ascontiguousarray(X_train)
  X_test = np.ascontiguousarray(X_test)
  y_train = LabelEncoder().fit_transform(y_train)
  y_test = LabelEncoder().fit_transform(y_test)

  print(type(X_train), type(y_train))
  print(X_train.shape, y_train.shape)
  print(X_test.shape, y_test.shape)

  automl = autosklearn.classification.AutoSklearnClassifier(time_left_for_this_task=10, 
                                                            per_run_time_limit=1, 
                                                            ml_memory_limit=10000)
  automl.fit(X_train, y_train)

  score = automl.score(X_test,y_test)
  predictions = automl.predict(X_test)
  probas = automl.predict_proba(X_test)

  print("CSV Path:", csv_path)
  print("Target:", target)
  print("Time:", time)
  print("")
  print("Dataset shape:", df.shape)
  print("Dtypes:")
  print(df.dtypes)
  print("")
  print("Score:", score)
  print("Predictions (first 20):  ", predictions[0:20])
  print("Actual values (first 20):", y_test[0:20])
  print("Probas (first 5):")
  print(np.round(probas[0:5], 5))

except Exception as e:
  print("CSV Path:", csv_path)
  print("Target:", target)
  print("Time:", time)
  print("")
  print("Dataset shape:", df.shape)
  print("Dtypes:")
  print(df.dtypes)
  print("")
  print("Error occurred.")
  print(e)

sys.stdout.flush()