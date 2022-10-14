import { createEffect, children, onMount } from "solid-js";
import InfiniteViewer from "infinite-viewer";
import Guides from "@scena/guides";
import "./FlowStyles.css";

const FlowContainer = (props) => {

    const child = children(() => props.children);

    let viewer, horizontalGuides, verticalGuides, flowchart;
    let defaultFlowchartData = {
        operators: {
            operator1: {
                top: 20,
                left: 20,
                properties: {
                    title: 'Operator 1',
                    inputs: {},
                    outputs: {
                        output_1: {
                            label: 'Output 1',
                        }
                    }
                }
            },
            operator2: {
                top: 80,
                left: 300,
                properties: {
                    title: 'Operator 2',
                    inputs: {
                        input_1: {
                            label: 'Input 1',
                        },
                        input_2: {
                            label: 'Input 2',
                        },
                    },
                    outputs: {}
                }
            },
        },
        links: {
            link_1: {
                fromOperator: 'operator1',
                fromConnector: 'output_1',
                toOperator: 'operator2',
                toConnector: 'input_2',
            },
        }
    };
    
    const createGuides = () => {
        horizontalGuides = new Guides(document.querySelector("#FlowEditor-app .guides.horizontal"), {
            snapThreshold: 5,
            snaps: [0, 300, 600],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.horizontalGuidelines = guides;
        });
        verticalGuides = new Guides(document.querySelector("#FlowEditor-app .guides.vertical"), {
            type: "vertical",
            snapThreshold: 5,
            snaps: [0, 200, 400],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.verticalGuidelines = guides;
        });
    }

    const createInfiniteViewer = () => {
        viewer = new InfiniteViewer(
            document.querySelector("#FlowEditor-app .viewer"),
            document.querySelector("#FlowEditor-app .viewport"),
            {
                // usePinch: true,
                // pinchThreshold: 50,
                useMouseDrag: true,
                useWheelScroll: true,
                useAutoZoom: true,
                zoomRange: [0.1, 10],
                maxPinchWheel: 10,
            }
        ).on("dragStart", e => {
            const target = e.inputEvent.target;
    
            if (target.nodeName === "A") {
                e.stop();
            }
        }).on("scroll", e => {
            const zoom = viewer.zoom;
            horizontalGuides.scroll(e.scrollLeft, zoom);
            horizontalGuides.scrollGuides(e.scrollTop, zoom);
    
            verticalGuides.scroll(e.scrollTop, zoom);
            verticalGuides.scrollGuides(e.scrollLeft, zoom);
        }).on("pinch", e => {
            const zoom = Math.max(0.1, e.zoom);
    
            verticalGuides.zoom = zoom;
            horizontalGuides.zoom = zoom;
        });

        requestAnimationFrame(() => {
            viewer.scrollCenter();
        });
    
    };

    const resizeObs = () => {
        new ResizeObserver(() => {
            horizontalGuides.resize();
            verticalGuides.resize();
            }).observe(document.getElementById('FlowEditor-app'))
    }

    const setupFlowChart = () => {
         flowchart = $('#FlowEditor-viewport');
         const dat = flowchart.flowchart({
            data: defaultFlowchartData,
            defaultSelectedLinkColor: '#000055',
            grid: 10,
            multipleLinksOnInput: true,
            multipleLinksOnOutput: true
        });
        console.log(dat);
    }

    onMount(async ()=>{
    
        await new Promise(r => setTimeout(r, 50));
        createGuides();
        createInfiniteViewer();
        resizeObs();
        setupFlowChart();

    });

return (
  <div id="FlowEditor-app"class="app" style="width: 100%;height: 100%;">
      <div class="reset" onClick={()=>viewer.scrollCenter()}></div>
      <div class="guides horizontal"></div>
      <div class="guides vertical"></div>
      <div class="scroll horizontal"></div>
      <div class="viewer" style="width: 100%;height: 100%;">
        <div id="FlowEditor-viewport" class="viewport">
        </div>
      </div>
  </div>

  )

}

export default FlowContainer