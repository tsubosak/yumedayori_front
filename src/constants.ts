export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT

if (!API_ENDPOINT) {
  throw new Error("NEXT_PUBLIC_API_ENDPOINT env is not defined")
}

export const PARENT_TYPE_JA_BY_CHILD = {
  CONSIST_OF: "メンバー",
  VOICED_BY: "声優",
}

export const PARENT_TYPE_JA_BY_PARENT = {
  CONSIST_OF: "所属",
  VOICED_BY: "声優担当",
}

export const CREDITED_AS_JA = {
  COMPOSER: "作曲",
  LYRICIST: "作詞",
  ARRANGER: "編曲",
}

export const GRAPH_LABEL_JA = {
  BY: "歌唱",
  TRACK_OF: "収録",
  CONSIST_OF: "メンバー",
  VOICED_BY: "声優",
}
