# ijob-api-dev

Convención de nombramientos

Use single quotes
Use single quotes, unless you are writing JSON.

Right:

var foo = 'bar';

Wrong:

var foo = "bar";



Opening braces go on the same line
Your opening braces go on the same line as the statement.

Right:

if (true) {
  console.log('winning');
}

Wrong:

if (true)
{
  console.log('losing');
}



Method chaining
One method per line should be used if you want to chain methods.

You should also indent these methods so it's easier to tell they are part of the same chain.

Right:

User
  .findOne({ name: 'foo' })
  .populate('bar')
  .exec(function(err, user) {
    return true;
  });

Wrong:

User
.findOne({ name: 'foo' })
.populate('bar')
.exec(function(err, user) {
  return true;
});

User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function(err, user) {
    return true;
  });

User.findOne({ name: 'foo' }).populate('bar')
.exec(function(err, user) {
  return true;
});

User.findOne({ name: 'foo' }).populate('bar')
  .exec(function(err, user) {
    return true;
  });


  Declare one variable per var statement

Declare one variable per var statement, it makes it easier to re-order the lines. However, ignore Crockford when it comes to declaring variables deeper inside a function, just put the declarations wherever they make sense.

Right:

var keys   = ['foo', 'bar'];
var values = [23, 42];

var object = {};
while (keys.length) {
  var key = keys.pop();
  object[key] = values.pop();
}

Wrong:

var keys = ['foo', 'bar'],
    values = [23, 42],
    object = {},
    key;

while (keys.length) {
  key = keys.pop();
  object[key] = values.pop();
}




Use lowerCamelCase for variables, properties and function names
Variables, properties and function names should use  lowerCamelCase . They should also be descriptive. Single character variables and uncommon abbreviations should generally be avoided.

Right:

var adminUser = db.query('SELECT * FROM users ...');

Wrong:

var admin_user = db.query('SELECT * FROM users ...');




Use UPPERCASE for Constants
Constants should be declared as regular variables or static class properties, using all uppercase letters.

Node.js / V8 actually supports mozilla's const extension, but unfortunately that cannot be applied to class members, nor is it part of any ECMA standard.

Right:

var SECOND = 1 * 1000;

function File() {
}
File.FULL_PERMISSIONS = 0777;

Wrong:

const SECOND = 1 * 1000;

function File() {
}
File.fullPermissions = 0777;




Use descriptive conditions
Any non-trivial conditions should be assigned to a descriptively named variable or function:

Right:

var isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);

if (isValidPassword) {
  console.log('winning');
}

Wrong:

if (password.length >= 4 && /^(?=.*\d).{4,}$/.test(password)) {
  console.log('losing');
}




Name your closures
Feel free to give your closures a name. It shows that you care about them, and will produce better stack traces, heap and cpu profiles.

Right:

req.on('end', function onEnd() {
  console.log('winning');
});

Wrong:

req.on('end', function() {
  console.log('losing');
});




No nested closures
Use closures, but don't nest them. Otherwise your code will become a mess.

Right:

setTimeout(function() {
  client.connect(afterConnect);
}, 1000);

function afterConnect() {
  console.log('winning');
}

Wrong:

setTimeout(function() {
  client.connect(function() {
    console.log('losing');
  });
}, 1000);






