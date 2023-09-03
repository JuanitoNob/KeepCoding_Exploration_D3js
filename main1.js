const width = 900
const height = 600
const margin = {
    top: 10,
    left: 60,
    right: 10,
    bottom: 40
}

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)

const elementGroup = svg.append("g").attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const axis = svg.append("g").attr("class", "axis")

const xAxisGroup = axis.append("g").attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axis.append("g").attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleLinear().range([0, width - margin.left - margin.right])
const y = d3.scaleBand().range([0, height - margin.top - margin.bottom]).padding(0.1)

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

let years
let nest
let originalData


d3.csv("WorldCup.csv").then(data => {

    data.map(d => {
        d.Year = +d.Year
        console.log(data)
    })
    
    nest = d3.nest()
        .key(d => d.Winner)
        .rollup(d => d.length)
        .entries(data)
    
    x.domain([0, d3.max(nest.map(d => d.value))])
    y.domain(nest.map(d => d.key))
    
    xAxis.ticks(d3.max(nest.map(d => d.value)))
    
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
      
    years = Array.from(new Set(data.map(d => d.Year)))
    
    originalData = data
      
    update(nest)
    slider()
})


function filterDataByYear(selectedYear) {
    const filteredData = originalData.filter(d => d.Year <= selectedYear)
    console.log('Datos filtrados:', filteredData)
    return filteredData
}

function update(nest) {
    
    const elements = elementGroup.selectAll("rect").data(nest, d => d.key)
    
    elements.exit().remove()
    
    elements.enter()
        .append("rect")
        .attr("class", d => d.key + " bar")
        .attr("x", 0)
        .attr("y", d => y(d.key))
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth())

    
    elements.attr("class", d => d.key + " bar")
        .attr("x", 0)
        .attr("y", d => y(d.key))
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth())
    

}


// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(580)  // ancho de nuestro slider en px
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            const selectedYear = val
            const filteredData = filterDataByYear(selectedYear)
            
            nest = d3.nest()
            .key(d => d.Winner)
            .rollup(d => d.length)
            .entries(filteredData)
        
                       
            update(nest)
            
   })

       
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)')

        gTime.call(sliderTime)  // invocamos el slider en el contenedor

        d3.select('p#value-time').text(sliderTime.value())  // actualiza el año que se representa
}


