
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/localizationModel') {
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
		
		elid: $(
                	consumer('092353'),
                	producer(regex('.+'))
            	) ,
		is_central: $(
                	consumer('true'),
                	producer(regex('.+'))
            	) ,
		name: $(
                	consumer('Milion Bułek Sp. z o.o.'),
                	producer(regex('.+'))
            	) ,
		companyType: $(
                	consumer('centrala'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    