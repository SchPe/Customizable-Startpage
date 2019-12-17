
var $ = require('jquery');

export default class DataToServerSender {
    constructor(cacheController) {
        this.cacheController = cacheController
        this.isLoggedIn = document.getElementById('data') ? true : false
        this.prepareDataTransfer()
    }



    prepareDataTransfer() {
        if(window.isLegacy) 
        window.addEventListener('beforeunload', (e) => {
            if(this.mustSendData()) {
                this.sendDataLegacy()
                window.localStorage.setItem('cardSet_updated', 'false');
            }
            return undefined;
        });
        else
            window.addEventListener('beforeunload', async (e) => {
                if(this.mustSendData()) {
                    await this.sendData() 
                    window.localStorage.setItem('cardSet_updated', 'false');
                }
                return undefined;
            });

        document.addEventListener('visibilitychange', (e) => {
            if(this.mustSendData() && (document.visibilityState === 'hidden' || document.visibilityState === 'unloaded')) {
                this.sendData()
                window.localStorage.setItem('cardSet_updated', 'false');
            }
        })
    }

    mustSendData() {
        return this.isLoggedIn && window.localStorage.getItem('cardSet_updated')==='true'
    }

    async sendData() {
        await $.ajax({
            url: "/data",
            type: "POST",
            contentType: 'text/plain',
            data: JSON.stringify(this.cacheController.getCacheData())
        }); 

    }
    async sendDataLegacy() {
        $.ajax({
            async: false,
            url: "/data",
            type: "POST",
            contentType: 'text/plain',
            data: JSON.stringify(this.cacheController.getCacheData())
        });   
    }


}

