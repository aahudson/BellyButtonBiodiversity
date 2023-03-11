function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGauge(newSample, data);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: Create a Horizontal Bar Chart
function buildCharts(sample) {
  // 1. Use the D3 library to load and read the samples.json file
  d3.json("static/samples.json").then((data) => {
    console.log(data);

    // 2. Create a variable that holds the samples array.
    var samples = data.samples;

    // 3. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 4. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 5. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 6. Create the yticks for the bar chart.
    var yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // 7. Create the trace for the bar chart.
    var trace = [
      {
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // 8. Create the layout for the bar chart.
    var layout = {
      title: "Top 10 Bacterial Species (OTUs)",
      margin: { t: 30, l: 150 }
    };

    // 9. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", trace, layout);
  });
}

// Deliverable 2
function buildCharts(sample) {
  // 1. Use the D3 library to load and read the samples.json file
  d3.json("static/samples.json").then((data) => {
    console.log(data);

    // 2. Create a variable that holds the samples array.
    var samples = data.samples;

    // 3. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 4. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 5. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 6. Create the trace for the bubble chart.
    var trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    // 7. Create the layout for the bubble chart.
    var layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      margin: {t:30}
    };

    // 8. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [trace], layout);

    // 9. Create the trace for the bar chart.
    var barData = [
      {
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // 10. Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacterial Species (OTUs)",
      margin: { t: 30, l: 150 }
    };

    // 11. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Deliverable 3
function buildGauge(sample, data) {
  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

  // 2. Create a variable that holds the first sample in the metadata array.
  var result = resultArray[0];

  // 3. Create a variable that holds the washing frequency.
  var wfreq = result.wfreq;

  // 4. Create the trace for the gauge chart.
  var trace = {
    type: "indicator",
    mode: "gauge+number",
    value: wfreq,
    title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
    gauge: {
      axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lime" },
        { range: [8, 10], color: "green" }
      ],
      threshold: {
        line: { color: "purple", width: 4 },
        thickness: 0.75,
        value: 490
      }
    }
  };

  // 5. Create the layout for the gauge chart.
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 0, b: 0 },
    paper_bgcolor: "white",
    font: { color: "darkblue", family: "Arial" }
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", [trace], layout);
}