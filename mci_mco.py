from operator import index
import pandas as pd
import numpy as np

############################## MCIMCO ###################################

test = pd.read_csv('test.csv',index_col=0)
 
def addRow(name,date,amount):
    row = {
        'name': [name],
        'date': [date],
        'amount': [amount]
    }
    frame = pd.DataFrame(row)
    frame.to_csv('test.csv', mode='a', index=False, header=False)

    print(test)
    print("Row added sucessfully!")


def sortDate():
    test["date"] = pd.to_datetime(test["date"])
    result = test.sort_values(by='date')
    result.to_csv('test.csv')

    print(result)
    print("Dates sorted sucessfully!")

########################## REAL EXAMPLE ################################

sheet = pd.read_csv('mci-mco.csv',index_col=0)

def sortMaturity():
    sheet["MATURITY_DATE"] = pd.to_datetime(sheet["MATURITY_DATE"])
    result = sheet.sort_values(by='MATURITY_DATE')
    result.to_csv('mci-mco.csv')

    print("Maturity dates sorted sucessfully!")

sortMaturity()