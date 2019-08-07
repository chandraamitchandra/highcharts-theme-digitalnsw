var webURL = "https://mapprod2.environment.nsw.gov.au/arcgis/rest/services/Planning/Planning_Portal_Application_Tracking/MapServer/1/query?f=json&orderByFields=COUNCIL_NAME, SUBMITTED_QUARTER ASC&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=SUBMITTED_QUARTER NOT IN ('2018 Q2','2018 Q3','2018 Q4') AND APPLICATION_TYPE IN ('All', 'Concurrence and Referral')";
var webURL2 = "https://mapprod2.environment.nsw.gov.au/arcgis/rest/services/Planning/Planning_Portal_Application_Tracking/MapServer/4/query?f=json&orderByFields=ORG_NAME , APPLICATION_TYPE ASC&outFields=APPLICATION_TYPE,ORGANISATION_TYPE,ORG_NAME&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=ORGANISATION_TYPE='COUNCIL' AND APPLICATION_TYPE IN ('Development Application', 'Concurrence and Referral')";
var submitted = [];
var lodged = [];
var determined = [];
var cnrSubmitted = [];
var cnrLodged = [];
var cnrDetermined = [];
var costDevelopment = [];
var avgDetermination = [];
var councilData;
var listData;
var chart1;
var chart2;
var chart3;
var chart4;




$(document).ready(function() {

    //initialise data

    GetProjectType().done(function(data) {
        councilData = data;

        buildDropdown(data);
        buildCnrDropdown(data);

        buildData(data, 'All', "chart1");
       
        buildData(data, 'All', "chart2");
        buildData(data, 'All', "chart3");
        buildData(data, 'All', "chart4",'Concurrence and Referral');
        totalsInfographic();
      

        drawChart1();
        drawChart2();
        drawChart3();
        drawChart4();


    });
    GetCouncilList().done(function(data){
        
      
        listData = data;
        buildListAll(data);
    });
    $('#councils').on('change', function() {

        var selectedCouncil = $(this).children("option:selected").val();

        // buildDropdown(data);
        submitted.length = 0;
        lodged.length = 0;
        determined.length = 0;
        costDevelopment.length = 0;
        avgDetermination.length = 0;
        buildData(councilData, selectedCouncil, "chart1");
        buildData(councilData, selectedCouncil, "chart2");
        buildData(councilData, selectedCouncil, "chart3");
        updateCharts();
        // callGraph();


    });
        $('#cnrCouncils').on('change', function() {

        var selectedCouncil = $(this).children("option:selected").val();

        // buildDropdown(data);
        cnrSubmitted.length = 0;
        cnrLodged.length = 0;
        cnrDetermined.length = 0;
       
        buildData(councilData, selectedCouncil, "chart4",'Concurrence and Referral');

        updateCharts();
        // callGraph();


    });
});

function drawChart1() {

    chart1 = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Number of applications by status',
            align: 'center'
        },
        subtitle: {
            text: 'Total number of applications in various stages for a particular council '
        },
        plotOptions: {
            column: {
                pointPadding: 0.1,

                groupPadding: 0.3,

                dataLabels: {
                    enabled: true
                }
            }
        },
        tooltip: {

            shared: true,
            useHTML: true
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Applications'
            }
        },


        series: [{
                name: 'Summitted',

                data: submitted
            },

            {
                name: 'Lodged',

                data: lodged
            },
            {
                name: 'Determined',

                data: determined
            }



        ]
    });
}

function totalsInfographic()
{
    $.each(submitted,function(index,item){
        
       if(item[0] ==='All')
    {
      var $this = $("#totalApps");
       $this.html(item[1]);
       animate($this);
    }
    });
    $.each(cnrSubmitted,function(index,item){
        
       if(item[0] ==='All')
    {
        var $this = $('#totalCnr');
       $this.html(item[1]);
       animate($this);
    }
    });
   
   

}

function animate(ref)
{
      
  var $this = $(ref);
  $({ Counter: 0 }).animate({ Counter: $this.text() }, {
    duration: 1500,
    easing: 'swing',
    step: function () {
      $this.text(Math.ceil(this.Counter));
    }
  });

}

