const graf = d3.select('#graf')
console.log(graf)
//const anchoTotal = graf.style('width').slice(0, -2)
//const altoTotal = (anchoTotal * 8) / 16
const anchoTotal = 800
const altoTotal = 900

// ids de HTML
const selectVar = d3.select('#variable')
const selectNum = d3.select('#numero')

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')


const margin = {
  top: 80,
  bottom: 200,
  left: 150,
  right: 20,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom

const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)


  

let allData = []
let txtVariable = 'movie'
let numRegistros = 10

console.log('alto ' + alto)

let y = d3.scaleLinear()
  .range([alto, 0])

let x = d3.scaleBand()
  .range([0, ancho])
  .paddingInner(0.2)
  .paddingOuter(0.5)

let color = d3.scaleOrdinal()
  .range(['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'])

const xAxisGroup = g.append('g')
  .attr('transform', `translate(0, ${alto})`)
  .attr('class', 'ejes')

const yAxisGroup = g.append('g')
    .attr('class', 'ejes')


d3.csv('datos.csv').then(data => {
  data.forEach(d => {
    // console.log(d.country)
    /* d.country = +d.country
    d.movie = +d.movie
    d.tvshow = +d.tvshow
    d.total = +d.total
  */
    console.log(d.country)
  })

  allData = data
  //console.log(numRegistros)
  render(allData.slice(0, numRegistros))
})

function render(data) {
  // [binding] ENTER - update - exit
  let barras = g.selectAll('rect').data(data)
  let maximo = d3.max(data, d => d[txtVariable]) 
  console.log('maximo' + maximo )
  //y.domain([0, d3.max(data, d => d[txtVariable])])
  y.domain([0, maximo])
  console.log('y ' + y)
  x.domain(data.map(d => d.country))
  //color.domain(d3.map(allData, d => d.country))

  xAxisGroup
    .transition()
    .duration(2000)
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -15)
    .attr('x', -10)

    console.log(txtVariable)
  yAxisGroup
    .transition()
    .duration(2000)
    .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          //.tickFormat(d => `${d} ${ txtVariable == 'piso' ? 'pisos' : 'm.' }`)
      )
  barras
      .enter()
        .append('rect')
          .attr('y', y(0))
          .attr('x', d => x(d.country))
          .attr('width', x.bandwidth())
          .attr('height', alto - y(0))          
          .attr('fill', 'green')
          //console.log(y(0))
      .merge(barras)
        .transition()
        .duration(2000)
        .ease(d3.easeBounce)
          .attr('x', d => x(d.country))
          .attr('width', x.bandwidth())
          .attr('y', d => {
            console.log('txtVariable ' + txtVariable)
            return y(d[txtVariable])
          })
          .attr('fill', d => color(d.country))
          .attr('height', d => alto - y(d[txtVariable]))
          //console.log('height' + y(d[txtVariable]))
  barras.exit()
          .transition()
          .duration(2000)
          .attr('height', alto - y(0))
          .attr('y', y(0))
          .attr('fill', '#f00')
          .remove()

  // titleGroup = g.append('g')
  //       .append('text')
  //       .attr('text-anchor', 'middle')
  //       .attr('x', ancho/2)
  //       .attr('y', 45)
  //       .attr('class', 'titulo')
  //       .text('Los diez countrys más altos del mundo')
}

selectVar.on('change', () => {
  txtVariable = selectVar.node().value
  //console.log(txtVariable;)
  render(allData)
})

//selectNum.on('change', () => {
//  numRegistros = selectNum.node().value
//  render(allData.slice(0, numRegistros))
//})