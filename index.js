/**
 * Copyright (c) Off Chain Data
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const axios = require("axios");
const baseUrl = "https://holidayoracle.io/api/v1"
const InvalidDateOrTimestampException =  require("./InvalidDateOrTimestampException")
const InvalidCountryException= require('./InvalidCountryException')
const CredentialsMissingException= require('./CredentialsMissingException')
const InvalidCredentialsException= require('./InvalidCredentialsException')
class HolidayOracleClient{
    /**
     * 
     * @param {string} apikey  The API KEy of the method
     * @param {string} baseUrlSuppplied The BaseUrl  of the api. Leave blank for defaults
     */
    constructor(apikey,baseUrlSuppplied= null ){
     
        this.apikey= apikey;
        
        if(!this.apikey){
            throw new CredentialsMissingException("Please supply a valid api key")
        }else{
            if(typeof apikey!=='string'){
                throw new InvalidCredentialsException("Api Key must be a string")
            }else if(apikey.length<=0){
                throw new InvalidCredentialsException("Api key must not be blank")


            }
        }
        this.baseUrl = baseUrl;
        if(baseUrlSuppplied){
            this.baseUrl = baseUrlSuppplied;
        }
         this.createAxios() ;

    }
    /**
     * A wrapper around axios instance
     */
    axios(){
        return this._axios;
    }
    /**
     * Creates the axios instance with authorization header
     */
    createAxios(){
        this._axios = axios.create({
         
            headers: {'Authorization': 'Bearer '+this.apikey,
            "Content-Type": "application/json",}
        });
    }
    /**
     * Internal Method for making requests and resolving unauthorized
     * @param {*} endpoint The endpoint of api to which request is to be made
     * @param {*} params  Request Params (POST)
     */
    ___request(endpoint, params){
        return new Promise((resolve, reject)=>{
            this.axios().post(this.baseUrl + "/"+endpoint,params).then(response=>resolve(response.data.data)).catch(ex=> {
                if(ex.response && ex.response.status == 401)
                {
                    reject(new InvalidCredentialsException("API Key Provided is invalid")) 
                }else{
                    reject(ex)
                }
            })
        })
    }
    /**
     * 
     * @param {Date} date Formats the date to the required format
     */
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
    /**
     * Call the date end point https://holidayoracle.io/docs/index.html#date
     * 
     * @param {String |Date | Number} date_or_timestamp  The date or timestamp to be queried
     * @param {String} country The country for which the date is to be queried
     * @param {Object} options Any additional options
     */
    date(date_or_timestamp, country, options = null){
        const numericRegex = /^\d+$/
        const dateFormatRgex = /(\d){4}-\d{2}-\d{2}/
        const dType = typeof date_or_timestamp;
        if(['string', 'number'].indexOf(dType) == -1 && date_or_timestamp.constructor.name!="Date"){
            throw new InvalidDateOrTimestampException("Invalid Argument:  Must be an Integer or a String")

        }
        if(dType=='string'){
            if(!numericRegex.test(date_or_timestamp)){
                if(!dateFormatRgex.test(date_or_timestamp)){
                    throw new InvalidDateOrTimestampException("Invalid Date Format: Must be in the format: YYYY-MM-DD ")

                }
            }else{

            }
        }
        if(typeof country !== 'string'){
            throw new InvalidCountryException("Country must be a string")
        }
        
        const params= options || {}
        params['date'] = date_or_timestamp;
        if(date_or_timestamp.constructor.name === "Date"){
            params['date'] = this.formatDate(date_or_timestamp);
        }
        if(!country || (typeof country == 'string' && country.length===0)){
            throw new InvalidCountryException("Country is required")
        }
        params['country'] = country
        return this.___request('date', params)
        
    }
    /**
     * Call the holidays end point https://holidayoracle.io/docs/index.html#holidays
     * 
     * @param {String} year  The year for which holidays are needed
     * @param {String} country The country for which holidays are needed
     * @param {Object} options Optional extra params
     */
    holidays(year, country	, options = null) {
        const year_type = typeof year 
        const yearRegex= /\d{4}/
        if(year_type!='string' && year_type!='number'){
            throw new InvalidDateOrTimestampException("Year should be a number or a string")
        }
        const yearto_s = year+""
        if(!yearRegex.test(yearto_s)){
            throw new InvalidDateOrTimestampException("Year should be a number with four digits")
        }
       

        if( typeof country	!='string'){
            throw new InvalidCountryException("Country must be a string")
        }

        const params = options||{}
        params.year = yearto_s
        params.country =  country	
  
        return this.___request('date/holidays',params)
    }
    /**
     * Call the locations end point https://holidayoracle.io/docs/index.html#locations
     * 
     */
    locations() {
        return this.___request('date/locations')
    }
    /**
     * Call the business-days end point https://holidayoracle.io/docs/index.html#business-days
     * 
     * @param {String | Date} date1 Start date
     * @param {String | Date} date2 End date
     * @param {String} country The country for which the date is to be queried
     * @param {Object} options Any additional options
     */
    businessDays(date1, date2, country, options = null) {
        const dateFormatRgex = /(\d){4}-\d{2}-\d{2}/
        
        if(typeof date1 == 'string' && !dateFormatRgex.test(date1)) {
            throw new InvalidDateOrTimestampException("Invalid Date Format: Must be in the format: YYYY-MM-DD ")
        }
        
        if(typeof date2 == 'string' && !dateFormatRgex.test(date2)) {
            throw new InvalidDateOrTimestampException("Invalid Date Format: Must be in the format: YYYY-MM-DD ")
        }

        if(!country) {
            throw new InvalidCountryException("Country is required")
        }
        
        const params= options || {}
        params['date1'] = date1;
        if(date1.constructor.name === "Date") {
            params['date1'] = this.formatDate(date1);
        }

        params['date2'] = date2;
        if(date2.constructor.name === "Date") {
            params['date2'] = this.formatDate(date2);
        }
        
        params['country'] = country
        return this.___request('date/business-days', params)
        
    }

}

module.exports = HolidayOracleClient;