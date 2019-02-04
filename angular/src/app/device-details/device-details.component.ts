import { Component, Input,OnInit, OnDestroy } from '@angular/core';
import {LoginService} from '../login.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
private subscription: Subscription;
private message: string;
private temperature=[];
private avgTemp;
public timeLog;


  constructor(
    private loginService: LoginService,
    private router:Router,
    private flashMessagesService: FlashMessagesService,
    private mqttService: MqttService) { }

  ngOnInit() {
    this.loginService.getDeviceDetails().subscribe(data=>{
      if(data.enabled)
      {
        //Build the chart initially
          this.builChart();

          this.subscription = this.mqttService.observe('weather/temp')
          .subscribe((message:IMqttMessage)=>{
            this.message = message.payload.toString();
            this.timeLog = new Date().toTimeString();

            this.temperature.push({y:parseFloat(this.message)});

            //Only 10 Latest temperature values will be shown
            if(this.temperature.length>10)
                this.temperature = this.temperature.slice(1,11);

            //Re-build the chart, as soon as the new temp value arrives
            this.builChart();

            var average=0;
            //Take average of the temperature
            this.temperature.forEach(function(temp){
                                              average = average + temp.y;
                                    });
            this.avgTemp = (average/this.temperature.length).toFixed(1);

          });
      }
      else
      {
          this.flashMessagesService.show("Login first",{cssClass:'alert-danger', timeout:2000});
          this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(){
      this.subscription.unsubscribe();
  }

builChart(){
//Clean the SVG Child
var svgChild = d3.select("svg");
svgChild.remove();
//  Use the margin convention practice
var margin = {top: 50, right: 250, bottom: 150, left: 50}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
var n = 11;

// X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
        .range([height, 0]); // output

// d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
//var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
var dataset = this.temperature;
// Add the SVG to the page and employ #2
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

//  Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5)
      .on("mouseover", function(a, b, c) {
  			console.log(a)
        this.attr('class', 'focus')
		})
      .on("mouseout", function() {  })

}

}
