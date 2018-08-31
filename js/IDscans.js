appliances = {}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['appliances'], function(fetched) {
    fetched.appliances.APPLIANCE_LIST_OUTPUT[1].RESPONSE.APPLIANCE_LIST.APPLIANCE.forEach((appliance) => {
      appliances[appliance.NAME["#text"]] = appliance.ID["#text"]
      opt = document.createElement("option")
      opt.text = appliance.NAME["#text"]
      document.getElementById("applianceSelector").add(opt)
    })
  })
})

document.getElementById("startScanButton").addEventListener("click", function() {
	document.getElementById("startScanButton").disabled = true
  scanName = document.getElementById("scanNameField").value
  document.getElementById("scanNameField").disabled = true
  hosts = document.getElementById("hostsField").value
  document.getElementById("hostsField").disabled = true
  appliance = document.getElementById("applianceSelector").value
  document.getElementById("applianceSelector").disabled = true
  optionProfile = document.getElementById("optionProfileField").value
  document.getElementById("optionProfileField").disabled = true

  document.getElementById("startScanButton").value = "Adding hosts to Qualys..."

  ips = document.getElementById("hostsField").value

  params = {
    "action": "add",
    "ips": ips,
    "enable_vm": "1"
  }

  postRequest("2.0/fo/asset/ip/?action=add", params).then((res) => {
    document.getElementById("startScanButton").value = "Starting scans..."
        params = {
          "action": "launch",
          "scan_title": scanName,
          "option_title": optionProfile,
          "ip": ips,
          "iscanner_id": appliances[appliance]
        }
        postRequest("2.0/fo/scan/?action=launch", params).then((res) => {
          document.getElementById("startScanButton").value = "Scans started!"
        }).catch((err) => {
          document.getElementById("startScanButton").value = "Error"
        })
  }).catch((err) => {
    document.getElementById("startScanButton").value = "Error"
    console.error(err)
  })
})
