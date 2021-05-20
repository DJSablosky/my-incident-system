var API_ENDPOINT = 'https://d98w8xrrc1.execute-api.us-east-1.amazonaws.com/dev/incidents';

var app = new Vue({
    el: "#app",

    data: {
        incidents: null,
        updatedTime: null,
        submitStatus: null,
        getOneStatus: null,
        singleIncident: {IncidentTitle: "", IncidentDate: "", IncidentStatus: "", IncidentDescription: "", IncidentType: ""},
        editIncident: {IncidentTitle: "", IncidentDate: "", IncidentStatus: "", IncidentDescription: "", IncidentType: ""},
        incidentTitle: "",
        incidentDate: "",
        incidentStatus: "",
        incidentDescription: "",
        incidentType: "",
        editTitle: "",
        editDate: "",
        editStatus: "",
        editDescription: "",
        editType: "",
        getTitle: "",
        getDate: ""
    },

    created: function() {
        this.clearNewIncident();
        this.fetchData();
    },

    methods: {
        fetchData: function () {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open("GET", API_ENDPOINT);
            xhr.onload = function() {
                self.incidents = JSON.parse(xhr.responseText);
                self.updatedTime = new Date();
            };
            xhr.send();
        },
        clearNewIncident: function() {
            var self = this;

            self.incidentTitle = "";
            self.incidentDate = "";
            self.incidentStatus = "";
            self.incidentDescription = "";
            self.incidentType = "";
        },
        submitData: function() {
            var xhr = new XMLHttpRequest();
            var self = this;
            
            var newIncident = {};
            self.submitStatus = "";
            
            if (self.incidentTitle !== "" && self.incidentDate !== "" &&
               self.incidentStatus !== "" && self.incidentDescription !== "" && 
               self.incidentType !== "") {
                newIncident.IncidentTitle = self.incidentTitle;
                newIncident.IncidentDate = self.incidentDate;
                newIncident.IncidentStatus = self.incidentStatus;
                newIncident.IncidentDescription = self.incidentDescription;
                newIncident.IncidentType = self.incidentType;

                xhr.open("POST", API_ENDPOINT);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        self.submitStatus = "New incident created.";
                        self.clearNewIncident();
                        self.fetchData();
                    } else {
                        self.submitStatus = "Error creating incident!";
                    }
                }
                xhr.send(JSON.stringify(newIncident));
            } else {
                self.submitStatus = "All fields are required!"
            }
        },
        deleteByTitleDate: function(incTitle, incDate) {
            var xhr = new XMLHttpRequest();
            var self = this;

            var incToDelete = {};
            incToDelete.IncidentTitle = incTitle;
            incToDelete.IncidentDate = incDate;

            xhr.open("DELETE", API_ENDPOINT + "/id");
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    self.fetchData();
                }
            }
            xhr.send(JSON.stringify(incToDelete));
        },
        getByTitleDate: function(incTitle, incDate) {
            var xhr = new XMLHttpRequest();
            var self = this;
            
            self.getOneStatus = "";
            self.singleIncident = {IncidentTitle: "", IncidentDate: "", IncidentStatus: "", IncidentDescription: "", IncidentType: ""};

            if (incTitle != null && incDate != null && incTitle !== "" && incDate !== "") {
                xhr.open("GET", API_ENDPOINT + "/id?IncidentTitle=" + incTitle + "&IncidentDate=" + incDate);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var response = JSON.parse(xhr.responseText);

                        if (response.Item == null) {
                            self.getOneStatus = "No incidents found";
                        } else {
                            self.singleIncident.IncidentTitle = response.Item.IncidentTitle;
                            self.singleIncident.IncidentDate = response.Item.IncidentDate;
                            self.singleIncident.IncidentStatus = response.Item.IncidentStatus;
                            self.singleIncident.IncidentDescription = response.Item.IncidentDescription;
                            self.singleIncident.IncidentType = response.Item.IncidentType;
                        }
                    }
                }
                xhr.send();
            } else {
                self.getOneStatus = "All fields are required!";
            }
        },
        setupEdit: function(incident) {
            var self = this;
            
            self.editTitle = incident.IncidentTitle;
            self.editDate = incident.IncidentDate;
            self.editStatus = incident.IncidentStatus;
            self.editDescription = incident.IncidentDescription;
            self.editType = incident.IncidentType;
        },
        saveEdit: function() {
            var xhr = new XMLHttpRequest();
            var self = this;
            
            var updateIncident = {};

            updateIncident.IncidentTitle = self.editTitle;
            updateIncident.IncidentDate = self.editDate;
            updateIncident.IncidentStatus = self.editStatus;
            updateIncident.IncidentDescription = self.editDescription;
            updateIncident.IncidentType = self.editType;

            xhr.open("PUT", API_ENDPOINT + "/id");
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    self.fetchData();
                }
            }
            xhr.send(JSON.stringify(updateIncident));
        }
    }
});