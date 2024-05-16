let chartGraph = null;
let donutchart=null;
let brandgraph=null;
$(function () {
//===========================brand sales=============


var chartbrand = {
  series: [{ name: "Earnings this month:", data: [11,25,0] }],

  chart: {
    type: "bar",
    height: 500,
    offsetX: -15,
    toolbar: { show: true },
    foreColor: "#adb0bb",
    fontFamily: "inherit",
    sparkline: { enabled: false },
  },

  colors: ["#5D87FF"],

  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
      columnheight: "50%",
      borderRadius: [6],
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "all",
    },
  },
  markers: { size: 0 },

  dataLabels: {
    enabled: false,
  },

  legend: {
    show: false,
  },

  grid: {
    borderColor: "rgba(0,0,0,0.1)",
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },

  xaxis: {
    type: "category",
    categories: ['Iphone','Samsung','Poco'],
    labels: {
      style: { cssClass: "grey--text lighten-2--text fill-color" },
    },
  },

  yaxis: {
    show: true,
    min: 0,
    max: 100,
    tickAmount: 10,
    labels: {
      style: {
        cssClass: "grey--text lighten-2--text fill-color",
      },
    },
  },
  stroke: {
    show: true,
    width: 3,
    lineCap: "butt",
    colors: ["transparent"],
  },

  tooltip: { theme: "light" },

  responsive: [
    {
      breakpoint: 10,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 3,
          },
        },
      },
    },
  ],
};
var brandgraph = new ApexCharts(document.querySelector("#chartbrand"), chartbrand);
brandgraph.render();  

