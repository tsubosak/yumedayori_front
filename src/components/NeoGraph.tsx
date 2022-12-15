import { useEffect, useRef } from "react"
import G6, { EdgeConfig, IG6GraphEvent, NodeConfig } from "@antv/g6"
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
  const { data } = useSWR<Relationships>(path)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = ref.current
    if (!container || !data) {
      return
    }
    const graph = new G6.Graph({
      container,
      width: container.clientWidth,
      height: 500,
      fitCenter: true,
      layout: {
        type: "force2",
        // animate: true, // 设置为 false 可关闭布局动画
        //maxSpeed: 100,
        linkDistance: 200,
        //clustering: true,
        //nodeClusterBy: "cluster",
        //clusterNodeStrength: 300,
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
        data.nodes
          .reduce((map, node) => {
            map.set(node.id, {
              ...node,
              color: COLOR_BY_TYPE[node.groupId],
              size: node.label === focus ? 50 : undefined,
              x: node.label === focus ? 0 : undefined,
              y: node.label === focus ? 0 : undefined,
            })
            return map
          }, new Map<string, NodeConfig>())
          .values()
      ),
      edges: Array.from(
        data.edges
          .reduce((map, edge) => {
            map.set(edge.source + edge.target, {
              ...edge,
              label:
                CREDITED_AS_JA[edge.label as never] ||
                GRAPH_LABEL_JA[edge.label as never] ||
                edge.label,
              labelCfg: {
                style: { opacity: 0.5 },
              },
            })
            return map
          }, new Map<string, EdgeConfig>())
          .values()
      ),
    })
    graph.render()
    if (focus) {
      const item = graph
        .getNodes()
        .find((node) => node.getModel().label === focus)
      if (item) {
        // const box = item.getBBox()
        // graph.moveTo(box.centerX || box.x, box.centerY || box.y, true)
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
  }, [data, ref, focus])
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
