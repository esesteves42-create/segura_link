import { supabase } from "@/lib/supabase";
import type { GPSPosition, TrackedIndividual } from "@/types/gps";
import type { Database, IndividualStatus, IndividualType } from "@/types/database";

type IndividualRow = Database["public"]["Tables"]["individuals"]["Row"];
type PositionRow = Database["public"]["Tables"]["positions"]["Row"];
type PositionInsert = Database["public"]["Tables"]["positions"]["Insert"];

function toGPSPosition(row: PositionRow): GPSPosition {
  return {
    id: row.id,
    individualId: row.individual_id,
    timestamp: row.recorded_at,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracy: row.accuracy,
    altitude: row.altitude ?? undefined,
    altitudeAccuracy: row.altitude_accuracy ?? undefined,
    heading: row.heading ?? undefined,
    speed: row.speed ?? undefined,
  };
}

function toTrackedIndividual(row: IndividualRow): TrackedIndividual {
  return {
    id: row.id,
    name: row.name,
    type: row.type as IndividualType,
    status: row.status as IndividualStatus,
    color: row.color,
    icon: row.icon ?? undefined,
    metadata: row.metadata as Record<string, unknown> | undefined,
  };
}

function toPositionInsert(
  individualId: string,
  position: Omit<GPSPosition, "id" | "individualId" | "timestamp"> & { timestamp?: Date | string },
): PositionInsert {
  return {
    individual_id: individualId,
    latitude: position.latitude,
    longitude: position.longitude,
    accuracy: position.accuracy,
    altitude: position.altitude ?? null,
    altitude_accuracy: position.altitudeAccuracy ?? null,
    heading: position.heading ?? null,
    speed: position.speed ?? null,
    recorded_at:
      position.timestamp instanceof Date
        ? position.timestamp.toISOString()
        : position.timestamp ?? new Date().toISOString(),
  };
}

export async function fetchIndividuals(): Promise<TrackedIndividual[]> {
  const { data, error } = await supabase
    .from("individuals")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toTrackedIndividual);
}

export async function fetchCurrentPosition(individualId: string): Promise<GPSPosition | null> {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("individual_id", individualId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? toGPSPosition(data) : null;
}

export async function fetchAllActivePositions(): Promise<Map<string, GPSPosition>> {
  const { data: individuals, error: indErr } = await supabase
    .from("individuals")
    .select("id")
    .eq("status", "active");

  if (indErr) throw indErr;

  const result = new Map<string, GPSPosition>();
  if (!individuals || individuals.length === 0) return result;

  const latest = await Promise.all(
    individuals.map(({ id }) =>
      supabase
        .from("positions")
        .select("*")
        .eq("individual_id", id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then((r) => ({ id, data: r.data })),
    ),
  );

  for (const { id, data } of latest) {
    if (data) result.set(id, toGPSPosition(data));
  }
  return result;
}

export async function fetchPositionHistory(
  individualId: string,
  startTime: Date,
  endTime: Date,
): Promise<GPSPosition[]> {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("individual_id", individualId)
    .gte("recorded_at", startTime.toISOString())
    .lte("recorded_at", endTime.toISOString())
    .order("recorded_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toGPSPosition);
}

export async function fetchRecentTrack(
  individualId: string,
  hoursAgo = 2,
): Promise<GPSPosition[]> {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - hoursAgo * 60 * 60 * 1000);
  return fetchPositionHistory(individualId, startTime, endTime);
}

export async function insertPosition(
  individualId: string,
  position: Omit<GPSPosition, "id" | "individualId" | "timestamp"> & { timestamp?: Date | string },
): Promise<GPSPosition> {
  const payload = toPositionInsert(individualId, position);
  const { data, error } = await supabase
    .from("positions")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return toGPSPosition(data);
}

export interface CreateIndividualInput {
  name: string;
  type: IndividualType;
  color?: string;
  status?: IndividualStatus;
  icon?: string;
  metadata?: Record<string, unknown>;
}

export async function createIndividual(input: CreateIndividualInput): Promise<TrackedIndividual> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("individuals")
    .insert({
      owner_id: userData.user.id,
      name: input.name,
      type: input.type,
      color: input.color ?? "#3b82f6",
      status: input.status ?? "inactive",
      icon: input.icon ?? null,
      metadata: input.metadata ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return toTrackedIndividual(data);
}

export async function updateIndividualStatus(
  individualId: string,
  status: IndividualStatus,
): Promise<void> {
  const { error } = await supabase
    .from("individuals")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", individualId);
  if (error) throw error;
}

export async function deleteIndividual(individualId: string): Promise<void> {
  const { error } = await supabase.from("individuals").delete().eq("id", individualId);
  if (error) throw error;
}
