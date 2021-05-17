import pandas as pd

df = pd.read_csv("../data/past-data/birth-2.csv")

#print(df.head(20))

df['decade'] = df['year'] // 10 * 10

# print("New DF:\n", df.head(20))

decade_means_df = df.groupby(['country', 'country_code', 'decade']).mean()
del decade_means_df['year']

decade_means_df.to_csv('../data/past-data/birth-3.csv')
