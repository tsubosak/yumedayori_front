import type { CREDITED_AS_JA } from "./constants"

export type Artist = {
  id: number
  name: string
  yomi: string
  type: "GROUP" | "INDIVIDUAL"
  createdAt: string
  updatedAt: string
}

export type FamilyArtistRelation = {
  parentId: number
  childId: number
  parentType: "CONSIST_OF" | "VOICED_BY"
}

export type Track = {
  id: number
  title: string
  createdAt: string
  updatedAt: string
}

export type Credit = { creditedAs: keyof typeof CREDITED_AS_JA }

export type FullArtist = Artist & {
  parents: (FamilyArtistRelation & { parent: Artist })[]
  children: (FamilyArtistRelation & { child: Artist })[]
  tracks: Track[]
  credits: (Credit & { track: Track })[]
}

export type Album = {
  id: number
  title: string
  artwork: string | null
  createdAt: string
  updatedAt: string
}

export type FullTrack = Track & {
  artists: Artist[]
  albums: Album[]
  credits: (Credit & { artist: Artist })[]
}

export type FullAlbum = Album & {
  tracks: Track[]
}

export type Relationships = {
  nodes: {
    groupId: "Artist" | "Track" | "Album"
    id: string
    label: string
  }[]
  edges: { source: string; target: string; label: string }[]
}
