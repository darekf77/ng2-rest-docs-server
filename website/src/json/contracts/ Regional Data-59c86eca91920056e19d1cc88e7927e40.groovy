
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/regional/data') {
                queryParameters {
			parameter 'caregory' : 
			value(consumer(matching('.+')),
			producer('0')
		)
}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		
		name: $(
                	consumer('Polska'),
                	producer(regex('.+'))
            	) ,
		id: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		category: $(
                	consumer('0'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    