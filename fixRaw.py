from operator import index
from re import T
import pandas as pd
import numpy as np
from datetime import timedelta, datetime
import requests
from pkg_resources import empty_provider
import json

response = requests.get("https://v6.exchangerate-api.com/v6/81a98818ac24839899cdc992/latest/USD")
data = response.text
parse_json = json.loads(data)
rates = parse_json['conversion_rates']

###############################################################################################################################
# Creates the dataframe for the file
df = pd.read_csv("inputRawFile.csv", index_col=0)

###############################################################################################################################
# Remove rows that are not ODA/CAA/LAA or OAB/OAP that
# the account number doesn't have 1121 in the 7th place
def removeRows():
    # First filter out those that aren't ODA/CAA/LAA/OAP/OAB
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
        (~df.index.str.contains("1121",case=False))
    ].index,inplace=True)
    df.drop(df[
        (df['SCHEME_TYPE'] == 'OAP') &
        (~df.index.str.contains("1121",case=False))
    ].index,inplace=True)

    df.to_csv('inputRawFile.csv')
    print("Irrelevant scheme types have been removed and account numbers containing 1121 have been saved - ✔")

###############################################################################################################################
# Set empty maturity dates to tomorrows date
# Set dates before today to tomorrow
def emptyMaturity():
    tomorrow_datetime = datetime.now() + timedelta(days=1)
    
    df['MATURITY_DATE'].fillna(tomorrow_datetime.date(), inplace=True)
    df['MATURITY_DATE'] = pd.to_datetime(df['MATURITY_DATE'],errors='coerce')
    df.to_csv('inputRawFile.csv')

    print("Empty Maturity_Date cells have been set to tomorrow's date: "+ str(tomorrow_datetime.date())+ " - ✔")

###############################################################################################################################
# Sorts the dataframe based on the Maturity date in ascending order
def sortByMaturity():
    tomorrow_datetime = datetime.now() + timedelta(days=1)

    x = len(df.index)
    for i in range(0,x):
        if type(df['MATURITY_DATE'][i]) == 'datetime.date':
            if((df['MATURITY_DATE'][i]) < datetime.now().date()):
                df['MATURITY_DATE'][i] = tomorrow_datetime

    df.sort_values(by='MATURITY_DATE', ascending=True, inplace=True)
    df.to_csv('inputRawFile.csv')

    print("Maturity dates sorted sucessfully and old dates are set to tomorrow's date - ✔")

###############################################################################################################################
# Add a "AMOUNT" column after CLS_BALANCE column 
# then multiply CLS_BALANCE cells by -1
def addAmountColumn():
    df.insert(3,'AMOUNT','')
    x = len(df.index)
    non = "',"
    for i in range(0,x):
        # Fixes the formatting of CLS_BALANCE and sets it to a float type
        value = df['CLS_BALANCE'].values[i]
        for char in non: value=value.replace(char,"")
        value = float(value)
        df['AMOUNT'].values[i] = value * -1
    df.to_csv('inputRawFile.csv')
    print("Amount column has been inserted with negative values - ✔")

def insertColumn(columnName,index,values):
    df.insert(index,columnName,values)
    df.to_csv('inputRawFile.csv')
    print(columnName + " has been inserted into the dataframe in column " + index + "- ✔")

###############################################################################################################################
# Add USD column and covert AMOUNT to USD currency by the related conversion rate
# Add USD_AMOUNT after CURRENCY
def convertToUSD():
    df.insert(13,'USD_AMOUNT','')
    x = len(df.index)
    non = "',"
    for i in range(0,x):
        value = df['CLS_BALANCE'].values[i]
        for char in non: value=value.replace(char,"")
        value = float(value) * -1
        df['USD_AMOUNT'].values[i] = value * rates[df['CRNCY'].values[i]]
    df.to_csv('inputRawFile.csv')
    print("USD_AMOUNT column has been inserted and currencies have been converted to USD - ✔")

###############################################################################################################################
# Remove irrelevant columns
def removeColumns():
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
    df.drop(df.columns[len(df.columns)-1], axis=1, inplace=True)
    df.to_csv('inputRawFile.csv')
    print("Irrelevant columns have been removed - ✔")

###############################################################################################################################
# Clears the file
def clearFile(file):
    f = open(file, "w")
    f.truncate()
    f.close()

###############################################################################################################################
# Go through the SCHEME_TYPES pull out CAA & ODA 
# CALCULATE THE SUM FOR ALL USD_AMOUNT
def insertDDA():
    empty = []
    for i in range(0,len(df.index)):
        if(df['SCHEME_TYPE'][i] == 'CAA'):
            df['USD_AMOUNT'][i] = pd.to_numeric(df['USD_AMOUNT'])
            empty.append(df['USD_AMOUNT'][i])
    for i in range(0,len(df.index)):
        if(df['SCHEME_TYPE'][i] == 'ODA'):
            df['USD_AMOUNT'][i] = pd.to_numeric(df['USD_AMOUNT'])
            empty.append(df['USD_AMOUNT'][i])
    usd_sum = sum(empty)
    print(usd_sum)
    dda = [
        'DDA', 'DDA',
        '','','','','','',usd_sum
    ]
    df.loc[df.shape[0]] = dda
    x = len(df.index)-1
    df.rename(index={x:'DDA1'},inplace=True)

    dda1 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=1)),'',(usd_sum*0.1267)]
    dda2 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=6)),'',(usd_sum*0.2578)]
    dda3 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=8)),'',(usd_sum*0.0282)]
    dda4 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=15)),'',(usd_sum*0.0834)]
    dda5 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=30)),'',(usd_sum*0.0)]
    dda6 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=30)),'',(usd_sum*0.1387)]
    dda7 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=90)),'',(usd_sum*0.0596)]
    dda8 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=180)),'',(usd_sum*0.0)]
    dda9 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=365)),'',(usd_sum*0.0)]
    dda10 = ['DDA', 'DDA','','','','',(datetime.now() + timedelta(days=730)),'',(usd_sum*0.3056)]

    df.loc[df.shape[0]] = dda1
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)
    
    df.loc[df.shape[0]] = dda2
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)
    
    df.loc[df.shape[0]] = dda3
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda4
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda5
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda6
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda7
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda8
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda9
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    df.loc[df.shape[0]] = dda10
    x = len(df.index)-1
    df.rename(index={x:'DDA'},inplace=True)

    # Fixing date formatting
    for i in range(0,len(df.index)):
        if(df['MATURITY_DATE'][i] != ''):
            date = df['MATURITY_DATE'][i]
            df['MATURITY_DATE'][i] = date.strftime('%Y-%m-%d')


    print("DDA row has been added to the bottom - ✔")
    # Delete not needed DDA row
    #df.drop('DDA1',inplace=True)
    
    #df.to_csv('inputRawFile.csv')

###############################################################################################################################
# Calls all functions
def fixFile():
    emptyMaturity()
    sortByMaturity()
    removeRows()
    addAmountColumn()
    convertToUSD()
    removeColumns()
    insertDDA()
    #df1 = df[['MATURITY_DATE','USD_AMOUNT']]
    #df1.reset_index(drop=True,inplace=True)
    #df1.to_csv('inputRawFile.csv',index=True)