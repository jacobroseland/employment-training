export type Database = {
  public: {
    Tables: {
      user_app_installations: {
        Row: {
          app_id: string
          installed_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          installed_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          company_name: string
          created_at: string
          date_applied: string | null
          id: string
          job_url: string | null
          location: string | null
          next_follow_up_date: string | null
          notes: string | null
          role_title: string
          salary_range: string | null
          status: string
          updated_at: string
          user_id: string
          work_arrangement: string
        }
        Insert: {
          company_name: string
          date_applied?: string | null
          id?: string
          job_url?: string | null
          location?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          role_title: string
          salary_range?: string | null
          status?: string
          user_id: string
          work_arrangement?: string
        }
        Update: {
          company_name?: string
          date_applied?: string | null
          job_url?: string | null
          location?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          role_title?: string
          salary_range?: string | null
          status?: string
          work_arrangement?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
