
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientCard/salesServiceData') {
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
		
		telesales_rep: $(
                	consumer('Jan Nowak'),
                	producer(regex('.+'))
            	) ,
		sales_channel: $(
                	consumer('TS'),
                	producer(regex('.+'))
            	) ,
		supervisor: $(
                	consumer('Janusz Józefowicz'),
                	producer(regex('.+'))
            	) ,
		regional_sales_mng: $(
                	consumer('Jakub Kolski'),
                	producer(regex('.+'))
            	) ,
		vice_director: $(
                	consumer('Jakub Kolski Senior'),
                	producer(regex('.+'))
            	) ,
		client_status: $(
                	consumer('wydany w pracy'),
                	producer(regex('.+'))
            	) ,
		reporting_consultant_name: $(
                	consumer('Andrzej Słupecki'),
                	producer(regex('.+'))
            	) ,
		reporting_consultant_id: $(
                	consumer('5678'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    