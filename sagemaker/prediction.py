# !pip install dynamodb_json
# !pip install pmdarima

import boto3
from boto3.dynamodb.conditions import Key, Attr
import pandas as pd
from dynamodb_json import json_util as json
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings
warnings.filterwarnings("ignore")
from datetime import datetime

import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima_model import ARIMA
from pandas.plotting import register_matplotlib_converters
from pandas.tseries.offsets import DateOffset
register_matplotlib_converters()

from pmdarima import auto_arima
import statsmodels.api as sm
import pmdarima as pm
from functools import reduce

from decimal import Decimal
from pprint import pprint
from botocore.exceptions import ClientError
import uuid

# dynamodb_client = boto3.client('dynamodb', region_name="us-east-1")
dynamodb = boto3.resource('dynamodb', region_name="us-east-1", aws_access_key_id = "ASIAWNNCYTH45JJVMOVP", 
aws_secret_access_key = "tDAqzls2fCL4W7La5CCgcphvrnmg0OBLK2psp7FH", aws_session_token="FwoGZXIvYXdzEKL//////////wEaDIq5/rH7uwLHi6lHgCLGAcbQAoLSp37/wDEjWdMkNn2H5MWwZAaG4K5lCkWGrVPSsdd+XdrIr++ioP7FeTWEiZWNtavSnxWJoutRbudQUEHczBx8v/MG+I5GruO5Sf+8MEzEQSZPRX1OQ6uJAOAp/KcyOpCTr33x7rIhuR+GCJolNIJSctYVHYApDE1FuvUd/jGsJMe4OYs+ITmtvGgCQT6u6CKdZOeNunk6muWiYtW6tbU9Jga3yoxUU/2yjC0BKr5rAHDqpvtRgx47sxilrfTlqDBsoii2z+KRBjItqzfcEtovJJ9NUYE7uLDE0gxVsWGvJtJOc8H+hYr6gla1teM22kaD41qTNg/9")

table1 = dynamodb.Table('Cases')
table2 = dynamodb.Table('Deaths')

def table_get(table):
    response = table.scan()
    items = response['Items']
    # print(items)
    return items

cases = table_get(table1)
deaths = table_get(table2)

df_cases = pd.DataFrame(json.loads(cases))
df_deaths = pd.DataFrame(json.loads(deaths))

def countries(df, country):
    df_new = df[df['country'] == country]
    
    return df_new

def sort_dates(df):
    df['date'] = pd.to_datetime(df['date'])
    df.sort_values(by=['date'], inplace=True, ascending=True)
    return df

def clean_data(df):
    df['date'] = pd.to_datetime(df['date'])
    df.index = range(len(df))
    df.drop(['UUID'], axis = 1, inplace=True)
    return df

def total_cases(df, country):
    df_new = countries(df, country)
    df_new = sort_dates(df_new)
    df_new = clean_data(df_new)
    
    df_new.date = pd.to_datetime(df_new.date)
    df_new.set_index('date', inplace=True)
    
    return df_new
    

df_UK = total_cases(df_cases, 'UK')
df_USA = total_cases(df_cases, 'USA')
df_India = total_cases(df_cases, 'India')
df_Australia = total_cases(df_cases, 'Australia')
df_Canada = total_cases(df_cases, 'Canada')

def model(df):
    model=sm.tsa.statespace.SARIMAX(df['cases'],order=(1, 1, 1),seasonal_order=(1,1,1,12))
    results=model.fit()
    return results

def forecast(df):
    results = model(df)
    
    country = df['country'][0]
    
    future_dates=[df.index[-1]+ DateOffset(days=x)for x in range(0,38)]
    future_dates_df=pd.DataFrame(index=future_dates[1:],columns=df.columns)
#     future_df=pd.concat([df,future_datest_df])
    future_dates_df['country'] = country
    
    future_dates_df['forecast'] = results.predict(start = 365, end = 400, dynamic= True)  
    future_dates_df.index.name = 'date'
    return future_dates_df
#   future_df[['cases', 'forecast']].plot(figsize=(12, 8)) 
#   print(future_df)

cases_UK = forecast(df_UK)
cases_USA = forecast(df_USA)
cases_India = forecast(df_India)
cases_Australia = forecast(df_Australia)
cases_Canada = forecast(df_Canada)

d1 = cases_UK.append(cases_USA)
d2 = cases_India.append(cases_Australia)
d3 = d1.append(d2)
final_cases = d3.append(cases_Canada)
final_cases = final_cases.reset_index()
final_cases.drop(['cases'], axis = 1, inplace=True)
# final_cases # contains the full dataframe of all the total cases over the time of covid for 5 countries.

deaths_UK = total_cases(df_deaths, 'UK')
deaths_USA = total_cases(df_deaths, 'USA')
deaths_India = total_cases(df_deaths, 'India')
deaths_Australia = total_cases(df_deaths, 'Australia')
deaths_Canada = total_cases(df_deaths, 'Canada')

