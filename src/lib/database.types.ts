
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "change_requests": {
                  Row: {
                    "created_at": string,"decided_at": string | null,"decided_by": string | null,"decision_comment": string | null,"event_id": string,"id": string,"kind": Database["public"]['Enums']["change_kind"],"proposed": NonNullable<Json>,"reason": string,"requested_by": string | null,"status": Database["public"]['Enums']["request_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"decided_at"?: string | null,"decided_by"?: string | null,"decision_comment"?: string | null,"event_id": string,"id"?: string,"kind": Database["public"]['Enums']["change_kind"],"proposed"?: NonNullable<Json>,"reason": string,"requested_by"?: string | null,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Update: {
                    "created_at"?: string,"decided_at"?: string | null,"decided_by"?: string | null,"decision_comment"?: string | null,"event_id"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["change_kind"],"proposed"?: NonNullable<Json>,"reason"?: string,"requested_by"?: string | null,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "change_requests_decided_by_fkey"
      columns: ["decided_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "change_requests_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "change_requests_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "public_events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "change_requests_requested_by_fkey"
      columns: ["requested_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"club_members": {
                  Row: {
                    "can_submit": boolean,"club_id": string,"created_at": string,"role": Database["public"]['Enums']["club_role"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "can_submit"?: boolean,"club_id": string,"created_at"?: string,"role"?: Database["public"]['Enums']["club_role"],"user_id": string
                  }
                  Update: {
                    "can_submit"?: boolean,"club_id"?: string,"created_at"?: string,"role"?: Database["public"]['Enums']["club_role"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "club_members_club_id_fkey"
      columns: ["club_id"]
isOneToOne: false
      referencedRelation: "clubs"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "club_members_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"clubs": {
                  Row: {
                    "created_at": string,"description": string,"id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string,"id"?: string,"name": string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string,"id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"event_attachments": {
                  Row: {
                    "created_at": string,"event_id": string,"file_name": string,"id": string,"kind": Database["public"]['Enums']["attachment_kind"],"path": string,"size_bytes": number,"uploaded_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"event_id": string,"file_name": string,"id"?: string,"kind": Database["public"]['Enums']["attachment_kind"],"path": string,"size_bytes": number,"uploaded_by"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"event_id"?: string,"file_name"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["attachment_kind"],"path"?: string,"size_bytes"?: number,"uploaded_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_attachments_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_attachments_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "public_events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_attachments_uploaded_by_fkey"
      columns: ["uploaded_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"event_history": {
                  Row: {
                    "action": string,"actor_id": string | null,"comment": string | null,"created_at": string,"event_id": string,"from_status": Database["public"]['Enums']["event_status"] | null,"id": string,"to_status": Database["public"]['Enums']["event_status"] | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"comment"?: string | null,"created_at"?: string,"event_id": string,"from_status"?: Database["public"]['Enums']["event_status"] | null,"id"?: string,"to_status"?: Database["public"]['Enums']["event_status"] | null
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"comment"?: string | null,"created_at"?: string,"event_id"?: string,"from_status"?: Database["public"]['Enums']["event_status"] | null,"id"?: string,"to_status"?: Database["public"]['Enums']["event_status"] | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_history_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_history_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_history_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "public_events"
      referencedColumns: ["id"]
    }
                  ]
                },"event_reports": {
                  Row: {
                    "actual_attendance": number,"actual_spending": number,"event_id": string,"submitted_at": string,"submitted_by": string | null,"summary": string
                  }
                  ComputedFields: never
                  Insert: {
                    "actual_attendance": number,"actual_spending": number,"event_id": string,"submitted_at"?: string,"submitted_by"?: string | null,"summary": string
                  }
                  Update: {
                    "actual_attendance"?: number,"actual_spending"?: number,"event_id"?: string,"submitted_at"?: string,"submitted_by"?: string | null,"summary"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_reports_event_id_fkey"
      columns: ["event_id"]
isOneToOne: true
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_reports_event_id_fkey"
      columns: ["event_id"]
isOneToOne: true
      referencedRelation: "public_events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "event_reports_submitted_by_fkey"
      columns: ["submitted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"events": {
                  Row: {
                    "budget": NonNullable<Json>,"club_id": string,"created_at": string,"created_by": string | null,"description": string,"ends_at": string,"expected_participants": number,"id": string,"late_notice": boolean,"poster_path": string | null,"signup_url": string | null,"starts_at": string,"status": Database["public"]['Enums']["event_status"],"submitted_at": string | null,"title": string,"updated_at": string,"venue": string
                  }
                  ComputedFields: never
                  Insert: {
                    "budget"?: NonNullable<Json>,"club_id": string,"created_at"?: string,"created_by"?: string | null,"description"?: string,"ends_at": string,"expected_participants": number,"id"?: string,"late_notice"?: boolean,"poster_path"?: string | null,"signup_url"?: string | null,"starts_at": string,"status"?: Database["public"]['Enums']["event_status"],"submitted_at"?: string | null,"title": string,"updated_at"?: string,"venue": string
                  }
                  Update: {
                    "budget"?: NonNullable<Json>,"club_id"?: string,"created_at"?: string,"created_by"?: string | null,"description"?: string,"ends_at"?: string,"expected_participants"?: number,"id"?: string,"late_notice"?: boolean,"poster_path"?: string | null,"signup_url"?: string | null,"starts_at"?: string,"status"?: Database["public"]['Enums']["event_status"],"submitted_at"?: string | null,"title"?: string,"updated_at"?: string,"venue"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "events_club_id_fkey"
      columns: ["club_id"]
isOneToOne: false
      referencedRelation: "clubs"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"invitations": {
                  Row: {
                    "claimed_at": string | null,"club_id": string | null,"created_at": string,"email": string,"id": string,"invited_by": string | null,"role": Database["public"]['Enums']["invitation_role"]
                  }
                  ComputedFields: never
                  Insert: {
                    "claimed_at"?: string | null,"club_id"?: string | null,"created_at"?: string,"email": string,"id"?: string,"invited_by"?: string | null,"role": Database["public"]['Enums']["invitation_role"]
                  }
                  Update: {
                    "claimed_at"?: string | null,"club_id"?: string | null,"created_at"?: string,"email"?: string,"id"?: string,"invited_by"?: string | null,"role"?: Database["public"]['Enums']["invitation_role"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "invitations_club_id_fkey"
      columns: ["club_id"]
isOneToOne: false
      referencedRelation: "clubs"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invitations_invited_by_fkey"
      columns: ["invited_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "body": string,"created_at": string,"id": string,"link": string,"read_at": string | null,"title": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string,"created_at"?: string,"id"?: string,"link"?: string,"read_at"?: string | null,"title": string,"user_id": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: string,"link"?: string,"read_at"?: string | null,"title"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string,"full_name": string,"id": string,"is_src_admin": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email": string,"full_name"?: string,"id": string,"is_src_admin"?: boolean
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"is_src_admin"?: boolean
                  }
                  Relationships: [
                    
                  ]
                },"settings": {
                  Row: {
                    "key": string,"value": number
                  }
                  ComputedFields: never
                  Insert: {
                    "key": string,"value": number
                  }
                  Update: {
                    "key"?: string,"value"?: number
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "public_events": {
                  Row: {
                    "club_id": string,"club_name": string,"description": string,"ends_at": string,"id": string,"poster_path": string | null,"signup_url": string | null,"starts_at": string,"title": string,"venue": string
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "events_club_id_fkey"
      columns: ["club_id"]
isOneToOne: false
      referencedRelation: "clubs"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "can_read_event":
{ Args: { "event": string }; Returns: boolean
                           },
"is_club_member":
{ Args: { "club": string }; Returns: boolean
                           },
"is_club_president":
{ Args: { "club": string }; Returns: boolean
                           },
"is_src_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            "attachment_kind": "proposal_paper"|"advisor_form"|"sa_letter"|"report_photo"|"other","change_kind": "change"|"cancel","club_role": "president"|"committee","event_status": "draft"|"submitted"|"returned"|"rejected"|"awaiting_sa_letter"|"verifying_sa_letter"|"approved"|"cancelled","invitation_role": "src_admin"|"president"|"committee","request_status": "pending"|"approved"|"rejected"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "attachment_kind": ["proposal_paper", "advisor_form", "sa_letter", "report_photo", "other"],"change_kind": ["change", "cancel"],"club_role": ["president", "committee"],"event_status": ["draft", "submitted", "returned", "rejected", "awaiting_sa_letter", "verifying_sa_letter", "approved", "cancelled"],"invitation_role": ["src_admin", "president", "committee"],"request_status": ["pending", "approved", "rejected"]
          }
        }
} as const
