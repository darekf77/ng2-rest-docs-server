
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientcard/registrationData') {
                queryParameters {
			parameter 'elid' : 
			value(consumer(matching('.+')),
			producer('092323')
		)
}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		
		elid: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		status: $(
                	consumer('3'),
                	producer(regex('.+'))
            	) ,
		localizationType: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		suspendedDate: $(
                	consumer('2016-06-01'),
                	producer(regex('.+'))
            	) ,
		branchesCounter: $(
                	consumer('15'),
                	producer(regex('.+'))
            	) ,
		mbsCid: $(
                	consumer('8542154'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    