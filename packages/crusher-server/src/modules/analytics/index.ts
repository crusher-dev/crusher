
import { Analytics } from "@crusher-shared/modules/analytics/AnalyticsManager";
import { ServerEventsEnum } from "@crusher-shared/modules/analytics/constants";
import { ProjectsService } from "@modules/resources/projects/service";
import { TeamsService } from "@modules/resources/teams/service";
import Container from "typedi";

const teamsService = Container.get(TeamsService);

class AnalyticsManager {
    static async identifyUser(projectId, teamId){ 
        const customEmail = `gp-${projectId}`

        const team = await teamsService.getTeam(teamId);
        await Analytics.identifyUser({
            userId: customEmail,
            email: team.teamEmail,
            anonymousId: null,
            traits: {
                teamID: teamId,
            }
        }, false);
        
        await Analytics.identifyGroup({
            groupId: `team-${teamId}`,
            userId: customEmail,
            traits: {
                name: team.name,
                email: team.teamEmail,
                plan: team.tier,
            }
        });
    }



    static async trackEvent(projectId, event: ServerEventsEnum, properties: any) {
        Analytics.trackProject({
            projectId: projectId,
            event: event,
            properties: properties
        });
    }
}

export { AnalyticsManager };