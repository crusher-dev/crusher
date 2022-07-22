export interface DeploymentReadyEvent {
    type: "deployment-ready"
    payload: {
      deployment: {
        id: string
        meta?: { [key: string]: string }
        name: string
        url: string
        inspectorUrl: string
      }
      links: {
        deployment: string
        project: string
      }
      deploymentId: string
      name: string
      plan: string
      project: string
      projectId: string
      regions: string[]
      target?: ("staging" | "production") | null
      type: "LAMBDAS"
      url: string
    }
    clientId: string
    createdAt: number
    id: string
    ownerId: string
    region?: string | null
    teamId?: string | null
    userId: string
    webhookId: string
  }

