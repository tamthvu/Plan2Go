from operator import index
from re import T
from typing import final
import pandas as pd
import numpy as np
import datetime
from datetime import timedelta
import requests
from pkg_resources import empty_provider
import json

response = requests.get("https://v6.exchangerate-api.com/v6/81a98818ac24839899cdc992/latest/USD")
data = response.text
parse_json = json.loads(data)
rates = parse_json['conversion_rates']

df = pd.read_csv('inputRawFile.csv', index_col=False)

def clearFile(file):
    f = open(file, "w")
    f.truncate()
    f.close()

clearFile('output.csv')

# REMOVE COLUMNS
del df['AVG_CR_BALANCE']
del df['AVG_DR_BALANCE']
del df['INT_EXPENSE']
del df['INT_INCOME']
del df['GL_SUB_HEAD_CODE']
del df['A/C_CLASSIFICATION']
del df['CR_INT_RATE']
del df['DR_INT_RATE']
del df['COUNTRY']
del df['INT_CODE']
del df['LAST_DAY_IN_DR_BAL']
del df['INT_PAY_FLAG']
del df['INT_COLL_FLAG']
del df['CUST_ID']
del df['OPENING_BAL.']
df.drop(df.columns[len(df.columns)-1],axis=1,inplace=True)

#def emptyMaturity():
    #tomorrow_datetime = (datetime.datetime.now().date() + timedelta(days=1)) # datetime.date type

    #df['MATURITY_DATE'].fillna(tomorrow_datetime, inplace=True) # datetime.date type
    #df['MATURITY_DATE'] = pd.to_datetime(df['MATURITY_DATE'],errors='coerce')

    #df.sort_values(by='MATURITY_DATE', ascending=True, inplace=True)
    #df.to_csv('output.csv',index=False)

#REMOVE ROWS
df.drop(df[
    (df['SCHEME_TYPE'] != "ODA") &
    (df['SCHEME_TYPE'] != "CAA") &
    (df['SCHEME_TYPE'] != "LAA") &
    (df['SCHEME_TYPE'] != "OAP") &
    (df['SCHEME_TYPE'] != "OAB")].index, inplace=True)
    
    # Find where rows are OAB/OAP and dont have 1121 in the
    # account number and remove them
df.drop(df[
    (df['SCHEME_TYPE'] == 'OAB') &
    (~df['ACCOUNT_NO.'].str.contains("1121",case=False))
    ].index,inplace=True)
df.drop(df[
    (df['SCHEME_TYPE'] == 'OAP') &
    (~df['ACCOUNT_NO.'].str.contains("1121",case=False))
    ].index,inplace=True)

#ADD AMOUNT
df.insert(4,'AMOUNT','')
x = len(df.index)
non = "',"
for i in range(0,x):
    # Fixes the formatting of CLS_BALANCE and sets it to a float type
    value = df['CLS_BALANCE'].values[i]
    for char in non: value=value.replace(char,"")
    value = float(value)
    df['AMOUNT'].values[i] = value * -1

#ADD AMOUNT AND CONVERT
df.insert(9,'USD_AMOUNT','')
x = len(df.index)
non = "',"
for i in range(0,x):
    value = df['CLS_BALANCE'].values[i]
    for char in non: value=value.replace(char,"")
    value = float(value) * -1
    df['USD_AMOUNT'].values[i] = value * rates[df['CRNCY'].values[i]]

#INSERT DDAS
empty = []
for i in range(0,len(df.index)):
    if(df['SCHEME_TYPE'].values[i] == 'CAA'):
        df['USD_AMOUNT'].values[i] = pd.to_numeric(df['USD_AMOUNT'].values[i])
        empty.append(df['USD_AMOUNT'].values[i])

for i in range(0,len(df.index)):
    if(df['SCHEME_TYPE'].values[i] == 'ODA'):
        df['USD_AMOUNT'].values[i] = pd.to_numeric(df['USD_AMOUNT'].values[i])
        empty.append(df['USD_AMOUNT'].values[i])

usd_sum = sum(empty)
    
dda = [
    'DDA1', 'DDA1', 'DDA1','','','','','','',usd_sum
    ]
df.reset_index(drop=True, inplace=True)
df.loc[df.shape[0]] = dda

dda1 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=1)),'',(usd_sum*0.1267)]
dda2 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=6)),'',(usd_sum*0.2578)]
dda3 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=8)),'',(usd_sum*0.0282)]
dda4 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=15)),'',(usd_sum*0.0834)]
dda5 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=30)),'',(usd_sum*0.0)]
dda6 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=30)),'',(usd_sum*0.1387)]
dda7 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=90)),'',(usd_sum*0.0596)]
dda8 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=180)),'',(usd_sum*0.0)]
dda9 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=365)),'',(usd_sum*0.0)]
dda10 = ['DDA','DDA', 'DDA','','','','',(datetime.datetime.now().date() + timedelta(days=730)),'',(usd_sum*0.3056)]

df.loc[df.shape[0]] = dda1
df.loc[df.shape[0]] = dda2
df.loc[df.shape[0]] = dda3
df.loc[df.shape[0]] = dda4
df.loc[df.shape[0]] = dda5
df.loc[df.shape[0]] = dda6
df.loc[df.shape[0]] = dda7
df.loc[df.shape[0]] = dda8
df.loc[df.shape[0]] = dda9
df.loc[df.shape[0]] = dda10

#DELETE CAA AND ODA AND DDA1
df.drop(df[df['SCHEME_TYPE'] == 'CAA'].index,inplace=True)
df.drop(df[df['SCHEME_TYPE'] == 'ODA'].index,inplace=True)
df.drop(df[df['SCHEME_TYPE'] == 'DDA1'].index,inplace=True)
    
df.reset_index(drop=True, inplace=True)

df1 = df[['MATURITY_DATE','USD_AMOUNT']]
df1.reset_index(drop=True,inplace=True)
df1.to_csv('output.csv',index=True)

def firstFile():
    return df1

firstFile()