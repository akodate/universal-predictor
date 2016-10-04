import sys
import pandas as pd
import numpy as np
from sklearn.cross_validation import train_test_split
from sklearn.preprocessing import LabelEncoder
import autosklearn.classification
import textwrap

def format_info(csv_path, target, time, df, test_set_size, orig_dtypes):
  info = """
    ---INPUT---
    CSV Path: {csv_path}
    Target: {target}
    Time: {time}

    Dataset shape: {df_shape}
    Train/test split ratio: {train_set_size}:{test_set_size}

    Old dtypes / Converted dtypes
    -----------------------------
    {dtype_info}
  """

  return textwrap.dedent(info.format(
    csv_path = csv_path,
    target = target,
    time = time,
    df_shape = df.shape,
    train_set_size = 1 - test_set_size,
    test_set_size = test_set_size,
    dtype_info = "\n    ".join([(col + ": " + old.name + " -> " + new.name) for col, old, new in zip(df.columns, orig_dtypes, df.dtypes)])
  ))

def format_results(score, predictions, y_test, probas):
  results = """
    ---RESULTS---
    Score: {score}
    Predictions (first 20): {predictions}
    Actual values (first 20):", {y_test}
    Prediction probabilities (first 5): 
    {probas}
  """

  return textwrap.dedent(results.format(
    score = score,
    predictions = predictions[0:20],
    y_test = y_test[0:20],
    probas = "\n    ".join([str(proba) for proba in probas[0:5]])
  ))



csv_path = sys.argv[1]
target = sys.argv[2]
time = int(sys.argv[3])

test_set_size = 0.2

try:
  df = pd.read_csv(csv_path)

  orig_dtypes = df.dtypes

  for col in df.columns.difference([target]):
      if not np.issubdtype(df[col], np.number):
          df[col] = LabelEncoder().fit_transform(df[col])

  X = df.drop(target, axis=1)
  y = df[target]

  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_set_size)

  X_train = np.ascontiguousarray(X_train)
  X_test = np.ascontiguousarray(X_test)
  y_train = LabelEncoder().fit_transform(y_train)
  y_test = LabelEncoder().fit_transform(y_test)

  automl = autosklearn.classification.AutoSklearnClassifier(time_left_for_this_task=time, 
                                                            per_run_time_limit=1, 
                                                            ml_memory_limit=10000)
  automl.fit(X_train, y_train)

  score = automl.score(X_test,y_test)
  predictions = automl.predict(X_test)
  probas = automl.predict_proba(X_test)

  print(format_info(csv_path, target, time, df, test_set_size, orig_dtypes))
  print(format_results(score, predictions, y_test, probas))

except Exception as e:
  print(format_info(csv_path, target, time, df, test_set_size, orig_dtypes))
  print("Error occurred.")
  print(e)

sys.stdout.flush()