
package contracts

org.springframework.cloud.contract.spec.Contract.make {
    request {
        urlPath('/invoicesCard/accountSummary') {
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
                	consumer('123'),
                	producer(regex('.+'))
            	) ,
		balance: $(
                	consumer('143'),
                	producer(regex('.+'))
            	) ,
		currency: $(
                	consumer('PLN'),
                	producer(regex('.+'))
            	) ,invoices: [[

                    		
		id: $(
                	consumer('FV 227 000 542'),
                	producer(regex('.+'))
            	) ,
		timestamp: $(
                	consumer('1469434827000'),
                	producer(regex('.+'))
            	) ,
		name: $(
                	consumer('Faktury rozliczeniowa FV 227 000 542'),
                	producer(regex('.+'))
            	) ,
		type: $(
                	consumer('obciążenie'),
                	producer(regex('.+'))
            	) ,
		amount: $(
                	consumer('23000'),
                	producer(regex('.+'))
            	) ,
		currency: $(
                	consumer('PLN'),
                	producer(regex('.+'))
            	) 

                ]]

		)

    }
    headers {
		header 'Content-Type' : 'application/json',
		header 'Accept' : 'application/json'
		}
}
    
    