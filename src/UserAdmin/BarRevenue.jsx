import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const rangeOptions = [
  { value: 12, label: 'Last 12 months' },
  { value: 6,  label: 'Last 6 months' },
  { value: 3,  label: 'Last 3 months' },
  { value: 1,  label: 'Last month' },
];

const fullData = [
  { month: 'Jan', profit: 25000, loss: 32000 },
  { month: 'Feb', profit: 52000, loss: 15000 },
  { month: 'Mar', profit: 47000, loss: 11000 },
  { month: 'Apr', profit: 38000, loss: 9000 },
  { month: 'May', profit: 42000, loss: 10000 },
  { month: 'Jun', profit: 55000, loss: 16000 },
  { month: 'Jul', profit: 49000, loss: 13000 },
  { month: 'Aug', profit: 58000, loss: 14000 },
  { month: 'Sep', profit: 43000, loss: 9000 },
  { month: 'Oct', profit: 62000, loss: 19000 },
  { month: 'Nov', profit: 51000, loss: 12000 },
  { month: 'Dec', profit: 67000, loss: 21000 },
];

const ChevronIcon = ({ open }) => (
  <svg
    style={{
      width: 14,
      height: 14,
      flexShrink: 0,
      transition: 'transform 0.2s ease',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#027840" strokeWidth="2.2">
    <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RangeDropdown = ({ selectedRange, onSelect }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = rangeOptions.find((o) => o.value === selectedRange);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'space-between',
          padding: '6px 12px',
          fontSize: 13,
          fontWeight: 500,
          background: '#fff',
          border: `1px solid ${open ? '#9ca3af' : '#d1d5db'}`,
          borderRadius: 8,
          color: '#374151',
          cursor: 'pointer',
          minWidth: 152,
          transition: 'border-color 0.15s, background 0.15s',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.background = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = '#fff';
        }}
      >
        <span>{current?.label}</span>
        <ChevronIcon open={open} />
      </button>

      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          minWidth: 160,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          zIndex: 50,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        {rangeOptions.map((opt, i) => {
          const isActive = opt.value === selectedRange;
          return (
            <div
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: 13,
                cursor: 'pointer',
                color: isActive ? '#027840' : '#374151',
                fontWeight: isActive ? 600 : 400,
                background: '#fff',
                borderBottom: i < rangeOptions.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              <span>{opt.label}</span>
              {isActive && <CheckIcon />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BarRevenue = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [selectedRange, setSelectedRange] = useState(12);
  const [tooltip, setTooltip] = useState(null);

  const getData = () => fullData.slice(-selectedRange);

  const drawChart = () => {
    const data = getData();
    const container = containerRef.current;
    if (!container) return;

    const fullWidth = container.clientWidth;
    const fullHeight = container.clientHeight;
    const margin = { top: 10, right: 20, bottom: 25, left: 50 };
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', fullWidth).attr('height', fullHeight);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.6);

    const maxTotal = d3.max(data, (d) => d.profit + d.loss);
    const yScale = d3.scaleLinear()
      .domain([0, maxTotal * 1.2])
      .range([height, 0]);

    g.append('g')
      .call(
        d3.axisLeft(yScale)
          .tickValues([0, 20000, 40000, 60000, 80000])
          .tickSize(-width)
          .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#d1d5db')
      .attr('stroke-dasharray', '3,3');

    g.select('.domain').remove();

    const bars = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${xScale(d.month)}, 0)`);

    bars.append('rect')
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#027840')
      .transition()
      .duration(800)
      .ease(d3.easeCubic)
      .attr('y', (d) => yScale(d.profit))
      .attr('height', (d) => height - yScale(d.profit));

    bars.append('rect')
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#BB8232')
      .transition()
      .duration(800)
      .ease(d3.easeCubic)
      .attr('y', (d) => yScale(d.profit + d.loss))
      .attr('height', (d) => yScale(d.profit) - yScale(d.profit + d.loss));

    const xAxis = g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    xAxis.select('.domain').remove();
    xAxis.selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '10px')
      .attr('fill', '#027840');

    const yAxis = g.append('g').call(
      d3.axisLeft(yScale)
        .tickValues([0, 20000, 40000, 60000, 80000])
        .tickFormat((d, i) => {
          const labels = ['$500', '$1000', '$1500', '$2000', '$2500'];
          return labels[i] || '$0';
        })
        .tickSize(0)
    );

    yAxis.select('.domain').remove();
    yAxis.selectAll('text').style('font-size', '10px').attr('fill', '#027840');

    bars.selectAll('rect')
      .on('mouseover', function (event, d) {
        setTooltip({
          month: d.month,
          profit: d.profit,
          loss: d.loss,
          x: event.pageX + 12,
          y: event.pageY - 12,
        });
        d3.select(this).style('opacity', 0.75);
      })
      .on('mouseout', function () {
        setTooltip(null);
        d3.select(this).style('opacity', 1);
      });
  };

  useEffect(() => {
    drawChart();
    const resizeObserver = new ResizeObserver(() => drawChart());
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
      setTooltip(null);
    };
  }, [selectedRange]);

  return (
    <div className="w-full mx-auto mb-5 bg-white rounded-[8px]">
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800">Total Revenue</h3>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">$36,245.29</p>
            <p className="text-sm text-[#027840] font-semibold mt-0.5">
              ↑ 2.1% vs last month
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <RangeDropdown selectedRange={selectedRange} onSelect={setSelectedRange} />
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#027840]">
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#027840', display: 'inline-block' }} />
                Profit
              </span>
              <span className="flex items-center gap-1.5 text-[#BB8232]">
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#BB8232', display: 'inline-block' }} />
                Loss
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[250px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            background: 'rgba(0,0,0,0.82)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: '1000',
            lineHeight: '1.6',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <strong>{tooltip.month}</strong><br/>
          Profit: ${tooltip.profit.toLocaleString()}<br/>
          Loss: ${tooltip.loss.toLocaleString()}<br/>
          Total: ${(tooltip.profit + tooltip.loss).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default BarRevenue;