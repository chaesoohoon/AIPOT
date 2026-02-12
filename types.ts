export enum SlideType {
  COVER = 'COVER',
  SECTION_HEADER = 'SECTION_HEADER',
  BULLET_LIST = 'BULLET_LIST',
  PROCESS_FLOW = 'PROCESS_FLOW',
  GRID_CARDS = 'GRID_CARDS',
  BIG_NUMBER = 'BIG_NUMBER',
  CLOSING = 'CLOSING',
  TIMELINE = 'TIMELINE',
  PROFILE = 'PROFILE' // New type
}

export interface SlideContent {
  id: number;
  type: SlideType;
  title?: string;
  subtitle?: string;
  body?: string[];
  highlight?: string; // For key phrases
  items?: { title: string; desc: string; icon?: string }[]; // For grids/processes
  image?: string; // For profile image
}
