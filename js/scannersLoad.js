document.addEventListener('DOMContentLoaded', function() {
	getRequest("/2.0/fo/appliance/?action=list", []).then((res) => {
		appliances = xmlToJson(res)
		chrome.storage.local.set({
			"appliances": appliances
		}, () => {
			document.location.href = "startIDscans.html"
		})
	}).catch((err) => {
		console.error(err)
	})
})
