/**
 * Recursively merge properties of two objects
 */
let mergeRecursive = (obj1, obj2) => {
	for (let prop in obj2) {
		if (obj2.hasOwnProperty(prop)) {
			if (obj1.hasOwnProperty(prop)) {
				// Property in destination object set; update its value.
				if (obj2[ prop ].constructor === Object) {
					obj1[ prop ] = mergeRecursive(obj1[ prop ], obj2[ prop ]);
				} else {
					obj1[ prop ] = obj2[ prop ];
				}
			} else {
				// Property in destination object not set; create it and set its value.
				obj1[ prop ] = obj2[ prop ];
			}
		}
	}
	return obj1;
};

module.exports = mergeRecursive;
