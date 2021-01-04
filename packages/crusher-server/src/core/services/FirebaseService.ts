import fire from "../../../../crusher-shared/config/fire-config-server.js";
import { Service } from "typedi";

@Service()
export default class FirebaseService {
	private userRef: any;
	private docsInFirestore: any;
	private userID: any;

	async createConnection(userID: number) {
		this.userID = userID;
		this.userRef = fire.firestore().collection("onboarding").doc(`${userID}`);
		this.userRef
			.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					this.userRef.onSnapshot((doc) => {
						let data = doc.data();
						this.docsInFirestore = { ...data };
						console.log(this.docsInFirestore);
					});
				} else {
					this.userRef.set({
						watchIntroVideo: false,
						create2tests: false,
						reviewReports: false,
						integrate: false,
						totalNumberOfTests: 0,
						inviteTeamMembers: false,
					});
				}
			})
			.catch((err) => console.error(err));
	}

	async insertNumberOfTests(numberOfTestsInMySQL: number) {
		let numberOfTestsInFirebase: number = this.docsInFirestore.totalNumberOfTests;
		let totalNumberOfTests = Math.max(numberOfTestsInFirebase, numberOfTestsInMySQL);

		try {
			this.userRef.update({ totalNumberOfTests });
			if (totalNumberOfTests >= 2) {
				this.userRef.update({ user_id: this.userID, create2tests: true });
			}
		} catch (err) {
			console.error(err);
		}
	}
}
