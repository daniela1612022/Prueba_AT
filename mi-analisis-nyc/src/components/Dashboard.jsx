/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Bar, Doughnut, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  LineElement,
  Tooltip,
  ArcElement,
} from 'chart.js';
import * as d3 from 'd3';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  LineElement,
  Tooltip,
  ArcElement
);

function Dashboard({ result, onBack }) {
  const summary = result.summary;
  const correlations = result.correlations || {};
  const topIndustries = result.top_industries_by_zip || [];
  const sampleZips = result.sample_zip_data || [];

  const zipLabels = sampleZips.map((z) => z.ZIP);
  const individualRatios = sampleZips.map((z) => z.individual_ratio);
  const businessCounts = sampleZips.map((z) => z.business_count);
  const perCapita = sampleZips.map((z) => z.business_per_capita);

  const correlationLabels = Object.keys(correlations);

  const barData = {
    labels: zipLabels,
    datasets: [
      {
        data: individualRatios,
        backgroundColor: 'rgba(0, 224, 255, 0.6)',
      },
    ],
  };

  const industryCounts = {};
  topIndustries.forEach(({ Industry }) => {
    industryCounts[Industry] = (industryCounts[Industry] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(industryCounts),
    datasets: [
      {
        data: Object.values(industryCounts),
        backgroundColor: [
          '#00e0ff',
          '#007acc',
          '#d97706',
          '#84cc16',
          '#f43f5e',
          '#9333ea',
        ],
      },
    ],
  };

  const scatterData1 = {
    datasets: [
      {
        data: sampleZips.map((z) => ({ x: z.business_count, y: z.business_per_capita })),
        backgroundColor: '#00e0ff',
      },
    ],
  };

  const scatterData2 = {
    datasets: [
      {
        data: sampleZips.map((z) => ({ x: z["PERCENT HISPANIC LATINO"], y: z.business_per_capita })).filter(d => d.x != null && d.y != null),
        backgroundColor: '#f59e0b',
      },
    ],
  };

  const scatterData3 = {
    datasets: [
      {
        data: sampleZips.map((z) => ({ x: z["PERCENT RECEIVES PUBLIC ASSISTANCE"], y: z.business_per_capita })).filter(d => d.x != null && d.y != null),
        backgroundColor: '#9333ea',
      },
    ],
  };

  const radarData = {
    labels: correlationLabels,
    datasets: [
      {
        data: correlationLabels.map((label) => {
          const values = Object.values(correlations[label] || {});
          return values.reduce((a, b) => a + b, 0) / values.length;
        }),
        backgroundColor: 'rgba(0,224,255,0.3)',
        borderColor: '#00e0ff',
      },
    ],
  };

  const heatmapRef = useRef(null);

  useEffect(() => {
    const container = d3.select(heatmapRef.current);
    container.selectAll('*').remove();

    const labels = correlationLabels;
    const data = labels.flatMap((yLabel, y) =>
      labels.map((xLabel, x) => ({ x, y, value: correlations[yLabel][xLabel] }))
    );

    const size = 30;
    const width = labels.length * size;
    const height = labels.length * size;

    const svg = container
      .append('svg')
      .attr('width', width + 100)
      .attr('height', height + 100);

    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([-1, 1]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x * size + 50)
      .attr('y', (d) => d.y * size + 50)
      .attr('width', size)
      .attr('height', size)
      .attr('fill', (d) => colorScale(d.value));

    svg.selectAll('text.label-x')
      .data(labels)
      .enter()
      .append('text')
      .attr('x', (d, i) => i * size + 65)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text((d) => d);

    svg.selectAll('text.label-y')
      .data(labels)
      .enter()
      .append('text')
      .attr('x', 40)
      .attr('y', (d, i) => i * size + 70)
      .attr('text-anchor', 'end')
      .attr('fill', 'white')
      .text((d) => d);
  }, [correlations]);

  return (
    <div className="dashboard-container">
      <section className="intro-card">
        <h2 className="dashboard-title">📈 Bienvenido al Análisis de Negocios y Demografía de NYC</h2>
        <p>
          Esta herramienta combina datos abiertos para generar <strong>visualizaciones clave</strong> sobre la relación entre negocios operando legalmente en Nueva York y variables demográficas como etnicidad, ciudadanía y asistencia pública.
        </p>
        <p>
          El objetivo es identificar <strong>patrones territoriales y correlaciones</strong> útiles para tomadores de decisiones, emprendedores y analistas.
        </p>
      </section>

      <button onClick={onBack} className="dashboard-button">⬅ Volver</button>

      <div className="dashboard-cards">
        <div className="card">Negocios totales: <strong>{summary.total_businesses}</strong></div>
        <div className="card">ZIP Codes únicos: <strong>{summary.total_zip_codes}</strong></div>
        <div className="card">Negocios promedio por ZIP: <strong>{summary.avg_business_per_zip}</strong></div>
      </div>

      <div className="dashboard-grid">
        <div className="card"><h4>🎯 Ratio de individuos por ZIP</h4><Bar data={barData} options={{ plugins: { legend: { display: false } } }} /></div>
        <div className="card"><h4>🏭 Industrias más frecuentes en ZIPs</h4><Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } } }} /></div>
        <div className="card"><h4>📉 Dispersión: Cantidad de negocios vs Negocios per cápita</h4><Scatter data={scatterData1} options={{ plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Negocios Totales' } }, y: { title: { display: true, text: 'Negocios per cápita' } } } }} /></div>
        <div className="card"><h4>📉 Dispersión: Negocios per cápita vs % Población Hispana</h4><Scatter data={scatterData2} options={{ plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: '% Hispana' } }, y: { title: { display: true, text: 'Negocios per cápita' } } } }} /></div>
        <div className="card"><h4>📉 Dispersión: Negocios per cápita vs % Asistencia Pública</h4><Scatter data={scatterData3} options={{ plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: '% Asistencia Pública' } }, y: { title: { display: true, text: 'Negocios per cápita' } } } }} /></div>
        <div className="card"><h4>📈 Radar Chart de correlaciones</h4><Radar data={radarData} options={{ plugins: { legend: { display: false } } }} /></div>
        <div className="card"><h4>🔥 Mapa de calor de correlaciones (D3.js)</h4><div ref={heatmapRef}></div></div>
        <div className="card correlation-table-card" style={{ gridColumn: 'span 2' }}>
          <h4>🧬 Mapa de correlaciones (tabla)</h4>
          <table className="correlation-table">
            <thead>
              <tr>
                <th></th>
                {correlationLabels.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationLabels.map((row) => (
                <tr key={row}>
                  <td><strong>{row}</strong></td>
                  {correlationLabels.map((col) => (
                    <td key={col}>{correlations[row][col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
