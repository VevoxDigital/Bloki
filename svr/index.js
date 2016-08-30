console.log('Hey there! Just a sec while things are set up.');

const spawn = require('child_process').spawn;

const jar = spawn('java', ['-jar', __dirname + '/../jars/spigot-1.10.2.jar'], { cwd: 'servers/test-1' });

jar.stdout.on('data', (data) => {
  console.log(data.toString());
});
jar.stderr.on('data', (data) => {
  console.log(data.toString());
});

process.stdin.on('data', (data) => {
  jar.stdin.write(new Buffer(data));
});

jar.on('close', () => {
  console.log('closed');
})
