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

export interface DeploymentPreparedEvent {
  type: "deployment-prepared"
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

export interface DeploymentCreatedEvent {
  type: "deployment"
  payload: {
    alias?: string[]
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
    target?: ("staging" | "production") | null
    projectId: string
    regions: string[]
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
