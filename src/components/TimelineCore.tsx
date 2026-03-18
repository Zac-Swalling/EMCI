import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { timelineData } from '../data/timelineData';
import { format, parseISO } from 'date-fns';

interface TimelineCoreProps {
  onSelectEvent: (event: any) => void;
}

export function TimelineCore({ onSelectEvent }: TimelineCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 80, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const axisY = innerHeight / 2; // Center axis

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('svg').remove();
    d3.select(containerRef.current).selectAll('.tooltip').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'absolute top-0 left-0');

    // Define clip path
    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('x', 0)
      .attr('y', 0);

    const mainGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = (d: string) => parseISO(d);
    const allDates = [
      ...timelineData.academic.map(d => parseDate(d.date)),
      ...timelineData.attendance.map(d => parseDate(d.date)),
      ...timelineData.events.map(d => parseDate(d.date)),
      ...timelineData.riskPeriods.map(d => parseDate(d.start)),
      ...timelineData.riskPeriods.map(d => parseDate(d.end))
    ].filter(Boolean) as Date[];

    const minDate = d3.min(allDates) || new Date(2025, 0, 1);
    const maxDate = d3.max(allDates) || new Date(2026, 2, 17);

    // Add padding to dates
    const paddedMin = new Date(minDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const paddedMax = new Date(maxDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Scales
    const xScale = d3.scaleTime()
      .domain([paddedMin, paddedMax])
      .range([0, innerWidth]);

    const yScaleAcademic = d3.scaleLinear()
      .domain([50, 100])
      .range([axisY - 20, 0]);

    const yScaleAttendance = d3.scaleLinear()
      .domain([60, 100])
      .range([axisY + 20, innerHeight]);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [innerWidth, innerHeight]])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on('zoom', (event) => {
        const newXScale = event.transform.rescaleX(xScale);
        updateTimeline(newXScale);
      });

    svg.call(zoom);

    // --- Risk Background ---
    const riskGroup = mainGroup.append('g').attr('class', 'risk-background').attr('clip-path', 'url(#clip)');
    
    // --- Axes ---
    const xAxisGroup = mainGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${axisY})`);

    const yAxisGroup = mainGroup.append('g')
      .attr('class', 'y-axis');

    // --- Data Groups ---
    const dataGroup = mainGroup.append('g').attr('clip-path', 'url(#clip)');
    
    // Academic Line
    const academicPath = dataGroup.append('path')
      .attr('class', 'academic-line')
      .attr('fill', 'none')
      .attr('stroke', '#2563EB') // emci-accent
      .attr('stroke-width', 2)
      .style('opacity', 0.8);

    // Attendance Bars
    const attendanceGroup = dataGroup.append('g').attr('class', 'attendance-bars');

    // Events
    const eventsGroup = dataGroup.append('g').attr('class', 'events');

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'tooltip absolute hidden bg-white border border-slate-200 shadow-xl rounded-lg p-4 text-sm pointer-events-none z-50 max-w-sm transition-opacity duration-200')
      .style('opacity', 0);

    // --- Update Function ---
    function updateTimeline(newXScale: d3.ScaleTime<number, number>) {
      // Update X Axis
      const xAxis = d3.axisBottom(newXScale)
        .ticks(width > 800 ? d3.timeMonth.every(1) : d3.timeMonth.every(2))
        .tickFormat((d: any) => format(d, 'MMM yyyy'))
        .tickSizeOuter(0)
        .tickSizeInner(6)
        .tickPadding(12);

      xAxisGroup.call(xAxis)
        .call(g => g.select('.domain').attr('stroke', '#E2E8F0').attr('stroke-width', 1))
        .call(g => g.selectAll('.tick line').attr('stroke', '#E2E8F0'))
        .call(g => g.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '10px').attr('font-weight', '600').attr('letter-spacing', '0.05em').attr('text-transform', 'uppercase'));

      // Update Y Grid
      const yAxis = d3.axisLeft(yScaleAcademic)
        .ticks(3)
        .tickSize(-innerWidth)
        .tickFormat(() => '');

      yAxisGroup.call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', '#F1F5F9').attr('stroke-dasharray', '2,2'));

      // Update Risk Background
      const riskRects = riskGroup.selectAll('rect')
        .data(timelineData.riskPeriods);

      riskRects.enter()
        .append('rect')
        .merge(riskRects as any)
        .attr('x', d => newXScale(parseDate(d.start)) || 0)
        .attr('y', 0)
        .attr('width', d => Math.max(0, (newXScale(parseDate(d.end)) || 0) - (newXScale(parseDate(d.start)) || 0)))
        .attr('height', innerHeight)
        .attr('fill', d => {
          if (d.level === 'high') return 'url(#risk-gradient-high)';
          if (d.level === 'medium') return 'url(#risk-gradient-medium)';
          return 'transparent';
        })
        .style('opacity', 0.15);

      riskRects.exit().remove();

      // Update Academic Line
      const lineGenerator = d3.line<any>()
        .x(d => newXScale(parseDate(d.date)))
        .y(d => yScaleAcademic(d.score))
        .curve(d3.curveMonotoneX);

      academicPath.attr('d', lineGenerator(timelineData.academic));

      // Update Attendance Bars
      const bars = attendanceGroup.selectAll('rect')
        .data(timelineData.attendance);

      bars.enter()
        .append('rect')
        .merge(bars as any)
        .attr('x', d => (newXScale(parseDate(d.date)) || 0) - 3)
        .attr('y', axisY)
        .attr('width', 6)
        .attr('height', d => yScaleAttendance(d.rate) - axisY)
        .attr('fill', d => d.rate < 80 ? '#EF4444' : d.rate < 90 ? '#F59E0B' : '#E2E8F0')
        .attr('rx', 3)
        .style('opacity', 0.8);

      bars.exit().remove();

      // Update Events
      const eventNodes = eventsGroup.selectAll('g.event-node')
        .data(timelineData.events, (d: any) => d.id);

      const eventNodesEnter = eventNodes.enter()
        .append('g')
        .attr('class', 'event-node cursor-pointer')
        .on('mouseenter', (event, d) => {
          tooltip.style('opacity', 1);
          tooltip.html(`
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">${format(parseDate(d.date), 'MMM d, yyyy')}</span>
                <span class="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                  d.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                  d.type === 'intervention' ? 'bg-red-100 text-red-700' :
                  d.type === 'milestone' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }">${d.type}</span>
              </div>
              <span class="font-medium text-slate-900 text-base">${d.title}</span>
              <p class="text-xs text-slate-500 mt-1">${d.notes}</p>
            </div>
          `)
          .classed('hidden', false);
          
          // Position tooltip
          const tooltipNode = tooltip.node();
          const tooltipWidth = tooltipNode ? tooltipNode.getBoundingClientRect().width : 0;
          const tooltipHeight = tooltipNode ? tooltipNode.getBoundingClientRect().height : 0;
          
          let left = event.pageX + 15;
          let top = event.pageY - tooltipHeight / 2;
          
          // Adjust if off-screen
          if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - 15;
          }
          
          tooltip.style('left', `${left}px`).style('top', `${top}px`);
          
          d3.select(event.currentTarget).select('.node-shape')
            .transition().duration(200)
            .attr('transform', 'scale(1.5)');
        })
        .on('mousemove', (event) => {
          const tooltipNode = tooltip.node();
          const tooltipWidth = tooltipNode ? tooltipNode.getBoundingClientRect().width : 0;
          const tooltipHeight = tooltipNode ? tooltipNode.getBoundingClientRect().height : 0;
          
          let left = event.pageX + 15;
          let top = event.pageY - tooltipHeight / 2;
          
          if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - 15;
          }
          
          tooltip.style('left', `${left}px`).style('top', `${top}px`);
        })
        .on('mouseleave', (event) => {
          tooltip.style('opacity', 0).classed('hidden', true);
          d3.select(event.currentTarget).select('.node-shape')
            .transition().duration(200)
            .attr('transform', 'scale(1)');
        })
        .on('click', (event, d) => {
          onSelectEvent(d);
          // Highlight selected
          eventsGroup.selectAll('.node-shape').attr('stroke-width', 1).attr('stroke', '#CBD5E1');
          d3.select(event.currentTarget).select('.node-shape').attr('stroke-width', 2).attr('stroke', '#0F172A');
        });

      // Draw shapes based on type
      eventNodesEnter.each(function(d) {
        const g = d3.select(this);
        const yPos = d.track === 'above' ? -40 : 40;
        
        // Vertical connecting line
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', -yPos)
          .attr('stroke', '#CBD5E1')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2');

        if (d.type === 'milestone') {
          // Diamond
          g.append('polygon')
            .attr('class', 'node-shape drop-shadow-sm')
            .attr('points', '0,-6 6,0 0,6 -6,0')
            .attr('fill', '#2563EB')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5);
        } else if (d.type === 'warning') {
          // Triangle
          g.append('polygon')
            .attr('class', 'node-shape drop-shadow-sm')
            .attr('points', '0,-7 7,5 -7,5')
            .attr('fill', '#F59E0B')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5);
        } else if (d.type === 'intervention') {
          // Square
          g.append('rect')
            .attr('class', 'node-shape drop-shadow-sm')
            .attr('x', -5)
            .attr('y', -5)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#EF4444')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5);
        } else {
          // Circle (neutral)
          g.append('circle')
            .attr('class', 'node-shape drop-shadow-sm')
            .attr('r', 5)
            .attr('fill', '#F8FAFC')
            .attr('stroke', '#64748B')
            .attr('stroke-width', 2);
        }
      });

      const allEventNodes = eventNodesEnter.merge(eventNodes as any);
      
      allEventNodes.attr('transform', d => {
        const x = newXScale(parseDate(d.date)) || 0;
        const y = d.track === 'above' ? axisY - 40 : axisY + 40;
        return `translate(${x},${y})`;
      });

      eventNodes.exit().remove();
    }

    // Define gradients
    const defs = svg.select('defs');
    
    const highRiskGrad = defs.append('linearGradient')
      .attr('id', 'risk-gradient-high')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    highRiskGrad.append('stop').attr('offset', '0%').attr('stop-color', '#EF4444').attr('stop-opacity', 0.8);
    highRiskGrad.append('stop').attr('offset', '100%').attr('stop-color', '#EF4444').attr('stop-opacity', 0);

    const mediumRiskGrad = defs.append('linearGradient')
      .attr('id', 'risk-gradient-medium')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    mediumRiskGrad.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0.8);
    mediumRiskGrad.append('stop').attr('offset', '100%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0);

    // Initial render
    updateTimeline(xScale);

    // Time scrubber line
    const scrubber = mainGroup.append('line')
      .attr('class', 'scrubber')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#0F172A')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    // Scrubber date label
    const scrubberLabel = mainGroup.append('text')
      .attr('class', 'scrubber-label')
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#0F172A')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    // Overlay for mouse tracking
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', (event) => {
        const [x] = d3.pointer(event, mainGroup.node());
        if (x >= 0 && x <= innerWidth) {
          scrubber.attr('x1', x).attr('x2', x).style('opacity', 0.4);
          
          // Calculate date from current scale
          const currentTransform = d3.zoomTransform(svg.node()!);
          const currentXScale = currentTransform.rescaleX(xScale);
          const date = currentXScale.invert(x);
          
          scrubberLabel
            .attr('x', x)
            .text(format(date, 'MMM d, yyyy'))
            .style('opacity', 1);
        } else {
          scrubber.style('opacity', 0);
          scrubberLabel.style('opacity', 0);
        }
      })
      .on('mouseleave', () => {
        scrubber.style('opacity', 0);
        scrubberLabel.style('opacity', 0);
      });

  }, [dimensions, onSelectEvent]);

  return (
    <div className="flex-1 flex flex-col relative bg-white">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-medium tracking-tight text-slate-900">Student Journey</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Scroll to zoom &bull; Drag to pan</p>
      </div>
      
      {/* Legend */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-5 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-600 rotate-45" />
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-amber-500" />
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-500" />
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Intervention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full border-[2px] border-slate-400 bg-slate-50" />
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Neutral</span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
