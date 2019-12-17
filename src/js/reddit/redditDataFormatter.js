

export default class RedditDataFormatter {

    formatData(content) {

        let result = [], hasImage, hasThumbnail;
        for(const entry of content.data.children) {
            hasImage = /(png|jpg|jpeg|svg|gif)$/.test(entry.data.url)
            if(!hasImage) {
                hasThumbnail = /(png|jpg|jpeg|svg|gif)$/.test(entry.data.thumbnail)
                if(hasThumbnail) entry.data.url = entry.data.thumbnail
            }
            hasImage = hasImage || hasThumbnail
            result.push({score: entry.data.score, hasImage, title: entry.data.title, url: entry.data.url, selftext_html: entry.data.selftext_html, permalink: entry.data.permalink})
        }
        return result;
    }
}

