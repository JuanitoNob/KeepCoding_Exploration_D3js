const width = 900
const height = 600
const margin = {
    top: 10,
    bottom: 40,
    right: 10,
    left: 40,
}

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)

const elementGroup = svg.append("g").attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append("g").attr("class", "axisGroup") 

const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const tipGroup = elementGroup.append("g").attr("class", "tipGroup hide")
.attr("transform", `translate(${100}, ${10})`)
const tip = tipGroup.append("text")


const x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
const y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])


const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)


const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

const years = [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const agesOverYears = years.map(year => age(year))


d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
        d.age = +d.age
    })
    
    x.domain(data.map(d => d.year))
    y.domain([0, d3.max(agesOverYears)])
    
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    const bar = elementGroup.selectAll("rect").data(data)
    bar.enter()
        .append("rect")
        .attr("class", `${d => d.name}`)
        .attr("x", d => x(d.year))
        .attr("y", d=> y(d.age) )
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.age))
        .on("mouseover", show)
        .on("mouseout", hide)

    const line = d3.line()
        .x((d, i) => x(years[i]))
        .y(d => y(d));
    
    elementGroup.append("path")
        .datum(agesOverYears)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
})

function show(d, i, a) {
    tipGroup.classed("show", true)
    tip.text("Nombre: " + d.name +", "+  "Edad: " +  d.age)
    console.log()
}

function hide(d, i, a) {
    tipGroup.classed("show", false)
    console.log()
}




