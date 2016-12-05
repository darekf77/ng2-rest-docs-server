
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientcard/openingHoursData') {
                queryParameters {
			parameter 'elid' : 
			value(consumer(matching('.+')),
			producer('1')
		)
}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		
		is_break: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) ,frequency: [],[object Object],season: [],
		special_info: $(
                	consumer('Drodzy klienci w dniu 15 sierpnia 2016 nasz sklep jest zamknięty.'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    