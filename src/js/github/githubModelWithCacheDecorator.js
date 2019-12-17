const githubString = 'github'
const localStorageKeys = {lastRead:'lastReadAt356' + githubString, notifications: 'notifications453' + githubString,  xPollInterval: 'x-poll-interval' + githubString}

export default class GithubModelWithCacheProxyDecorator  {

    constructor(githubModel, dataFormatter) {
        this.githubModel = githubModel
        this.dataFormatter = dataFormatter
    }


    async getContent({owner, repo}) {
        var lastRead = parseInt( window.localStorage.getItem( localStorageKeys.lastRead + (owner + repo ) )  || '-1' );
        var xPollInterval = parseInt( window.localStorage.getItem(localStorageKeys.xPollInterval + (owner + repo)) || '-1' );
        let res;
        if(lastRead === -1 || Date.now() > lastRead + xPollInterval*1000 + 60*1000) {
            lastRead = new Date()
            res = await this.githubModel.getContent(arguments[0])
            res = this.dataFormatter.formatData(res)

            if(res.status == 200 ) {
                window.localStorage.setItem(localStorageKeys.notifications + (owner + repo), JSON.stringify(res));
                window.localStorage.setItem(localStorageKeys.lastRead + (owner + repo), lastRead.getTime()); 
                window.localStorage.setItem(localStorageKeys.xPollInterval + (owner + repo), res.headers.get(localStorageKeys.xPollInterval));
            }
        }
        else res = JSON.parse(window.localStorage.getItem(localStorageKeys.notifications + (owner + repo)));
        if(res.content.length==0) throw new Error("No new notifications")
        return res;
    }


    async getMoreContent(query){
        let res =  await this.githubModel.getMoreContent(query)
        return this.dataFormatter.formatData(res)
    }

    async markAsRead(query) {
        let cachedObject = JSON.parse(window.localStorage.getItem(localStorageKeys.notifications + (query.owner + query.repo)));
        await this.githubModel.markAsRead(query)
        let index = cachedObject.content.findIndex(element => {return element.id == query.threadID})
        if(index !== -1) cachedObject.content.splice(index, 1)
        window.localStorage.setItem(localStorageKeys.notifications + (query.owner + query.repo), JSON.stringify(cachedObject));
        if(Object.entries(cachedObject.content).length === 0) throw new Error('No new notifications')   
    }


    async markAllAsRead(query) {
        query.lastRead = window.localStorage.getItem(localStorageKeys.lastRead + (query.owner + query.repo)), 
        await this.githubModel.markAllAsRead(query)
        window.localStorage.setItem(localStorageKeys.notifications + (query.owner + query.repo), JSON.stringify({content: []}));
    }

    githubAuth() {
        this.githubModel.githubAuth()
    }
}
