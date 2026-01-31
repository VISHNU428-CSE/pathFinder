
export interface Point {
  x: number;
  y: number;
}

export enum Density {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum ObstacleType {
  Stairs = 'stairs',
  Escalator = 'escalator',
  Lift = 'lift',
  Ramp = 'ramp',
  NarrowPassage = 'narrow'
}

export type NavMode = 'wheelchair' | 'standard';
export type Language = 'en' | 'hi' | 'te' | 'ta' | 'ml';

export interface MapObstacle {
  type: ObstacleType;
  point: Point;
  label: string;
}

export interface NavStep {
  id: string;
  instruction: string;
  point: Point;
  density: Density;
  icon: string;
  isElevator?: boolean;
  obstacleFound?: ObstacleType;
}

export interface Path {
  id: string;
  from: string;
  to: string;
  steps: NavStep[];
  mode: NavMode;
  distance: string;
  estimatedTime: string;
}

export interface Location {
  id: string;
  name: string;
  point: Point;
  type: 'gate' | 'service' | 'checkin' | 'security';
}

export interface Airport {
  id: string;
  name: string;
  city: string;
  code: string;
  locations: Location[];
  obstacles: MapObstacle[];
}

export interface SpatialAdvice {
  tip: string;
  caution: string;
}
