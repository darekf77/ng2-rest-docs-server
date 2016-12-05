
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/clientCard/clientPublicData') {
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
		
		company_name: $(
                	consumer('Eniro'),
                	producer(regex('.+'))
            	) ,
		email_address: $(
                	consumer('eniro@biuro.com'),
                	producer(regex('.+'))
            	) ,
		telephone: $(
                	consumer('+48 002020202'),
                	producer(regex('.+'))
            	) ,
		webpage_and_social_media: $(
                	consumer('www.eniro.com'),
                	producer(regex('.+'))
            	) ,
		street: $(
                	consumer('Piłsudskiego'),
                	producer(regex('.+'))
            	) ,
		house_num: $(
                	consumer('23'),
                	producer(regex('.+'))
            	) ,
		appartment_num: $(
                	consumer('23'),
                	producer(regex('.+'))
            	) ,
		post_office_code: $(
                	consumer('01-864'),
                	producer(regex('.+'))
            	) ,
		city: $(
                	consumer('Warszawa'),
                	producer(regex('.+'))
            	) ,
		elid: $(
                	consumer('1'),
                	producer(regex('.+'))
            	) ,
		lastUpdate: $(
                	consumer('1467808021'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    