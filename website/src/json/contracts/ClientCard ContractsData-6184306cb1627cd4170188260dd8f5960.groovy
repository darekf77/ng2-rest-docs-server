
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientCard/contractsData') {
                queryParameters {
			parameter 'elid' : 
			value(consumer(matching('.+')),
			producer('292323')
		)
}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		
		id: $(
                	consumer('32136'),
                	producer(regex('.+'))
            	) ,
		timestamp: $(
                	consumer('1465887275489'),
                	producer(regex('.+'))
            	) ,
		client_first_name: $(
                	consumer('Robert'),
                	producer(regex('.+'))
            	) ,
		client_last_name: $(
                	consumer('Smoliński'),
                	producer(regex('.+'))
            	) ,
		status: $(
                	consumer('status'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    