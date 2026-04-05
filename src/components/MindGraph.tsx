import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node, Link, CATEGORY_COLORS } from '../types';

interface MindGraphProps {
  nodes: Node[];
  links: Link[];
  onNodeClick: (node: Node) => void;
  onNodeDoubleClick?: (node: Node) => void;
  onNodeContextMenu?: (node: Node, x: number, y: number) => void;
  onEmptyClick?: () => void;
  onConnect?: (sourceId: string, targetId: string) => void;
  language: 'zh' | 'en';
  theme: 'dark' | 'light';
}

const MindGraph: React.FC<MindGraphProps> = ({ 
  nodes, 
  links, 
  onNodeClick, 
  onNodeDoubleClick,
  onNodeContextMenu,
  onEmptyClick,
  onConnect,
  language,
  theme,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<any>(nodes)
      .force('link', d3.forceLink<any, any>(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'link-line')
      .attr('stroke', (d: any) => {
        const sourceNode = nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id));
        return sourceNode ? CATEGORY_COLORS[sourceNode.category] : (theme === 'light' ? '#ccc' : '#333');
      })
      .style('stroke-width', '1.5px')
      .style('opacity', 0.4)
      .style('filter', (d: any) => {
        const sourceNode = nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id));
        const color = sourceNode ? CATEGORY_COLORS[sourceNode.category] : '#333';
        return `drop-shadow(0 0 5px ${color})`;
      });

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (event.defaultPrevented) return;
        onNodeClick(d as Node);
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        onNodeDoubleClick?.(d as Node);
      })
      .on('mousedown', (event, d) => {
        longPressTimer.current = setTimeout(() => {
          onNodeContextMenu?.(d as Node, event.pageX, event.pageY);
        }, 600);
      })
      .on('mouseup mousemove', () => {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node circles
    node.append('circle')
      .attr('r', (d: any) => 6 + (d.value / 20))
      .attr('fill', (d: any) => CATEGORY_COLORS[d.category as keyof typeof CATEGORY_COLORS])
      .attr('class', 'transition-all duration-300')
      .style('filter', (d: any) => `drop-shadow(0 0 10px ${CATEGORY_COLORS[d.category as keyof typeof CATEGORY_COLORS]}44)`)
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('r', 10 + (d.value / 20)).style('filter', `drop-shadow(0 0 20px ${CATEGORY_COLORS[d.category as keyof typeof CATEGORY_COLORS]}88)`);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this).attr('r', 6 + (d.value / 20)).style('filter', `drop-shadow(0 0 10px ${CATEGORY_COLORS[d.category as keyof typeof CATEGORY_COLORS]}44)`);
      });

    // Node labels
    node.append('text')
      .attr('dy', 25)
      .attr('text-anchor', 'middle')
      .attr('class', 'node-label')
      .style('fill', theme === 'light' ? '#000000' : '#ffffff')
      .style('font-weight', theme === 'light' ? '600' : '500')
      .text((d: any) => language === 'zh' ? d.name : d.nameEn);

    // Empty space interactions
    svg.on('click', (event) => {
      if (event.target === svgRef.current) {
        onEmptyClick?.();
      }
    });

    const updateSize = () => {
      if (!containerRef.current || !svgRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      
      d3.select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .attr('viewBox', [0, 0, w, h] as any);
        
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', updateSize);

    simulation.on('tick', () => {
      link.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;

      // Detect if dropped on another node for connection
      const target = nodes.find(n => {
        if (n.id === d.id) return false;
        const dx = (n as any).x - event.x;
        const dy = (n as any).y - event.y;
        return Math.sqrt(dx * dx + dy * dy) < 30;
      });

      if (target && onConnect) {
        onConnect(d.id, target.id);
      }
    }

    return () => {
      simulation.stop();
      window.removeEventListener('resize', updateSize);
    };
  }, [nodes, links, language, onNodeClick, onNodeDoubleClick, onNodeContextMenu, onEmptyClick, onConnect]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MindGraph;