def model_deaths(df):
    model=sm.tsa.statespace.SARIMAX(df['deaths'],order=(1, 1, 1),seasonal_order=(1,1,1,12))
    results=model.fit()
    return results

def forecast_deaths(df):
    results = model_deaths(df)
    
    country = df['country'][0]
    
    future_dates=[df.index[-1]+ DateOffset(days=x)for x in range(0,38)]
    future_dates_df=pd.DataFrame(index=future_dates[1:],columns=df.columns)
#     future_df=pd.concat([df,future_datest_df])
    future_dates_df['country'] = country
    
    future_dates_df['forecast'] = results.predict(start = 365, end = 400, dynamic= True)  
    future_dates_df.index.name = 'date'
    return future_dates_df
#     future_df[['deaths', 'forecast']].plot(figsize=(12, 8)) 
#     print(future_df)

Deaths_UK = forecast_deaths(deaths_UK)
Deaths_USA = forecast_deaths(deaths_USA)
Deaths_India = forecast_deaths(deaths_India)
Deaths_Australia = forecast_deaths(deaths_Australia)
Deaths_Canada = forecast_deaths(deaths_Canada)

d1 = Deaths_UK.append(Deaths_USA)
d2 = Deaths_India.append(Deaths_Australia)
d3 = d1.append(d2)
final_deaths = d3.append(Deaths_Canada)
final_deaths = final_deaths.reset_index()
final_deaths.drop(['deaths'], axis = 1, inplace=True)
# final_deaths # contains the full dataframe of all the deaths from covid for 5 countries.

# Adding UUID Column in df :
def add_UUID(df):
    df['UUID'] = df.index.to_series().map(lambda x: uuid.uuid4())

add_UUID(final_cases)
add_UUID(final_deaths)

# Converting dataframe to json
import json
def df_json(df):
    df['date']=df['date'].astype(str)
    df['UUID']=df['UUID'].astype(str)
    df_js = df.to_json(orient="records") 
    df_new_js = json.loads(df_js, parse_float=Decimal)
    return df_new_js

# Deleting previous data from dynamodb
def dummy_data(table_name, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', region_name="us-east-1", aws_access_key_id = "AKIA2AIH6IZU4HIMR6YQ", 
                        aws_secret_access_key = "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")

    table = dynamodb.Table(table_name)
    table.put_item(
    Item={
        'UUID':'jsfgkj3562u',
        'title': "hello-aws",
     }
    )

dummy_data('Final_Cases')
dummy_data('Final_Deaths')

def remove_items(table_name, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', region_name="us-east-1", aws_access_key_id = "AKIA2AIH6IZU4HIMR6YQ", 
                        aws_secret_access_key = "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")

    table = dynamodb.Table(table_name)

    scan = table.scan()
    with table.batch_writer() as batch:
        for each in scan['Items']:
            batch.delete_item(
                Key={
                    'UUID': each['UUID'],
                }
            )

remove_items('Final_Cases')
remove_items('Final_Deaths')

json_cases = df_json(final_cases)
json_deaths = df_json(final_deaths)

def put_items(table_name, js, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', region_name="us-east-1", aws_access_key_id = "ASIAWNNCYTH45JJVMOVP", 
                        aws_secret_access_key = "tDAqzls2fCL4W7La5CCgcphvrnmg0OBLK2psp7FH", aws_session_token="FwoGZXIvYXdzEKL//////////wEaDIq5/rH7uwLHi6lHgCLGAcbQAoLSp37/wDEjWdMkNn2H5MWwZAaG4K5lCkWGrVPSsdd+XdrIr++ioP7FeTWEiZWNtavSnxWJoutRbudQUEHczBx8v/MG+I5GruO5Sf+8MEzEQSZPRX1OQ6uJAOAp/KcyOpCTr33x7rIhuR+GCJolNIJSctYVHYApDE1FuvUd/jGsJMe4OYs+ITmtvGgCQT6u6CKdZOeNunk6muWiYtW6tbU9Jga3yoxUU/2yjC0BKr5rAHDqpvtRgx47sxilrfTlqDBsoii2z+KRBjItqzfcEtovJJ9NUYE7uLDE0gxVsWGvJtJOc8H+hYr6gla1teM22kaD41qTNg/9")
        
    table = dynamodb.Table(table_name)  # Specifies table to be used
#     json_data = json.load(js)
    for js_data in js:
        date = js_data['date']
        UUID = js_data['UUID']
        country = js_data['country']
        forecast = js_data['forecast']

        table.put_item(
           Item={
               'date': date,
               'UUID': UUID,
               'country': country,
               'forecast': forecast,
            }
        )

# Putting the predicted data in dynamodb tables.
put_items('Final_Cases', json_cases)
put_items('Final_Deaths', json_deaths)