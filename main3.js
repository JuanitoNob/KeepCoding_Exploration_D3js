const width = 900
const height = 600
const margin = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10,
}

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)

const elementGroup = svg.append("g").attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append("g").attr("class", "axisGroup")

const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleTime().range([0, width - margin.left - margin.right])
const y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

const transformarTiempo = d3.timeParse("%d/%m/%Y")

d3.csv("ibex.csv").then(data => {
    data.map(d => {
        d.close = +d.close
        d.date = transformarTiempo(d.date)
    })
    
    x.domain(d3.extent(data.map(d => d.date)))
    y.domain(d3.extent(data.map(d => d.close)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    elementGroup.datum(data)
        .append("path")
        .attr("id", "linea")
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close))
        )

    console.log(data)
})

