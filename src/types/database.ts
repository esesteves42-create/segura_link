export type IndividualType = "person" | "vehicle" | "asset";
export type IndividualStatus = "active" | "inactive" | "warning" | "emergency";
export type SensorType = "agriculture" | "security" | "geology";
export type SensorStatus = "active" | "warning" | "error" | "offline";
export type ReadingType = "temperature" | "humidity" | "soil_moisture" | "motion";
export type AlertType = "error" | "warning" | "info" | "success";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      individuals: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: IndividualType;
          status: IndividualStatus;
          color: string;
          icon: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: IndividualType;
          status?: IndividualStatus;
          color: string;
          icon?: string | null;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          name?: string;
          type?: IndividualType;
          status?: IndividualStatus;
          color?: string;
          icon?: string | null;
          metadata?: Record<string, unknown> | null;
        };
      };
      positions: {
        Row: {
          id: string;
          individual_id: string;
          latitude: number;
          longitude: number;
          accuracy: number;
          altitude: number | null;
          altitude_accuracy: number | null;
          heading: number | null;
          speed: number | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          individual_id: string;
          latitude: number;
          longitude: number;
          accuracy: number;
          altitude?: number | null;
          altitude_accuracy?: number | null;
          heading?: number | null;
          speed?: number | null;
          recorded_at?: string;
        };
        Update: never;
      };
      sensors: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: SensorType;
          status: SensorStatus;
          latitude: number | null;
          longitude: number | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: SensorType;
          status?: SensorStatus;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          name?: string;
          type?: SensorType;
          status?: SensorStatus;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Record<string, unknown> | null;
        };
      };
      sensor_readings: {
        Row: {
          id: string;
          sensor_id: string;
          reading_type: ReadingType;
          value: number;
          unit: string;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          sensor_id: string;
          reading_type: ReadingType;
          value: number;
          unit: string;
          recorded_at?: string;
        };
        Update: never;
      };
      alerts: {
        Row: {
          id: string;
          owner_id: string;
          type: AlertType;
          title: string;
          message: string;
          related_sensor_id: string | null;
          related_individual_id: string | null;
          acknowledged: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: AlertType;
          title: string;
          message: string;
          related_sensor_id?: string | null;
          related_individual_id?: string | null;
          acknowledged?: boolean;
        };
        Update: {
          acknowledged?: boolean;
        };
      };
    };
  };
}
