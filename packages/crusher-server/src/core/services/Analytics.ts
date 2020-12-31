import {Service} from "typedi";

// It's scope should be at request level
// In some cases event will be async, use other identifier to track them.
// Monitoring by team
@Service("AnalyticsService")
class AnalyticsService{
    private userId: string | null;
    private teamId: string | null;
    private projectId: string | null;

    constructor(userId:string | null, teamId: string | null,projectId: string | null) {
    	if(!userId) console.log("Tracking user with anonymous identity. Make sure to call addUser when user Sign in.")
        this.userId = userId;
        this.teamId = teamId;
        this.projectId = projectId;
    }

    trackPage(){

    }

    trackEvent(){
    }

    trackCustomEvent(){

    }

    addGroupId(){

    }

    addGroupTrait(){

    }

    addUserId(){

    }

    addUserTrait(){

    }

}
