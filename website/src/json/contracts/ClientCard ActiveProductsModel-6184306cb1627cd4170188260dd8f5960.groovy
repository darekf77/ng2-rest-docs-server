
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientCard/activeProductsModel') {
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
                	consumer('123123123'),
                	producer(regex('.+'))
            	) ,
		type: $(
                	consumer('gwarancja'),
                	producer(regex('.+'))
            	) ,
		start_date: $(
                	consumer('1466064873407'),
                	producer(regex('.+'))
            	) ,
		end_date: $(
                	consumer('1468734271873'),
                	producer(regex('.+'))
            	) ,
		label: $(
                	consumer('Panorama Firm'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    