Template.registerHelper('Hlog', function(s) {
	console.log(s)
})

Template.registerHelper('Hequal', function(a,b) {
	if(a === b)
		return true
	return false
})