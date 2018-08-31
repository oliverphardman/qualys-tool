baseURL = "https://qualysapi.qualys.com/api/"
auth = false

function getRequest(endpoint) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['username', 'password'], function(result) {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//Request completed
					resolve(this.responseXML)
				} else if (this.readyState == 4 && this.status == 401) {
					//Request completed
					reject(401)
				}
			}
			xhttp.open("GET", baseURL + endpoint, true)
			xhttp.setRequestHeader("X-Requested-With", "QualysTool")
			xhttp.setRequestHeader("Authorization", "Basic " + btoa(result.username + ":" + result.password));
			xhttp.send()
		})
	})
}

function postRequest(endpoint, parameters) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['username', 'password'], function(result) {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//Request completed
					resolve(this.response)
				} else if (this.readyState == 4 && this.status == 401) {
					//Request completed
					reject(401)
				}
			}
			xhttp.open("POST", baseURL + endpoint, true)
			xhttp.setRequestHeader("X-Requested-With", "QualysTool")
			xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhttp.setRequestHeader("Authorization", "Basic " + btoa(result.username + ":" + result.password))
			paramString = ""
			Object.keys(parameters).forEach((key) => {
				paramString += key + "=" + parameters[key] + "&"
			})
			xhttp.send(paramString)
		})
	})
}

function xmlToJson(xml) {
	// Create the return object
	var obj = {};
	if (xml.nodeType == 1) { // element
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {
		obj = xml.nodeValue;
	}
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
