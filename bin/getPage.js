const https = require('https');

let options = {
	host: 'myfin.by',
	path: '/currency/minsk'
};

let result = '';

function getData(stream)
{
	stream.on('readable', function()
	{
		let data = stream.read();
		if (data) result += data;
	});

	stream.on('end', function()
	{
		console.log(result);
		console.log('The end');
	});

	/*stream.on('error', function(err)
	 {
	 if(err.code === 'ENOENT')
	 {
	 console.log("No such file or directory");
	 }
	 else
	 {
	 console.error(err);
	 }
	 });*/
}

let request = https.request(options, getData);

request.on('error', function(err)
{
	if(err.code === 'ENOENT')
	{
		console.log("No such file or directory");
	}
	else
	{
		console.error(err.message);
	}
});

request.end();

module.exports = result;