function updateCharts() {
    chart1.series[0].setData(submitted);
    chart1.series[1].setData(lodged);
    chart1.series[2].setData(determined);
    chart2.series[0].setData(costDevelopment);
    chart3.series[0].setData(avgDetermination);
    chart3.series[1].setData(determined);
    chart4.series[0].setData(cnrSubmitted);
    chart4.series[1].setData(cnrLodged);
    chart4.series[2].setData(cnrDetermined);
    // chart1.redraw();
}

function chartType(item, chart, quarter) {
    switch (chart) {
        case "chart1":
            submitted.push([quarter, item.attributes.SUBMITTED_COUNT]);
            lodged.push([quarter, item.attributes.LODGEMENT_COUNT]);
            determined.push([quarter, item.attributes.DETERMINATION_COUNT]);
            break;
        case "chart2":
            costDevelopment.push([quarter, convertInt(item.attributes.COST_OF_DEVELOPMENT)]);

            break;
        case "chart3":
            if(item.attributes.AVERAGE_DETERMINATION_TIME===null ?  avgDetermination.push([quarter, 0]):+
            avgDetermination.push([quarter, item.attributes.AVERAGE_DETERMINATION_TIME]));
            break;
        case "chart4":
            cnrSubmitted.push([quarter, item.attributes.SUBMITTED_COUNT]);
            cnrLodged.push([quarter, item.attributes.LODGEMENT_COUNT]);
            cnrDetermined.push([quarter, item.attributes.DETERMINATION_COUNT]);
            break;    
    }
}

function convertInt(cost) {
    return parseInt(cost);
}

function buildData(data, councilName, chart, applicationType) {


    $.each(JSON.parse(data).features, function(index, item) {
        
        if(!applicationType){ applicationType = 'All';}

        if (item.attributes.COUNCIL_NAME === councilName &&
            item.attributes.APPLICATION_TYPE === applicationType) {

            switch (item.attributes.SUBMITTED_QUARTER) {

                case "2019 Q1":

                    chartType(item, chart, item.attributes.SUBMITTED_QUARTER);
                    break;

                case "2019 Q2":
                    chartType(item, chart, item.attributes.SUBMITTED_QUARTER);
                    break;

                case "2019 Q3":
                    chartType(item, chart, item.attributes.SUBMITTED_QUARTER);
                    break;

                case "All":
                    chartType(item, chart, item.attributes.SUBMITTED_QUARTER);
                    break;
            }
        }
    });
}

function buildListAll(data)
{
    var orgDaName=[];
    var orgCnrName=[];

    $.each(JSON.parse(data).features,function(index, item) {
        
        
       
       if(item.attributes.APPLICATION_TYPE === 'Development Application')
       {
           orgDaName.push(item.attributes.ORG_NAME);
       }
       if(item.attributes.APPLICATION_TYPE === 'Concurrence and Referral')
       {
           orgCnrName.push(item.attributes.ORG_NAME);
       }
        
    });
    renderCouncilList(orgDaName,orgCnrName);
}

function renderCouncilList(orgDaName,orgCnrName)
{
    var da='';
    var cnr=''
    $.each(orgDaName,function(index, item) {
       
       da +="<li>"+item+"</li>";
        
    });
    $.each(orgCnrName,function(index, item) {
       
       cnr +="<li>"+item+"</li>";
        
    });
    $('#dalist').html(da);
     $('#cnrlist').html(cnr);
}

function buildDropdown(data) {
    //create a council array var uniqueArray = ;
    var councils = [];
    
    var listItems = "<option value= 'All'>All</option>";

    $.each(JSON.parse(data).features, function(index, item) {

        if (item.attributes.APPLICATION_TYPE == "All") {
            councils.push(item.attributes.COUNCIL_NAME);
        }
    });


    $.each(Array.from(new Set(councils)), function(index, item) {

        if (item != 'All') {
            listItems += "<option value='" + item +
                "'>" + item + "</option>";
        }
    });




    $('#councils').html(listItems);
}

