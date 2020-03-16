from flask import Flask, jsonify, render_template, redirect, current_app
from pymongo import MongoClient
from bson.json_util import dumps


app = Flask(__name__)
username = 'read_only'
password = 'rJMef22QkRqPDFzk'
client = MongoClient("mongodb+srv://" + username + ":" + password + "@cluster0-paegd.mongodb.net/test?retryWrites=true&w=majority")
db = client.primary_predictions

results_collection = db['results']
fips = [fip for fip in results_collection.find()]

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/results',methods=['GET'])
def api_results():
    results_list = list(fips)
    return current_app.response_class(dumps(results_list), mimetype="application/json")
#
# @app.route('/api/accounts_query/<search>',methods=['GET'])
# def api_accounts_search(search):
#     date = accounts_collection.find().sort('date')
#     query1 = {
#     "location": {
#     "$regex": search,
#     "$options" :'i' # case-insensitive
#     }
#     }
#     account_list = list(accounts_collection.find({"$and": [query1,{"date":date[date.count() -1]['date']}]}))
#     return current_app.response_class(dumps(account_list), mimetype="application/json")


if __name__ == '__main__':
    app.run(debug=True)
