import firebaseConfig from "../../../../crusher-shared/config/fire-config-server.js";
import { Service } from "typedi";
import firebase from "firebase";

@Service()
export default class FirebaseService {
	private userDataReference: any;
	private docsInFirestore: any;
	private userID: any;
	private firebaseService: any; 

	constructor() {
		try {
			if (!firebase.apps.length) {
				firebase.initializeApp(firebaseConfig);
			} else {
				firebase.app();
			}
		} catch (err) {
			if (!/already exists/.test(err.message)) {
				console.error("Firebase initialisation error", err.stack);
			}
		}

		this.firebaseService = firebase;
	}

	async createConnection(userID: number) {
		this.userID = userID;
		this.userDataReference = this.firebaseService.firestore().collection("onboarding").doc(`${userID}`);
		this.userDataReference
			.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					// if the document exists, we just get the data in the document
					this.userDataReference.onSnapshot((doc) => {
						let data = doc.data();
						this.docsInFirestore = { ...data };
					});
				} else {
					// if the document does not exist, we insert data into the document
					this.userDataReference.set({
						create2tests: false,
						totalNumberOfTests: 0,
					});
				}
			})
			.catch((err) => console.error(err));
	}

	async insertNumberOfTests(numberOfTestsInMySQL: number) {
		let numberOfTestsInFirebase: number = this.docsInFirestore.totalNumberOfTests;
		let totalNumberOfTests = Math.max(numberOfTestsInFirebase, numberOfTestsInMySQL);

		try {
			this.userDataReference.update({ totalNumberOfTests });
			if (totalNumberOfTests >= 2) {
				this.userDataReference.update({ user_id: this.userID, create2tests: true });
			}
		} catch (err) {
			console.error(err);
		}
	}
}