function buildCnrDropdown(data) {
    //create a council array var uniqueArray = ;
    var cnrCouncils = [];
    var listItems = "<option value= 'All'>All</option>";

    $.each(JSON.parse(data).features, function(index, item) {

        if (item.attributes.APPLICATION_TYPE == "Concurrence and Referral") {
            cnrCouncils.push(item.attributes.COUNCIL_NAME);
        }
    });


    $.each(Array.from(new Set(cnrCouncils)), function(index, item) {

        if (item != 'All') {
            listItems += "<option value='" + item +
                "'>" + item + "</option>";
        }
    });




    $('#cnrCouncils').html(listItems);
}

function spinner(ref)
{
    $(ref).html('<div class="spinner-border text-white" role="status"><span class="sr-only">Loading...</span> </div>');
}

function GetProjectType() {

    var deffer = $.Deferred();
    spinner ($('#totalApps'));

    $.ajax({
        url: webURL,
        type: "GET",
        headers: {
            "Accept": "application/json;odata=verbose"
        }
        // return data format			 		

    }).done(function(data) {

        //  buildDropdown(data);

        //  buildData(data,councilName);


        //   	callGraph();				 
        deffer.resolve(data);

    });
    return deffer.promise();
}
function GetCouncilList() {

    var deffer = $.Deferred();
     spinner ($('#totalCnr'));
    $.ajax({
        url: webURL2,
        type: "GET",
        headers: {
            "Accept": "application/json;odata=verbose"
        }
        // return data format			 		

    }).done(function(data) {

        //  buildDropdown(data);

        //  buildData(data,councilName);


        //   	callGraph();				 
        deffer.resolve(data);

    });
    return deffer.promise();
}

/**
 * cost of determination
 * 
 */

function drawChart2() {


    chart2 = Highcharts.chart('container2', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Total costs of development',
            align: 'center'
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total development costs'
            }
        },

        tooltip: {
            formatter: function() {

                return 'The total costs for ' + this.point.name + ' is ' + '$' + numberConvert(this.y);
            }
        },
        plotOptions: {
            column: {
                allowPointSelect: true,
                pointPadding: 0.3,

                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return ('$' + numberConvert(this.y));
                    },
                },
                showInLegend: true
            }
        },

        series: [{


            name: 'Total cost',
            data: costDevelopment

        }]
    });
}

function drawChart3() {


    chart3 = Highcharts.chart('container3', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Average determination time',
            align: 'center'
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: [{
                min: 0,
                title: {
                    text: 'Average determination time (in days)'
                },
            },
            {
                min: 0,
                opposite: true,
                title: {
                    text: 'Number of applications'
                }
            },

        ],

        plotOptions: {
            column: {
                pointPadding: 0,

                groupPadding: 0.2,


            }
        },
        tooltip: {

            shared: true,
            useHTML: true
        },

        series: [


            {


                name: 'Average determination days',
                data: avgDetermination,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return (numberConvert(this.y) + ' days');
                    },
                }

            },
            {
                name: 'Applications determined',

                data: determined,
                yAxis: 1,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return (numberConvert(this.y));
                    },
                }
            },



        ]
    });
}
function drawChart4() {

    chart4 = Highcharts.chart('container4', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Concurrence and Referral case status',
            align: 'center'
        },
        subtitle: {
            text: 'Total number of Concurrence and Referrals in various stages for a particular council '
        },
        plotOptions: {
            column: {
                pointPadding: 0.1,

                groupPadding: 0.3,

                dataLabels: {
                    enabled: true
                }
            }
        },
        tooltip: {

            shared: true,
            useHTML: true
        },
        xAxis: {
            type: 'category',
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Applications'
            }
        },


        series: [{
                name: 'Summitted',

                data: cnrSubmitted
            },

            {
                name: 'Lodged',

                data: cnrLodged
            },
            {
                name: 'Determined',

                data: cnrDetermined
            }



        ]
    });
}

function numberConvert(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}