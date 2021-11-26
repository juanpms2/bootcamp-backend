const elements = [0, 1, false, 2, "", 3];

const compact = (arg) => {
	if (typeof arg === "object" && !Array.isArray(arg) && arg) {
		let newObj = {};
		for (const key in arg) {
			arg[key] ? (newObj[key] = arg[key]) : false;
		}
		return newObj;
	}
	if (Array.isArray(arg)) {
		return arg.filter((item) => item);
	}
	return arg;
};

console.log(compact(123)); // 123
console.log(compact(null)); // null
console.log(compact([0, 1, false, 2, "", 3, null, undefined])); // [1, 2, 3]
console.log(compact({})); // {}
console.log(
	compact({
		price: 0,
		name: "cloud",
		altitude: NaN,
		taste: undefined,
		isAlive: false,
		isNull: null,
	})
); // {name: "cloud"}
