

import {countries} from '../data/countries.js'

export default class NewsModel {

    constructor() {

    }
    
    
    
    
    
    async getContent(query) {
        let sources = query.newsQueryObject.sources
        let country = query.newsQueryObject.country
        let category = query.newsQueryObject.category
        let pageSize = query.newsQueryObject.pageSize
        
        var res;
        if(sources != null) {
            res = await fetch(`/news/content?sources=${sources}&pageSize=${pageSize}`);
        }
        else {
            res = await fetch(`/news/content?pageSize=${pageSize}&${country!=null? 'country='+country+'&' : ''}${category!=null? 'category='+category : ''}`);
        } 

        let json = await res.json();
        json = json.data
        return json;
    }
    
    async getMoreContent(query) {
        let sources = query.newsQueryObject.sources
        let country = query.newsQueryObject.country
        let category = query.newsQueryObject.category
        let pageSize = query.newsQueryObject.pageSize

        var res;
        
        if(sources != null) {
            res = await fetch(`news/content?sources=${sources}&pageSize=${pageSize}&page=${query.page}`);
        }
        else  res = await fetch(`news/content?pageSize=${pageSize}&${country!=null? 'country='+country+'&' : ''}${category!=null? 'category='+category : ''}&page=${query.page}`);
  
        let json = await res.json();
        json = json.data
        return json
    }

    async getSources({country, category, language}) {
        this.countrySource = (typeof country=="undefined" ? this.countrySource: (country=="all"? '' : `country=${country}&`));
        this.categorySource = (typeof category=="undefined"? this.categorySource: (category=="all"? '' : `category=${category}&`));
        this.languageSource = (typeof language=="undefined" ? this.languageSource: (language=="all"? '' : `language=${language}&`));
        const res = await fetch(`news/sources?${this.countrySource + this.categorySource + this.languageSource}`);
        let json = await res.json();
        json = json.data 
        return json

    }


    async getCountries() {
        return countries
    }
  
    
}
    

