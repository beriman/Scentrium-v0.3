export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_locks: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          required_action: string | null
          required_count: number | null
          required_exp: number | null
          required_level: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          required_action?: string | null
          required_count?: number | null
          required_exp?: number | null
          required_level?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          required_action?: string | null
          required_count?: number | null
          required_exp?: number | null
          required_level?: number | null
        }
        Relationships: []
      }
      business_calculations: {
        Row: {
          created_at: string | null
          id: string
          ingredients: Json
          labor_cost: number
          overhead_cost: number
          packaging_cost: number
          product_name: string
          product_size: number
          product_unit: string
          result: Json
          target_margin: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredients: Json
          labor_cost: number
          overhead_cost: number
          packaging_cost: number
          product_name: string
          product_size: number
          product_unit: string
          result: Json
          target_margin: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredients?: Json
          labor_cost?: number
          overhead_cost?: number
          packaging_cost?: number
          product_name?: string
          product_size?: number
          product_unit?: string
          result?: Json
          target_margin?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_financial_records: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          id: string
          record_date: string
          record_type: string
          reference_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          record_date: string
          record_type: string
          reference_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          record_date?: string
          record_type?: string
          reference_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_inventory: {
        Row: {
          category: string
          cost_per_unit: number
          created_at: string | null
          id: string
          last_restock_date: string | null
          name: string
          notes: string | null
          quantity: number
          reorder_point: number | null
          supplier: string | null
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          cost_per_unit: number
          created_at?: string | null
          id?: string
          last_restock_date?: string | null
          name: string
          notes?: string | null
          quantity: number
          reorder_point?: number | null
          supplier?: string | null
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          cost_per_unit?: number
          created_at?: string | null
          id?: string
          last_restock_date?: string | null
          name?: string
          notes?: string | null
          quantity?: number
          reorder_point?: number | null
          supplier?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          downvotes: number
          flag_reason: string | null
          id: string
          is_flagged: boolean
          thread_id: string
          updated_at: string | null
          upvotes: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          downvotes?: number
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          thread_id: string
          updated_at?: string | null
          upvotes?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          downvotes?: number
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          thread_id?: string
          updated_at?: string | null
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reply_id: string | null
          reporter_id: string
          status: string
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reply_id?: string | null
          reporter_id: string
          status?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reply_id?: string | null
          reporter_id?: string
          status?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_reports_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reports_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string | null
          downvotes: number
          flag_reason: string | null
          id: string
          is_flagged: boolean
          title: string
          updated_at: string | null
          upvotes: number
          views: number
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string | null
          downvotes?: number
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          title: string
          updated_at?: string | null
          upvotes?: number
          views?: number
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string | null
          downvotes?: number
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          title?: string
          updated_at?: string | null
          upvotes?: number
          views?: number
        }
        Relationships: []
      }
      forum_votes: {
        Row: {
          created_at: string | null
          id: string
          reply_id: string | null
          thread_id: string | null
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_badges: {
        Row: {
          course_id: string | null
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_badges_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_certificates: {
        Row: {
          certificate_url: string
          course_id: string
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          certificate_url: string
          course_id: string
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          certificate_url?: string
          course_id?: string
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_courses: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          instructor_id: string | null
          is_featured: boolean
          level: string
          price: number
          status: string
          thumbnail_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes: number
          id?: string
          instructor_id?: string | null
          is_featured?: boolean
          level: string
          price: number
          status?: string
          thumbnail_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          instructor_id?: string | null
          is_featured?: boolean
          level?: string
          price?: number
          status?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_enrollments: {
        Row: {
          admin_notes: string | null
          course_id: string
          created_at: string
          id: string
          payment_proof: string | null
          payment_status: string
          progress_percentage: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          course_id: string
          created_at?: string
          id?: string
          payment_proof?: string | null
          payment_status?: string
          progress_percentage?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          course_id?: string
          created_at?: string
          id?: string
          payment_proof?: string | null
          payment_status?: string
          progress_percentage?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_lessons: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_preview: boolean
          module_id: string
          order_number: number
          related_product_id: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_preview?: boolean
          module_id: string
          order_number: number
          related_product_id?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_preview?: boolean
          module_id?: string
          order_number?: number
          related_product_id?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_number: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_number: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          progress_seconds: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          progress_seconds?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          progress_seconds?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_quiz_attempts: {
        Row: {
          answers: Json | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string
          passed: boolean | null
          score: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id: string
          passed?: boolean | null
          score: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          passed?: boolean | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_quiz_questions: {
        Row: {
          correct_answer: number
          course_id: string
          created_at: string | null
          explanation: string | null
          id: string
          lesson_id: string
          options: string[]
          order: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          correct_answer: number
          course_id: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id: string
          options: string[]
          order?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          correct_answer?: number
          course_id?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: string[]
          order?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_quiz_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_time_tracking: {
        Row: {
          course_id: string
          created_at: string | null
          duration: number
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          duration: number
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          duration?: number
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_time_tracking_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_time_tracking_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          success: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      marketplace_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          order_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          order_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          order_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_order_history: {
        Row: {
          changed_by: string
          created_at: string
          id: string
          new_status: string
          notes: string | null
          order_id: string
          previous_status: string | null
        }
        Insert: {
          changed_by: string
          created_at?: string
          id?: string
          new_status: string
          notes?: string | null
          order_id: string
          previous_status?: string | null
        }
        Update: {
          changed_by?: string
          created_at?: string
          id?: string
          new_status?: string
          notes?: string | null
          order_id?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_order_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          admin_notes: string | null
          buyer_id: string
          created_at: string
          id: string
          payment_proof: string | null
          payment_status: string
          product_id: string
          quantity: number
          seller_id: string
          shipping_address: string
          shipping_method: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          buyer_id: string
          created_at?: string
          id?: string
          payment_proof?: string | null
          payment_status?: string
          product_id: string
          quantity?: number
          seller_id: string
          shipping_address: string
          shipping_method?: string | null
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          buyer_id?: string
          created_at?: string
          id?: string
          payment_proof?: string | null
          payment_status?: string
          product_id?: string
          quantity?: number
          seller_id?: string
          shipping_address?: string
          shipping_method?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_payment_info: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          brand: string
          category: string
          condition: string
          created_at: string
          description: string
          id: string
          original_price: number | null
          price: number
          seller_id: string
          size: string
          status: string
          stock: number
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          brand: string
          category: string
          condition: string
          created_at?: string
          description: string
          id?: string
          original_price?: number | null
          price: number
          seller_id: string
          size: string
          status?: string
          stock?: number
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          brand?: string
          category?: string
          condition?: string
          created_at?: string
          description?: string
          id?: string
          original_price?: number | null
          price?: number
          seller_id?: string
          size?: string
          status?: string
          stock?: number
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string
          id: string
          order_id: string
          product_id: string
          rating: number
          seller_id: string
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          rating: number
          seller_id: string
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          rating?: number
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          id: string
          is_default: boolean
          phone_number: string
          postal_code: string
          province: string
          recipient_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          phone_number: string
          postal_code: string
          province: string
          recipient_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          phone_number?: string
          postal_code?: string
          province?: string
          recipient_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_shipping_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          has_2fa: boolean | null
          id: string
          membership_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          has_2fa?: boolean | null
          id: string
          membership_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          has_2fa?: boolean | null
          id?: string
          membership_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recovery_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      temp_totp_secrets: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          secret: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          secret: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          secret?: string
          user_id?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          device_id: string
          device_name: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          last_used_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_id: string
          device_name?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          last_used_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_id?: string
          device_name?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          last_used_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_exp: {
        Row: {
          created_at: string | null
          daily_exp_gained: number
          exp_reset_date: string
          id: string
          level: number
          total_exp: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_exp_gained?: number
          exp_reset_date?: string
          id?: string
          level?: number
          total_exp?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_exp_gained?: number
          exp_reset_date?: string
          id?: string
          level?: number
          total_exp?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_learning_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "learning_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learning_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          reference_id: string | null
          thread_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          reference_id?: string | null
          thread_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          reference_id?: string | null
          thread_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learning_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_security_settings: {
        Row: {
          id: string
          last_password_change: string | null
          login_notification_email: boolean | null
          password_expiry_days: number | null
          suspicious_activity_notification: boolean | null
          trusted_devices: Json | null
          two_factor_required: boolean | null
          user_id: string
        }
        Insert: {
          id?: string
          last_password_change?: string | null
          login_notification_email?: boolean | null
          password_expiry_days?: number | null
          suspicious_activity_notification?: boolean | null
          trusted_devices?: Json | null
          two_factor_required?: boolean | null
          user_id: string
        }
        Update: {
          id?: string
          last_password_change?: string | null
          login_notification_email?: boolean | null
          password_expiry_days?: number | null
          suspicious_activity_notification?: boolean | null
          trusted_devices?: Json | null
          two_factor_required?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_totp_secrets: {
        Row: {
          created_at: string | null
          id: string
          last_used_at: string | null
          secret: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          secret: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          secret?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_exp_to_user: {
        Args: {
          user_id_param: string
          exp_amount: number
        }
        Returns: undefined
      }
      begin_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      commit_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement: {
        Args: {
          x: number
        }
        Returns: number
      }
      generate_recovery_codes: {
        Args: {
          user_id_param: string
          num_codes?: number
        }
        Returns: string[]
      }
      get_user_upvotes_received: {
        Args: {
          user_id_param: string
        }
        Returns: number
      }
      has_two_factor_auth: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      increment: {
        Args: {
          x: number
        }
        Returns: number
      }
      increment_product_views: {
        Args: {
          product_id: string
        }
        Returns: undefined
      }
      is_account_locked: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      is_trusted_device: {
        Args: {
          user_id_param: string
          device_id_param: string
        }
        Returns: boolean
      }
      lock_account: {
        Args: {
          user_id_param: string
          reason_param: string
          minutes?: number
        }
        Returns: undefined
      }
      register_trusted_device: {
        Args: {
          user_id_param: string
          device_id_param: string
          device_name_param: string
          ip_address_param: string
          user_agent_param: string
          days_valid?: number
        }
        Returns: string
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_recovery_code: {
        Args: {
          user_id_param: string
          code_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
