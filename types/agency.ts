export interface Agency {
    id: string
    name: string
    slug: string
    website_url: string | null
    logo_url: string | null
    favicon_domain: string | null
    short_description: string
    long_description: string | null
    meta_title: string | null
    meta_description: string | null
    founded_year: number | null
    headquarters: string | null
    regions_served: string[]
    team_size: string | null
    company_type: string | null
    service_tags: string[]
    industry_tags: string[]
    tool_specializations: string[]
    pricing_model: string | null
    hourly_rate_range: string | null
    minimum_project_budget: string | null
    is_verified: boolean
    is_featured: boolean
    is_active: boolean
    clutch_url: string | null
    clutch_rating: number | null
    trustpilot_url: string | null
    trustpilot_rating: number | null
    linkedin_url: string | null
    same_as_urls: string[]
    rating_avg: number
    rating_count: number
    portfolio_count: number
    contact_email: string | null
    submission_notes: string | null
    created_at: string
    updated_at: string
    last_verified_at: string | null
  }
  
  export interface AgencyReview {
    id: string
    agency_id: string
    rating: number
    comment: string | null
    reviewer_name: string | null
    reviewer_company: string | null
    project_type: string | null
    is_approved: boolean
    created_at: string
  }