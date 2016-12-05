
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/dictionary') {
                queryParameters {
			parameter 'dictId' : 
			value(consumer(matching('.+')),
			producer('status_ceidg')
		)
}                
            }
        method GET
        
    }
    response {
        status: '200'
        body(
		status_ceidg: []
		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    