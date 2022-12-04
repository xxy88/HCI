class BarChart {
	constructor(_data){
	 	this.margin = {top: 20, right: 20, bottom: 110, left: 60};
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;

        this.data = _data;

        this.initVis();
	}

	initVis() {
		let vis = this;

		// Select HTML tag with a specific id "bar", add an SVG container, and set the corresponding attributes.
		// Then add a group and make a translation (e.g., width and height).(5pts)
		vis.svg = d3.select("#bar").append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom);

		// Create scales for x any y (15pts)
		vis.x = vis.data.map(d => d["kWhDelivered"]);
		vis.xScaleFocus = d3.scaleLinear().range([0, vis.width]);
		vis.yScaleFocus = d3.scaleLinear().range([vis.height, 0]);

		// Place Axis (i.e., x-axis on the bottom and y-axis on the left)
		vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus);
		vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);

		// Create a container in svg for drawing bar chart
		vis.focus = vis.svg.append("g")
			.attr("id", "focus")
			.attr("width", vis.width)
			.attr("height", vis.height)
			.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

		// Create Axis
		vis.xAxisFocusG = vis.focus.append('g')
			.attr('class', 'axis x-axis')
			.attr('transform', `translate(0, ${vis.height})`);

		vis.yAxisFocusG = vis.focus.append('g')
			.attr('class', 'axis y-axis');

        // Create a brush variable (5pts). The "brush" variable will call brushed function
        // To determine whether a brush action is trigger, we can use d3.event.selection to judge
        // so remember to pass this variable into the brushed function
        vis.brushG = vis.focus.append('g').attr('class', 'brush')
		vis.brush = d3.brushX()
			.extent([[0, 0], [vis.width, vis.height]])
			.on('end', function () {if (d3.event.selection) vis.brushed(d3.event.selection)})

        // Add label for y-axis
        vis.focus.append("text")
			.attr("class", "ylabel")
		   	.attr("y", 0 - vis.margin.left)
		   	.attr("x", 0 - (vis.height / 2))
		   	.attr("dy", "1em")
		   	.attr("transform", "rotate(-90)")
		   	.style("text-anchor", "middle")
		   	.text("Number of kWhDelivered");
	}

	updateVis(){
		let vis = this;

		// Set the domains for x and y axis (8pts).
		vis.xScaleFocus.domain([d3.min(vis.x), d3.max(vis.x)]);

		// Create a histogram (5pts) hint: D3.histogram()
		let histogram = d3.histogram()
			.domain(vis.xScaleFocus.domain())
			.thresholds(vis.xScaleFocus.ticks(100));

		// Create bins from the histogram (5pts)
		vis.bins = histogram(vis.x);

		// Set the domains for x and y axis (8pts).
		vis.yScaleFocus.domain([0, d3.max(vis.bins, d => d.length)]);

		vis.renderVis();
	}


	renderVis(){
		let vis = this;

		// draw the bar chart from the generated bins (10 pts)
		vis.focus.selectAll("rect")
			.data(vis.bins)
			.enter()
			.append("rect")
			.attr("width", d => vis.xScaleFocus(d.x1) - vis.xScaleFocus(d.x0))
			.attr("height", d => vis.height - vis.yScaleFocus(d.length))
			.attr("transform", d => `translate(${this.xScaleFocus(d.x0)}, ${this.yScaleFocus(d.length)})`)
			.attr("fill", "green");

		// Place x and y axis on the bottom and left, respectively
        vis.xAxisFocusG.call(vis.xAxisFocus);
        vis.yAxisFocusG.call(vis.yAxisFocus);

        // call the brush function
        vis.brushG.call(vis.brush)
	}

	brushed(selection){
		let vis = this;

		if (selection) {
			// Convert given pixel coordinates (range: [x0,x1]) into a kw (domain: [number,number]) (10pts)
			let x0 = vis.xScaleFocus.invert(selection[0]);
			let x1 = vis.xScaleFocus.invert(selection[1]);

			// Update x-axis accordingly (4pts)
			vis.xScaleFocus.domain([x0, x1]);
			vis.xAxisFocusG.call(d3.axisBottom(vis.xScaleFocus));

			// Based on the selected region to filter the bins (5pts) Hint: use filter() function
			let bins_select = vis.bins.filter(d => (d.x0 >= x0 && d.x1 <= x1));

			// Update y-axis accordingly (5pts)
			vis.yScaleFocus.domain([0, d3.max(bins_select, d => d.length)]);

			// Redraw the bar chart (10pts)
			vis.focus.selectAll("rect").remove();
			vis.focus.selectAll("rect")
				.data(bins_select)
				.enter()
				.append("rect")
				.attr("width", d => vis.xScaleFocus(d.x1) - vis.xScaleFocus(d.x0))
				.attr("height", d => vis.height - vis.yScaleFocus(d.length))
				.attr("transform", d => `translate(${this.xScaleFocus(d.x0)}, ${this.yScaleFocus(d.length)})`)
				.attr("fill", "green");

			vis.xAxisFocusG.call(vis.xAxisFocus);
			vis.yAxisFocusG.call(vis.yAxisFocus);
	}
  }
}