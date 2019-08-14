const express = require('express');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const Joi = require('joi');
const app = express();
const courses = [
	{id:1 , name: 'course1'},
	{id:2 , name: 'course2'},
	{id:3 , name: 'course3'},
];

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use((req,res,next) =>{
	console.log('Authenticating.........');
	next();
});

app.use(logger);

//configuration 
console.log('Application Name:'+ config.get('name'));
console.log('Mail Server:'+ config.get('mail.host'));


// environement 

if (app.get('env') === 'development'){
	app.use(morgan('tiny'));
	console.log('Morgan enabled...');
}



app.get('/',(req,res) => {
	res.send('hello world !!');
});
app.get('/api/courses',(req,res) =>{
	res.send(courses);
});

app.get('/api/courses/:id', (req,res) =>{
	let   course = courses.find(c => c.id === parseInt(req.params.id));
	res.send(course);
});


app.post('/api/courses',(req,res) => {
	const schema = {
		name: Joi.string().min(3).required()
	};
	const result = Joi.validate(req.body , schema );
	if (result.error) return res.status(404).send(result.error.details[0].messsage); 


	const course={
		id: courses.length+1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);
});

app.put('/api/courses/:id',(res,req) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course) return res.status(404).send('The course with the given name ID was not found ....');
	
	
	const {error} = validationCourse(req.body);
	if (error) return res.status(404).send(result.error.details[0].messsage);

	course.name = req.body.name;
	res.send(course);

});



app.delete('/api/courses/:id',(req,res) =>{
		
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course) return res.status(404).send('The course with the given name ID was not found ....');

	const index = courses.indexOf(course);
	courses.splice(index,1);

	res.send(course);
		
});

const port = process.env.PORT || 3000 ;
app.listen(port , () => console.log('Listenting on port ${port}......'));



function validationCourse(course){
	const schema = {
	name: Joi.string().min(3).required()
	};
	return Joi.validate(course , schema );
}


