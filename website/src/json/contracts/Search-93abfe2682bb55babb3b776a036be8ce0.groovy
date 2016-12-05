
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/search') {
                queryParameters {
			parameter 'phrase' : 
			value(consumer(matching('.+')),
			producer('dup')
		)
			parameter 'pagination' : 
			value(consumer(matching('.+')),
			producer('{"number":1,"numberOfElements":10}')
		)
			parameter 'isFromLiveSearch' : 
			value(consumer(matching('ttt')),
			producer('true')
		)

		}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		content: [[

                    		
		title: $(
                	consumer('Milion Bułek 02-122 Warszawa, ul Postępu 14a'),
                	producer(regex('.+'))
            	) ,
		type: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		address: $(
                	consumer('0ul Postępu 14a'),
                	producer(regex('.+'))
            	) ,
		city: $(
                	consumer('Warszawa'),
                	producer(regex('.+'))
            	) ,
		company_name: $(
                	consumer('0Eniro'),
                	producer(regex('.+'))
            	) ,
		elid: $(
                	consumer('092323'),
                	producer(regex('.+'))
            	) ,
		agreement_num: $(
                	consumer('12323'),
                	producer(regex('.+'))
            	) ,
		companyEntityType: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		withActiveProduct: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) ,
		payingClient: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) 

                ]]
,
		isFromLiveSearch: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    