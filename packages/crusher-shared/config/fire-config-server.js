const firebase = require("firebase");
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
	apiKey: 'AIzaSyACXjSE1qWHZ6b9feQIhNppZVxQ3dw1xec',
	authDomain: 'crusherdev-43e4e.firebaseapp.com',
	databaseURL: 'https://crusherdev-43e4e-default-rtdb.firebaseio.com',
	projectId: 'crusherdev-43e4e',
	storageBucket: 'crusherdev-43e4e.appspot.com',
	messagingSenderId: '296868563952',
	appId: '1:296868563952:web:877075f87e137fe08c6b35',
	measurementId: 'G-ENZ3E6QFG0',
};
// Initialize Firebase
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
} else {
   firebase.app(); // if already initialized, use that one
}

try {
	firebase.initializeApp(firebaseConfig);
} catch (err) {
	if (!/already exists/.test(err.message)) {
		console.error('Firebase initialization error', err.stack);
	}
}


const fire = firebase;
module.exports = fire;
