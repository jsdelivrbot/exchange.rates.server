let counter = (data, target) =>
{
	let result = 0;
	for (let city in data)
	{
		if (data.hasOwnProperty(city))
		{
			for (let department in data[city])
			{
				if (data[city].hasOwnProperty(department) && data[city][department][target])
				{
					result++;
				}
			}
		}
	}
	return result;
};

module.exports = counter;