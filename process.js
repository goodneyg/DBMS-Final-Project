
const express = require('express');
const bp = require('body-parser');

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));


app.get('/', function(request, response, next){

	response.send(`
		<div class="container">
			<div class="card">
				<div class="card-header">Log in:</div>
				<div class="card-body">
					<form method="POST" action="/">
						<div class="mb-3">
							<label>First Name</label>
							<input type="text" name="first_name" id="first_name" class="form-control" />
						</div>
						<div class="mb-3">
							<label>Last Name</label>
							<input type="text" name="last_name" id="last_name" class="form-control" />
						</div>
						<div class="mb-3">
		                	<label>Email Address</label>
		                	<input type="text" name="email_address" id="email_address" class="form-control" />
		                </div>
		                <div class="mb-3">
		                	<input type="submit" name="submit_button" class="btn btn-primary" value="Add" />
		                </div>
					</form>
				</div>
			</div>
		</div>
	`);


});

app.post('/', function(request, response, next){

	response.send(request.body);

});

app.listen(2000);


