import { useEffect, useRef } from "react"
import G6, { IG6GraphEvent } from "@antv/g6"
import useSWR from "swr"
import { Relationships } from "../types"
import { Box } from "@mantine/core"
import { CREDITED_AS_JA, GRAPH_LABEL_JA } from "../constants"

const COLOR_BY_TYPE = {
  Artist: "#c990c0",
  Track: "#f79767",
  Album: "#57c7e3",
}

export const NeoGraph = ({ path, focus }: { path: string; focus?: string }) => {
  const swr = useSWR<Relationships>(path, null, {
    revalidateOnFocus: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
  })
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = ref.current
    if (!container || !swr.data) {
      return
    }
    const graph = new G6.Graph({
      container,
      width: container.clientWidth,
      height: 500,
      fitCenter: true,
      layout: {
        type: "force2",
        linkDistance: 200,
      },
      modes: {
        default: ["zoom-canvas", "drag-canvas", "drag-node"],
      },
      defaultEdge: {
        size: 1,
        color: "#e2e2e2",
        style: {
          endArrow: {
            path: "M 0,0 L 8,4 L 8,-4 Z",
            fill: "#e2e2e2",
          },
        },
      },
      defaultNode: {
        size: 30,
      },
      animate: true,
    })
    graph.data({
      nodes: Array.from(
        swr.data.nodes.map((node) => ({
          ...node,
          color: COLOR_BY_TYPE[node.groupId],
          size: node.label === focus ? 50 : undefined,
          x: node.label === focus ? 0 : undefined,
          y: node.label === focus ? 0 : undefined,
        }))
      ),
      edges: Array.from(
        swr.data.edges.map((edge) => ({
          ...edge,
          label:
            CREDITED_AS_JA[edge.label as never] ||
            GRAPH_LABEL_JA[edge.label as never] ||
            edge.label,
          labelCfg: {
            style: { opacity: 0.5 },
          },
        }))
      ),
    })
    graph.render()
    if (focus) {
      const item = graph
        .getNodes()
        .find((node) => node.getModel().label === focus)
      if (item) {
        item.getNeighbors().forEach((node) => {
          node.update({ size: 40 })
        })
        item.lock()
      }
    }

    const onNodeClick = (e: IG6GraphEvent) => {
      console.log(e.item)
    }
    graph.on("node:click", onNodeClick)
    return () => {
      graph.off("node:click", onNodeClick)
      graph.destroy()
    }
  }, [swr, ref, focus])
  return (
    <Box
      style={{
        backgroundColor: "aliceblue",
        height: 500,
        borderRadius: "25px",
        overflow: "hidden",
      }}
      w="100%"
      ref={ref}
    ></Box>
  )
}

export default NeoGraph
