from cmath import nan
import pandas as pd
from datetime import timedelta, datetime
import requests
from pkg_resources import empty_provider
import json

response = requests.get("https://v6.exchangerate-api.com/v6/81a98818ac24839899cdc992/latest/USD")
data = response.text
parse_json = json.loads(data)
rates = parse_json['conversion_rates']

df = pd.read_csv('inputTest.csv',index_col=0)

# test setting empty ones to 1 then changing them
def emptyDate():
    tomorrow_datetime = datetime.now() + timedelta(days=1)
    df['Date'].fillna(tomorrow_datetime.date(), inplace=True)
    df["Date"] = pd.to_datetime(df["Date"])
    df1 = df.sort_values(by="Date")
    df1.to_csv('inputTest.csv')

    print("All empty Maturity dates have been set to tomorrows date.")

def removeRows():
    df.drop(df[
        (df['Amount'] == 230) &
        (df.index.str.contains("a"))
    ].index,inplace=True)

    df.to_csv('inputTest.csv')

def clearFile():
    f = open('inputTest.csv', "w")
    f.truncate()
    f.close()

def addColumn():
    df.insert(2,'neg_Amount','')
    df.to_csv('inputTest.csv')

def convertToUSD():
    df.insert(4,'USD_Amount','')
    x = len(df.index)
    for i in range(0,x):
        df['USD_Amount'].values[i] = df['Amount'].values[i] * rates[df['Currency'].values[i]]
    df.to_csv('inputTest.csv')
convertToUSD()


def filterColumns():
    df.rename(columns={"End Date": "MATURITY_DATE", "Principal Amount (Signed)":"USD_AMOUNT"},inplace=True)
    df['MATURITY_DATE'] = pd.to_datetime(df['MATURITY_DATE'],errors='coerce')
    keep = ['MATURITY_DATE','USD_AMOUNT']
    df1 = df[keep]
    df1.to_csv('output.csv',index=False)
    return(df1)
def mergeFiles():
    result = pd.concat([finalFile(),filterColumns()])
    result.reset_index(drop=True,inplace=True)
    result.to_csv('output.csv',index=False)
def fixDates():
    for i in range(0,len(df.index)):
        if(df['MATURITY_DATE'][i] != ''):
            date = df['MATURITY_DATE'][i]
            df['MATURITY_DATE'][i] = date.strftime('%Y-%m-%d')
    df.to_csv('output.csv',index=True)
def fixFile2():
    clearFile('output.csv')
    mergeFiles()
fixFile2()