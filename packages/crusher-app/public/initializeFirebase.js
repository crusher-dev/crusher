var database;
var testId;
window.addEventListener("load",()=>{
	// Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyCXJJOo_fd7qkBHkGnxiD9NABvwmmR_F5A",
		authDomain: "experiment-d1283.firebaseapp.com",
		databaseURL: "https://experiment-d1283.firebaseio.com",
		projectId: "experiment-d1283",
		storageBucket: "experiment-d1283.appspot.com",
		messagingSenderId: "1078723578006",
		appId: "1:1078723578006:web:5d741551ccde0f82689ab7",
		measurementId: "G-337ETX5E8G"
	};
// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	testId = window.location.search.split("=")[1];
// Get a reference to the database service
	 database = firebase.database();
})