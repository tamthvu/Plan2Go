from turtle import clear
import pandas as pd
import numpy as np
from fixRaw import *
from datetime import timedelta, datetime

df = pd.read_csv("inputBlotterFile.csv", index_col=0)
dfRaw = pd.read_csv("inputRawFile.csv", index_col=0)

def dropColumns():
    df.drop(
        ['CCY2','CCY1','Block Amt','Repo Amount','Sec. Accrued','Sec. Inv. Price','Block Ref','ISIN 1','Quantity Traded','Buy/Sell','Security Code','Rec Nostro','Pay Nostro','Cpty Pay Agent Inst','PayRec','Settlement Method','Omgeo Ref','Outstanding Notional','ORIGINAL_TENOR',
        'LCY_AMOUNT_1','Dealer','Spread Rate','Department','Deal Type','Trading Book','Deal Status','Type ','TOTAL_MATURITY_AMOUNT','PENDING_DAYS_TO_MATURITY','Entity','Deal Date'],
    axis=1,inplace=True)
    df.to_csv('inputBlotterFile.csv')

# Rename Columns to merge
def renameColumns():
    df.rename(columns={'Deal No': 'ACCOUNT_NO.',
    'Counterparty Mnemonic': 'ACCOUNT_NAME', 'Subtype': 'SCHEME_TYPE',
    'Start Date': 'ACCT_OPEN_DATE  OPEN_EFFECTIVE_DATE', 'Currency': 'CRNCY', 'Principal Amount (Signed)': 'USD_AMOUNT', 'Internal Rate': 'INT_RATE'}, inplace=True)
    df.index.name = 'MATURITY_DATE'


    df.to_csv('inputBlotterFile.csv')

# Reorder Columns to merge
def reorderColumns():
    dates = df.index.values
    acct_no = df['ACCOUNT_NO.'].values
    acct_name = df['ACCOUNT_NAME'].values
    scheme = df['SCHEME_TYPE'].values
    int = df['INT_RATE'].values
    openDate = df['ACCT_OPEN_DATE  OPEN_EFFECTIVE_DATE'].values
    crncy = df['CRNCY'].values
    usd = df['USD_AMOUNT'].values

    data = {
        'ACCOUNT_NO.': acct_no,
        'ACCOUNT_NAME': acct_name,
        'SCHEME_TYPE': scheme,
        'CLS_BALANCE': None,
        'AMOUNT': None,
        'INT_RATE': int,
        'ACCT_OPEN_DATE  OPEN_EFFECTIVE_DATE': openDate,
        'MATURITY_DATE': dates,
        'CRNCY': crncy,
        'USD_AMOUNT': usd
    }

    df1 = pd.DataFrame(data)

    df1.reset_index(drop=True, inplace=True)
    df1.to_csv('inputBlotterFile.csv')

def fixTasks():
    dropColumns()
    renameColumns()
    reorderColumns()
    i = df.index.values
    df.insert(1,'MATURITY_DATE',i)
    df1 = df[['MATURITY_DATE','USD_AMOUNT']]
    df1.reset_index(drop=True,inplace=True)
    df1.to_csv('inputBlotterFile.csv')

def formatFiles():
    x = len(df)
    for i in range(0,x):
        value = str(df['USD_AMOUNT'].values[i])
        s = ''.join(ch for ch in value if ch.isalnum())
        df['USD_AMOUNT'].values[i] = float(s)
    dates1 = df['MATURITY_DATE'].values
    dates2 = dfRaw['MATURITY_DATE'].values
    amt1 = df['USD_AMOUNT'].values
    amt2 = dfRaw['USD_AMOUNT'].values

    data1 = pd.DataFrame({'MATURITY_DATE': dates1, 'USD_AMOUNT': amt1})
    data2 = pd.DataFrame({'MATURITY_DATE': dates2, 'USD_AMOUNT': amt2})

    frames = [data1,data2]
    result = pd.concat(frames)
    result.reset_index(drop=True,inplace=True)
    result.to_csv('inputBlotterFile.csv')

formatFiles()