document.getElementById("loginButton").addEventListener("click", function() {
	document.getElementById("loginButton").disabled = true
	verifyLogin()
})

function verifyLogin() {
	username = document.getElementById("usernameField").value
	password = document.getElementById("passwordField").value
	chrome.storage.local.set({
		"username": username,
		"password": password
	}, () => {
		getRequest("2.0/fo/asset/host/?action=list").then((response) => {
			document.location.href = "main.html"
		}).catch((err) => {
			if (err == 401) {
				document.getElementById("loginButton").disabled = false
				alert("Authentication failed!")
			} else {
				document.getElementById("loginButton").disabled = false
				alert("Error!")
			}
		})
	})
}

function isUserAuthd() {
	return auth
}
