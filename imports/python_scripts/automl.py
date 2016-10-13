import sys
import pandas as pd
import numpy as np
from sklearn.cross_validation import train_test_split
from sklearn.preprocessing import LabelEncoder, label_binarize
import autosklearn.classification
from scipy.stats import mode
from sklearn.metrics import precision_recall_fscore_support, roc_curve, auc, confusion_matrix
import textwrap
import json



def encode_features(df, target):
  predictor_types = []
  for col in df.columns.difference([target]):
    if not np.issubdtype(df[col], np.number):
      predictor_types.append('categorical')
      df[col] = LabelEncoder().fit_transform(df[col])
    else:
      predictor_types.append('numerical')
  return df, predictor_types

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
    Predictions (first 20):   {predictions}
    Actual values (first 20): {y_test}
    Prediction probabilities (first 5): 
    {probas}
  """

  return textwrap.dedent(results.format(
    score = score,
    predictions = predictions[0:20],
    y_test = y_test[0:20],
    probas = "\n    ".join([str(proba) for proba in probas[0:5]])
  ))

def get_ROC_values(class_names, y_test, probas):
  encoded_class_names = range(len(class_names))
  y_bin = label_binarize(y_test, classes=encoded_class_names)

  if len(encoded_class_names) == 2:
    fpr, tpr, roc_auc = get_binomial_ROC(y_bin, probas)
  else:
    fpr, tpr, roc_auc = get_polynomial_ROC(y_bin, probas)
  return fpr, tpr, roc_auc

def get_binomial_ROC(y_bin, probas):
  fpr, tpr, _ = roc_curve(y_bin, probas[:, 1])
  fpr = fpr.tolist()
  tpr = tpr.tolist()
  roc_auc = auc(fpr, tpr)
  return fpr, tpr, roc_auc

def get_polynomial_ROC(y_bin, probas):
  fpr = []
  tpr = []
  roc_auc = []
  for i in range(len(y_bin[0])):
    f, t, _ = roc_curve(y_bin[:, i], probas[:, i])
    fpr.append(f.tolist())
    tpr.append(t.tolist())
    roc_auc.append(auc(f, t))
  return fpr, tpr, roc_auc



csv_path = sys.argv[1]
target = sys.argv[2]
time = int(sys.argv[3])
df = pd.read_csv(csv_path)
orig_dtypes = df.dtypes
test_set_size = 0.2

df, predictor_types = encode_features(df, target)

X = df.drop(target, axis=1)
X = np.ascontiguousarray(X)
y = df[target]
class_names = np.unique(y)
y = LabelEncoder().fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_set_size)

automl = autosklearn.classification.AutoSklearnClassifier(time_left_for_this_task=time, 
                                                          per_run_time_limit=int(time / 10), 
                                                          ml_memory_limit=10000)
automl.fit(X_train, y_train, feat_type=predictor_types)

score = automl.score(X_test,y_test)
predictions = automl.predict(X_test)
probas = automl.predict_proba(X_test)

baseline_acc = (mode(y_test)[1] / len(y_test))[0]
precRecFscoreSupport = precision_recall_fscore_support(y_test, predictions)
fpr, tpr, roc_auc = get_ROC_values(class_names, y_test, probas)

print("***JSON***", flush=True)
print(json.dumps({
  'info_log': format_info(csv_path, target, time, df, test_set_size, orig_dtypes),
  'results_log': format_results(score, predictions, y_test, probas),
  'results': {
    'score': score,
    'baselineAcc': baseline_acc,
    'trueValues': y_test.tolist(),
    'predictions': predictions.tolist(),
    'probas': probas.tolist(),
    'classNames': class_names.tolist(),
    'precRecFscoreSupport': np.rot90(np.fliplr(precRecFscoreSupport)).tolist(),
    'cnfMatrix': np.rot90(np.fliplr(confusion_matrix(y_test, predictions))).tolist(),
    'fpr': fpr,
    'tpr': tpr,
    'rocAUC': roc_auc
  }
}), flush=True)
