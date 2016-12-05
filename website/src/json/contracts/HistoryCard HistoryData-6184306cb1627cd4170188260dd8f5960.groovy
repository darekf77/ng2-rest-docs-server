
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/historyCard/historyData') {
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
		
		important: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) ,
		actor_from: $(
                	consumer('ENIRO'),
                	producer(regex('.+'))
            	) ,
		actor: $(
                	consumer('Andrzej Wiertło'),
                	producer(regex('.+'))
            	) ,
		count: $(
                	consumer('0'),
                	producer(regex('.+'))
            	) ,
		action_name: $(
                	consumer('Edycja kontentu wizytówki'),
                	producer(regex('.+'))
            	) ,
		timestamp: $(
                	consumer('1469201918000'),
                	producer(regex('.+'))
            	) ,
		action_id: $(
                	consumer('1215'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    