$(document).ready(function () {
  $("#chartbrand").click(function () {
      console.log('brand');
      fetch("/ChartbrandOverview", {
          method: "GET",
      })
      .then((response) => response.json())
      .then((Data) => {
          console.log(Data);
          var chartbrand = {
            series: [{ name: "Earnings this month:", data:[2,4,6] }],
          
            chart: {
              type: "bar",
              height: 500,
              offsetX: -15,
              toolbar: { show: true },
              foreColor: "#adb0bb",
              fontFamily: "inherit",
              sparkline: { enabled: false },
            },
          
            colors: ["#5D87FF"],
          
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "50%",
                columnheight: "50%",
                borderRadius: [6],
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "all",
              },
            },
            markers: { size: 0 },
          
            dataLabels: {
              enabled: false,
            },
          
            legend: {
              show: false,
            },
          
            grid: {
              borderColor: "rgba(0,0,0,0.1)",
              strokeDashArray: 3,
              xaxis: {
                lines: {
                  show: false,
                },
              },
            },
          
            xaxis: {
              type: "category",
              categories: ['Iphone','Samsung','Poco'],
              labels: {
                style: { cssClass: "grey--text lighten-2--text fill-color" },
              },
            },
          
            yaxis: {
              show: true,
              min: 0,
              max: 100,
              tickAmount: 10,
              labels: {
                style: {
                  cssClass: "grey--text lighten-2--text fill-color",
                },
              },
            },
            stroke: {
              show: true,
              width: 3,
              lineCap: "butt",
              colors: ["transparent"],
            },
          
            tooltip: { theme: "light" },
          
            responsive: [
              {
                breakpoint: 10,
                options: {
                  plotOptions: {
                    bar: {
                      borderRadius: 3,
                    },
                  },
                },
              },
            ],
          };    

          // Render the chart using ApexCharts
          var brandgraph = new ApexCharts(document.querySelector("#chartbrand"), chartbrand);
          brandgraph.render();   
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  });
});



  // =====================================
  // Profit
  // =====================================
  var chart = {
    series: [{ name: "Earnings this month:", data: [0, 0, 0, 0, 0, 0] }],

    chart: {
      type: "bar",
      height: 500,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },

    colors: ["#5D87FF"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        columnheight: "50%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: [
   30,
   29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18,
   17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,
    5,  4,  3,  2,  1
      ],
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },

    yaxis: {
      show: true,
      min: 0,
      max: 500000,
      tickAmount: 10,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 500000,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  };

  //==========================custon chart overview=============
  $(document).ready(function () {
    $("#Submitbtn").click(function () {
      var StartDate = new Date(document.getElementById("start").value);
      var EndDate = new Date(document.getElementById("end").value);
      console.log(StartDate);
      console.log(EndDate);


        const currentDate = new Date();
    
        if (StartDate > currentDate) {
            alert("Start date exceeds the current date");
            return
        }
    
        if (EndDate > currentDate) {
            alert("End date exceeds the current date");
            return
        }

      const data = {
        StartDate: StartDate,
        EndDate: EndDate,
      };
      console.log(data);

      fetch("/ChartCustomOverview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          graphOverview(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });
  //=========================yearly chart overview=========

  $(document).ready(function () {
    $("#yearly").click(function () {
      fetch("/ChartYearlyOverview", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          graphOverview(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });

  //=========================daily chart overview============

  $(document).ready(function () {
    $("#daily").click(function () {
      // Your fetch request here
      fetch("/ChartDailyOverview", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          graphOverview(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });

  function graphOverview(data) {
    if (typeof data === "object") {
      var chart = {
        series: [{ name: "Earnings this month:", data: data.incomeData }],

        chart: {
          type: "bar",
          height: 500,
          offsetX: -15,
          toolbar: { show: true },
          foreColor: "#adb0bb",
          fontFamily: "inherit",
          sparkline: { enabled: false },
        },

        colors: ["#5D87FF"],

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            columnheight: "50%",
            borderRadius: [6],
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "all",
          },
        },
        markers: { size: 0 },

        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },

        grid: {
          borderColor: "rgba(0,0,0,0.1)",
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false,
            },
          },
        },

        xaxis: {
          type: "category",
          categories: [
            30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14,
            13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
          ],
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },

        yaxis: {
          show: true,
          min: 0,
          max: 1000000,
          tickAmount: 10,
          labels: {
            style: {
              cssClass: "grey--text lighten-2--text fill-color",
            },
          },
        },
        stroke: {
          show: true,
          width: 3,
          lineCap: "butt",
          colors: ["transparent"],
        },

        tooltip: { theme: "light" },

        responsive: [
          {
            breakpoint: 500000,
            options: {
              plotOptions: {
                bar: {
                  borderRadius: 3,
                },
              },
            },
          },
        ],
      };

      if (!chartGraph) {
        chartGraph = new ApexCharts(document.querySelector("#chart"), chart);
        chartGraph.render();
      } else {
        chartGraph.destroy();
        // console.log("hiiiii",chartGraph);
        chartGraph = new ApexCharts(document.querySelector("#chart"),chart);
        // chartGraph.updateOptions(chart);
        chartGraph.render();
      }
      // }
    } else {
      console.log("incomeData is already an array:", data.incomeData);
      chart.series[0].data = data.incomeData;
    }
  }

  //==========================weekly chart overview=====

  $(document).ready(function () {
    $("#weekly").click(function () {
      // Your fetch request here
      fetch("/ChartWeekOverview", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          graphOverview(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });

  //=======================monthly chart overview======

  $(document).ready(function () {
    $("#monthly").click(function () {
      // Your fetch request here
      fetch("/ChartMonthlyOverview", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          graphOverview(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  });

  // =====================================
  // Breakup
  // =====================================
  
  // var breakup = {
  //   color: "#adb5bd",
  //   series: [1,2,3,4,5],
  //   labels: ["Pending", "Shipped", "Delivered","Cancelled","Returned"],
  //   chart: {
  //     width: 180,
  //     type: "donut",
  //     fontFamily: "Plus Jakarta Sans', sans-serif",
  //     foreColor: "#adb0bb",
  //   },
  //   plotOptions: {
  //     pie: {
  //       startAngle: 0,
  //       endAngle: 360,
  //       donut: {
  //         size: "75%",
  //       },
  //     },
  //   },
  //   stroke: {
  //     show: false,
  //   },

  //   dataLabels: {
  //     enabled: false,
  //   },

  //   legend: {
  //     show: false,
  //   },
  //   colors: ["#000000", "#00329d", "#0000ff","#6868ff","#a8a8fd"],

  //   responsive: [
  //     {
  //       breakpoint: 991,
  //       options: {
  //         chart: {
  //           width: 150,
  //         },
  //       },
  //     },
  //   ],
  //   tooltip: {
  //     theme: "dark",
  //     fillSeriesColor: false,
  //   },
  // };

  // var donut = new ApexCharts(document.querySelector("#breakup"), breakup);
  // donut.render();

    $("#breakup").click(function () {
     console.log('breakup');
    
      fetch("/breakup", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          var breakup = {
            color: "#adb5bd",
            series: data.statusCounts,
            labels: ["Pending", "Shipped", "Delivered","Cancelled","Returned"],
            chart: {
              width: 180,
              type: "donut",
              fontFamily: "Plus Jakarta Sans', sans-serif",
              foreColor: "#adb0bb",
            },
            plotOptions: {
              pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                  size: "75%",
                },
              },
            },
            stroke: {
              show: false,
            },
        
            dataLabels: {
              enabled: false,
            },
        
            legend: {
              show: false,
            },
            colors: ["#000000", "#00329d", "#0000ff","#6868ff","#a8a8fd"],
        
            responsive: [
              {
                breakpoint: 991,
                options: {
                  chart: {
                    width: 150,
                  },
                },
              },
            ],
            tooltip: {
              theme: "dark",
              fillSeriesColor: false,
            },
          }; 
            donutchart = new ApexCharts(document.querySelector("#breakup"), breakup);
            donutchart.render(); 
          })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });


  

  // =====================================
  // Earning
  // =====================================
  var earning = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Earnings",
        color: "#49BEFF",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };
  new ApexCharts(document.querySelector("#earning"), earning).render();
});
