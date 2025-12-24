// Organization types
export type OrganizationType = 'foundation' | 'technologies'

export interface OrganizationData {
  type: OrganizationType
  name: string
  subtitle?: string
  reports: number
  datasets: number
  latestReport: string
  status: 'online' | 'offline' | 'loading'
}

// Chart types for future use
export type ChartType = 'line' | 'pie' | 'bar'

export interface ChartData {
  id: string
  title: string
  type: ChartType
  category: string
  subcategory?: string
  data: DataPoint[]
}

export interface DataPoint {
  label: string
  value: number
  date?: string
}

// Report types
export interface Report {
  id: string
  title: string
  organization: OrganizationType
  date: string
  category: string
}

// Future: Wallet/Auth types for tokengating
export interface WalletState {
  isConnected: boolean
  address: string | null
  hasAccess: boolean
}
