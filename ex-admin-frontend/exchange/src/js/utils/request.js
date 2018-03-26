export default class Request
{
	constructor()
	{
		this.departments = localStorage.getItem("departments") || this.getDepartments() || {};

		//localStorage.setItem("username", "John");
	}

	/**
	 *
	 */
	getDepartments()
	{
		// Cors-anywhere server
		let corsUrl = 'https://nullso-cors-anywhere.herokuapp.com/';
		// Main server url
		let serverUrl = 'https://nullso.herokuapp.com/api/departments';

		let clientId     = 'android';
		let clientSecret = 'qwe12FFGhgfh44SDDfgnmh6Hg54';

		return fetch(corsUrl + serverUrl, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
		        'Authorization': 'Basic ' + btoa(clientId + ":" + clientSecret)
			}
		})
			.then(response => response.json())
			.then(json => console.log(json))
			.catch(error => console.log('Authorization failed : ' + error.message));
	}
}