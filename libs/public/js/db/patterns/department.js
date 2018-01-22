/**
 * @obj - object with departments data(should have according properties, like in pattern below)
 * @i - current iteration part of source obj (see ../saveCollection.js)
 * This pattern helps to save target data to the db
 */
let departmentPattern = (obj, i) =>
{
	return {
		city: i,
		body: obj[i]
	}
};

module.exports = departmentPattern;

/*
{
	name: i,
		cityLink: obj[i].cityLink,
	bankName: obj[i].bankName,
	title: obj[i].title,
	link: obj[i].link,
	phone: obj[i].phone,
	city: obj[i].city,
	address: obj[i].address,
	additional: obj[i].additional,
	date: obj[i].date,
	rates: {
	"byn-byn": obj[i].rates["byn-byn"],
		"byn-usd": obj[i].rates["byn-usd"],
		"byn-eur": obj[i].rates["byn-eur"],
		"byn-rub": obj[i].rates["byn-rub"],

		"usd-usd": obj[i].rates["usd-usd"],
		"usd-byn": obj[i].rates["usd-byn"],
		"usd-eur": obj[i].rates["usd-eur"],
		"usd-rub": obj[i].rates["usd-rub"],

		"eur-eur": obj[i].rates["eur-eur"],
		"eur-byn": obj[i].rates["eur-byn"],
		"eur-usd": obj[i].rates["eur-usd"],
		"eur-rub": obj[i].rates["eur-rub"],

		"rub-rub": obj[i].rates["rub-rub"],
		"rub-byn": obj[i].rates["rub-byn"],
		"rub-usd": obj[i].rates["rub-usd"],
		"rub-eur": obj[i].rates["rub-eur"]
}
}*/
