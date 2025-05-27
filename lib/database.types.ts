export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          phone: string | null
          company: string | null
          message: string | null
          source: string | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          phone?: string | null
          company?: string | null
          message?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          phone?: string | null
          company?: string | null
          message?: string | null
          source?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
          metadata?: Json | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          published: boolean
          published_at: string | null
          author_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
    }
  }
} 