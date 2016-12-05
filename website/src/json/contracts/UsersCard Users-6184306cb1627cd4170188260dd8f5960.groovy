
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/usersCard/users') {
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
		
		starred: $(
                	consumer('false'),
                	producer(regex('.+'))
            	) ,
		photo: $(
                	consumer('null'),
                	producer(regex('.+'))
            	) ,
		title: $(
                	consumer(''),
                	producer(regex('.+'))
            	) ,
		last_name: $(
                	consumer('Byrd'),
                	producer(regex('.+'))
            	) ,
		first_name: $(
                	consumer('Isabelle'),
                	producer(regex('.+'))
            	) ,
		id: $(
                	consumer('9793'),
                	producer(regex('.+'))
            	) 
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    