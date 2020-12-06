# Patientize

Patientize is a prototype of web app that allows doctors to log in and maintain a patient database. <br />

## Specifications

- Backend
	- Express
	- MongoDB
- Frontend
	- Handlebars
	- Bootstrap 4

## Get Started

1. Install `Node.js v10.15.3`.<br />
2. Download and install MongoDB Service from [here](https://www.mongodb.com/es).<br />
3. Download this whole repository.<br />

## Usage

1. Download this repo. <br />
2. Look for `Services` in Windows search field. <br />
3. Once on Services, look for `MongoDB Server` and right-click on `Start`. <br />
4. Go to your folder's directory where this repo was stored. <br />
5. Type on Powershell: `npm start`. <br />
6. Open a web browser and type: `localhost:8000`. <br />

*Note: The repo includes all the node_modules folder, so there is no need to run `npm install`*

## Output

The app starts with a simple login. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/login.png?raw=true) <br />

You can register as follows: <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/register.png?raw=true) <br />

When you enter and edit your information it looks like this: <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/edit-info.png?raw=true) <br />

Now, the profile view of a doctor user would look like below. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/profile-view-02.png?raw=true) <br />

If you click on the `Patients` tab, you see the following: <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/patients-view.png?raw=true) <br />

By clicking on `Add Patient` button, you see the form below. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/add-patient.png?raw=true) <br />

After filling a New Patient form and clicking on `Save`, the patient appears as below. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/added-patient-02.png?raw=true) <br />

If you click on `Details` button of a patient, you get to see the page with all her/his info. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/patient-details-02.png?raw=true) <br />

Whenever a doctor is in a patient's detail view, he/she can add a Clinical Record to the patient, which triggers the form below. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/new-record-form.png?raw=true) <br />

Then, the new record is added and looks as follows. <br />

![alt text](https://github.com/the-other-mariana/patientize/blob/master/evidences/add-record.png?raw=true) <br />
