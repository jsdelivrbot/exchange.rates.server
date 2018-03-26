/**
 * @obj - object with departments data(should have according properties, like in pattern below)
 * @i - current iteration part of source obj (see ../saveCollection.js)
 * This pattern helps to save target data to the db
 */
let departmentPattern = (obj, i) => {
	return {
		city: i,
		body: obj[ i ]
	};
};

module.exports = departmentPattern;
