

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Google Cloud / Apigee / Dialogflow Demo - TV Guide

## Setup Locally

1. This demo requires node js on your machine: `node -v` && `npm -v`
2. Clone project `git clone https://github.com/savelee/tvguide-dialogflow-apigee.git`
3. Navigate into the cloned folder
4. Run `npm install`
5. Rename the file **env.txt** to **.env**
6. Open **.env** in your edit; add the API keys for Trakt.tv, which you can get from: https://trakt.tv/oauth/applications/

### Run Locally

`npm start`

Open http://localhost:3000/myshows?json=1

## Deploy to AppEngine

1. Modify **app.yaml**
2. Type: `gcloud app deploy`

## Setup Apigee

1. Create an Apigee account: http://www.apigee.com/edge
2. Login into Apigee: http://www.apigee.com/login
3. Select Develop > Api Proxies > + Proxy (button in top)
4. Choose **Hosted Target**
5. Proxy Name: tvguide
6. Base Path: **/v1/tvguide** (all API call will look like this)
7. Source: Existing