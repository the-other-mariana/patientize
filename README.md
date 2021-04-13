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

### 1. Login

The webpage has a usual login view. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/login.png?raw=true)

When a user (doctor) logs in, we have the following view of her/his Profile tab. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/profile-tab.png?raw=true)

### 2. Templates

The webpage allows the user to customize their forms to capture their patients information. This process begins at the Templates tab. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/template-tab.png?raw=true)

### 2.1 Create a Template

If you click on Add Template, the following appears, prompting the user to first title their new template.<br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/new-template-02.png?raw=true)

To add a custom field to your template, you click on Add Field button. Then you name your field and choose its type of data: date, text, big text or a yes/no question. When you finish, it would look something like this. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/new-template-fields-02.png?raw=true)

Click on Save, and your Dosis Change template is ready for use. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/template-added-02.png?raw=true)

### 2.2 Use the Template

To see how your template works, go to Patients tab. Click on Add Patient in order to fill all the info of your new patient. When you have an added patient, it looks as follows. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/patients-tab.png?raw=true)

Click on Details and you will see all the patient's info you asked for! Also, you will see a button that has your template's title, Dosis Change in this case. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/template-button.png?raw=true)

When you click it, your custom template now asks you the info you decided with your own fields! <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/template-form-02.png?raw=true)

After clicking on Save, your Dosis Change file is saved in your patient, with the color you chose so that you identify it quicker when you get more and more files in your patient! <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/template-form-added-02.png?raw=true)

You can now manage your patients with the information you need. Add templates as much as you wish. <br />

### 2.3 Delete a Template

By clicking on a template's red button that says 'Delete', a template is deleted and you will no longer see the button on each patient view. However, if you created a template of the deleted type, the document history remains. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/delete-template.png?raw=true) <br />

### 2.4 Edit A Document

Once in a patient view, you can choose to edit an existing -and available- document, if you click on the document's Edit button. It will appear with the doc's info so that you change only what you want. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/edit-modal-docs-03.png?raw=true) <br />

## 3. Password Recovery

If you cannot remember your Patientize user password, click on the Forgot Password? link, and you will see this screen. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/forgot-password.png?raw=true) <br />

Then, enter the email you put in your account. After that, click on Send and we will send you an email with your password. <br />

![image](https://github.com/the-other-mariana/patientize/blob/master/evidences/email-body.png?raw=true) <br />