import {makeId} from '../util/helper.js'


const localStorageKeys = {deviceID: "device_id376", token: 'token376', date: 'date376'}


const settings = require('../main/settings.js').reddit.redditModel

export default class RedditModel {

constructor() {
    
}





async getContent(query) {
    if(query.subreddit !== '') query.subreddit = /.*(r\/[a-zA-Z0-9]*)\/?$/.exec(query.subreddit)[1]
    await this.handleAuthorization()
    this.token = window.localStorage.getItem(localStorageKeys.token);
    const res = await fetch(`https://oauth.reddit.com/${query.subreddit}?limit=${query.limit}`, {
        method: "GET",
        headers: {
            "Authorization": "bearer " + this.token
        }
    });
    const json = await res.json();
    if(json.reason === "private") {
        throw new Error('Repository is private');
    }
    return json;
}



async getMoreContent(query) {
    await this.handleAuthorization()
    this.token = window.localStorage.getItem(localStorageKeys.token);
    const res = await fetch(`https://oauth.reddit.com/${query.subreddit}?limit=${query.limit}&after=${query.after}`, {
        method: "GET",
        headers: {
            "Authorization": "bearer " + this.token
        }
    });
    const json = await res.json();
    return json;
}



async handleAuthorization() {
    if(!(localStorageKeys.token in window.localStorage) || window.localStorage.getItem(localStorageKeys.token) == "undefined" || window.localStorage.getItem(localStorageKeys.date) - Date.now() < 0) {
        if(!(await this.authReddit())) {
            throw new Error('No Internet');
        }
    }
}

async authReddit() {
    this.determineDeviceID()
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {         //wird von workbox praktischerweise nicht erfasst weil es post request ist und ich workbox nur für get requests von reddit registriert habe
        method: 'Post',
        body: (`grant_type=https://oauth.reddit.com/grants/installed_client&\
device_id=${this.deviceID}`),
        headers: {
            'Authorization': `Basic ${window.btoa(settings.clientID+ ':')}`,
            'Content-Type': "application/x-www-form-urlencoded"
        }
    });
    const json = await res.json();
    this.token = json.access_token;
    if(this.token == null) {
        return false;
    }
    window.localStorage.setItem(localStorageKeys.token, this.token);
    window.localStorage.setItem(localStorageKeys.date, Date.now() + json.expires_in*1000 - 1000000);
    return true;
}

determineDeviceID() {
    if(localStorageKeys.deviceID in window.localStorage || window.localStorage.getItem(localStorageKeys.deviceID) == "undefined") {
        this.deviceID = window.localStorage.getItem(localStorageKeys.deviceID);
    }
    else {
        this.deviceID= makeId(21);
        window.localStorage.setItem(localStorageKeys.deviceID, this.deviceID);
    }
}

}
