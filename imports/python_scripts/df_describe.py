import sys
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, label_binarize
import textwrap
import json



def format_info(csv_path, df, test_set_size, orig_dtypes):
  info = """
    ---INPUT---
    CSV Path: {csv_path}

    Dataset shape: {df_shape}
    Train/test split ratio: {train_set_size}:{test_set_size}

    Old dtypes / Converted dtypes
    -----------------------------
    {dtype_info}
  """

  return textwrap.dedent(info.format(
    csv_path = csv_path,
    df_shape = df.shape,
    train_set_size = 1 - test_set_size,
    test_set_size = test_set_size,
    dtype_info = "\n    ".join([(col + ": " + old.name + " -> " + new.name) for col, old, new in zip(df.columns, orig_dtypes, df.dtypes)])
  ))

def generate_df_description_table(df_description, orig_dtypes):
  df_description_table = [row.tolist() for row in df_description.fillna(value='').as_matrix()]
  [df_description_table[i].insert(0, row_name) for i, row_name in enumerate(df_description.index)]
  df_description_table.insert(0, ['TYPE'] + [dtype.name for dtype in orig_dtypes])
  df_description_table.insert(0, [''] + df_description.columns.tolist())
  df_description_table = [[np_to_python(value) for value in row] for row in df_description_table]
  return df_description_table

def np_to_python(value):
  if isinstance(value, np.generic):
    return np.asscalar(value)
  return value

def encode_binary_features(df):
  for col in df.columns:
    if len(df[col].unique()) == 2:
      df[col] = LabelEncoder().fit_transform(df[col])
  return df



csv_path = sys.argv[1]
df = pd.read_csv(csv_path)
orig_dtypes = df.dtypes
df_description = df.describe(include='all')
df_description_table = generate_df_description_table(df_description, orig_dtypes)
test_set_size = 0.2

print("Description follows:")
print("***JSON***", flush=True)
print(json.dumps({
  'info_log': format_info(csv_path, df, test_set_size, orig_dtypes),
  'results_log': "",
  'results': {
    'dfDescription': df_description_table,
    'corrMatrix': encode_binary_features(df).corr().as_matrix().tolist()
  }
}), flush=True)
