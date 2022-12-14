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

export type FullArtist = Artist & {
  parents: (FamilyArtistRelation & { parent: Artist })[]
  children: (FamilyArtistRelation & { child: Artist })[]
  tracks: Track[]
}
