#!/usr/bin/env python

from flask import Flask, jsonify, request
import time

app = Flask(__name__)

services = []

class Service:
    def __init__(self, name):
        self.__name = name
        services.append(self)

    def getName(self):
        return self.__name
    
    def setName(self, name):
        self.__name = name

@app.route("/about.json")
def about():
    data = {
        "client": {
            "host": request.remote_addr
        },
        "server": {
            "current_time": int(time.time())
        }
    }
    return jsonify(data)


