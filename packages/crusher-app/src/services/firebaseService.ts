import firebase from "firebase";
import firebaseConfig from "../../../crusher-shared/config/fire-config";

export default class FirebaseService {
	private userDataReference: any;
	private docsInFirestore: any;
	private userID: any;
	private firebaseService: any;

	constructor() {
        console.log("constructor called");
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
		this.userDataReference = this.firebaseService
			.firestore()
			.collection("onboarding")
			.doc(`${userID}`);

		this.userDataReference
			.get()
			.then((docSnapshot: any) => {
				if (docSnapshot.exists) {
					// if the document exists, we just get the data in the document
					this.userDataReference.onSnapshot((doc: any) => {
                        let data = doc.data();
                        this.docsInFirestore = { ...data };
                        console.log(this.docsInFirestore);
                    });
				} else {
					// if the document does not exist, we insert data into the document
					this.userDataReference.set({
						watchIntroVideo: false,
						create2tests: false,
						reviewReports: false,
						integrate: false,
						totalNumberOfTests: 0,
						inviteTeamMembers: false,
					});
				}
			})
			.catch((err: any) => console.error(err));
    }

    async returnDataInFirestore() {
        return this.docsInFirestore;
    }
}
