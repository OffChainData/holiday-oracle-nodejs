const Sdk = require("../index.js")
const InvalidDateException = require("../InvalidDateOrTimestampException");
const InvalidCountryException= require('../InvalidCountryException')
const CredentialsMissingException= require('../CredentialsMissingException')
const InvalidCredentialsException= require('../InvalidCredentialsException')

describe("SDK", ()=>{
    const mockFn = Sdk.prototype.___request = jest.fn()
   
 
   describe("Test Construction", ()=>{
        test("it should return an instance ", ()=>{
            const tester = new Sdk("abcd");
            expect(tester).toBeInstanceOf(Sdk);
        })
        test("it should throw an exception if not provided with an api key ", ()=>{
          
          expect(()=>{ const tester = new Sdk();}).toThrow(CredentialsMissingException)
            
        })
        test("it should throw an exception if provided with an api key of invalid type ", ()=>{
          
            expect(()=>{ const tester = new Sdk(()=>{});}).toThrow(InvalidCredentialsException)
              
          })
          test("it should throw an exception if provided with an api key that's blank ", ()=>{
          
            expect(()=>{ const tester = new Sdk('');}).toThrow(CredentialsMissingException)
              
          })
    
    })

    describe("Date Method", ()=>{
        test("it throw an exception for invalid dates ", ()=>{
            const tester = new Sdk("abcd");
            expect(()=>{ tester.date('avcd', "AU")}).toThrow(InvalidDateException);
            expect(()=>{ tester.date('209kka', "AU")}).toThrow(InvalidDateException);
            expect(()=>{ tester.date(()=>{}, 10)}).toThrow(InvalidDateException);
        })
        test("it throw an exception for invalid country ", ()=>{
            const tester = new Sdk("abcd");
            expect(()=>{ tester.date(new Date(), 10)}).toThrow(InvalidCountryException);
            
        })
        test("it should return an object if correct", ()=>{
            const tester = new Sdk("abcd")
            expect.assertions = 1
            const obj= {date:"FAKE"}

            mockFn.mockImplementation(()=>{
                return new Promise((resolve, reject)=>{
                    resolve(obj)
                })
            })
            return expect(tester.date(new Date(), "AU")).resolves.toEqual(obj)
        })
    })

    describe("Holiday Method", ()=>{
        test("it throw an exception for invalid years ", ()=>{
            const tester = new Sdk("abcd");
            expect(()=>{ tester.holidays('avcd', "AU")}).toThrow(InvalidDateException);
            expect(()=>{ tester.holidays('209kka', "AU")}).toThrow(InvalidDateException);
            expect(()=>{ tester.holidays(()=>{}, 10)}).toThrow(InvalidDateException);
        })
        test("it throw an exception for invalid country ", ()=>{
            const tester = new Sdk("abcd");
            
            expect(()=>{ tester.holidays(2009, 10)}).toThrow(InvalidCountryException);
            
        })
        test("it should return an array if successful", ()=>{
            const tester = new Sdk("abcd")
            expect.assertions = 1
            const arr= [{date:" fake"}]

            mockFn.mockImplementation(()=>{
                return new Promise((resolve, reject)=>{
                    resolve(arr)
                })
            })
            return expect(tester.holidays(2006, "AU")).resolves.toEqual(arr)
        })

        
    

    })
})
