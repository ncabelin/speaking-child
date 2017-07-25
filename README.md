# Speaking Child
----------------

MEAN Stack application that assists parents/caregivers in monitoring and developing their kid's speech therapy.

1. Add words to a database of words, show words and filter by search term
2. If you add 2 or more words the element will be saved as a phrase
3. Display statistics (single words, 2 word phrases, 3 word phrases, different sounds)
4. Display history line graph of progress via d3 (in progress...)
5. A guide is present that contains recommended words to practice and shows which words are already in the child's vocabulary

## To Do
1. Add admin panel
2. Add 'forgot password'


## Restful API Dependencies
1. express
2. morgan
3. mongoose
4. crypto
5. body-parser
6. jsonwebtoken
7. passport
8. passport-local
9. express-jwt

## Angular 1.x Dependencies


## API Route Structure

GET - /home
GET - /register
GET - /login
GET - /words = add, edit, delete words
				/words
				/stats
GET - /goals = add, edit, delete goals
				/stats
GET - /progress

## File Structure
```
server.js - combine all server code together
/app_api
	/config
		config.js - contains secret key and mongodb uri
		passport.js - use passport Local strategy as middleware
	/controllers
		auth.js - authentication code
		words.js - CRUD for word
		goals.js - CRUD for goals
		progress.js - display stats, graphs
		admin.js -

	/models
		users.js - user model, with validating and setting passwords
		words.js - word model
		goals.js - goal model
		guide.js -

	/routes
		routes.js

/app_client
```

List a child's

```
User
	_id
	username
	email
	password (hash, salt)
	child_name
	dob
	words - array of ObjectId
	date_signedup

Words
	_id
	user_id
	word
	sound
	category
	date_added

Guide
	_id
	word
	category

```

## CLIENT SIDE ANGULAR

### Folder Structure
```
/app_client
	index.html -
	core.js -
	/auth
		auth.controller.js
		auth.view.html
	/word
		word.controller.js
		word.view.html
	/goal
		goal.controller.js
		goal.view.html
	/common
		/directives
			/navigation
		/services
			auth.service.js

	/css
	/js
	/images

```
