$(document).ready(function () {
    var fieldCount = 0; //keeps track of the amount of backwaiters there are 
    var busser = new Array(); //Array to hold all the backwaiters
    var bwContainer = $("#backwaiter_container"); //Div where the backwaiter objects are appended to
    var bwHidden = false; //backwaiter div not hidden by default
    var tpHidden = false; //tip pool div not hidden by default
    var showData = false; //Toggle for Results page

    function Backwaiter() {
        this.objId = fieldCount; //identifier for backwaiters
        this.startTime = [16, 00]; //default start time is 4:00
        this.endTime = [20, 00]; //default end time is 8:00
        this.timeWorked; //empty field for total time worked
        this.tips; //tips made

        //the code for the form that is created when a new backwaiter object is created
        this.html = "<div class=\"jumbotron busser\" id=\"" + fieldCount + "\">" +
                        "<form class=\"input-group\">" +
                            "<span class=\"input-group-addon\">From:</span><input type=\"time\" class=\"form-control\" id=\"startInput\" value=\"16:00:00\" step=\"60\" />" + 
                        "</form>" + 
                        "<br>" + 
                        "<form class=\"input-group\">" +
                            "<span class=\"input-group-addon\">To: </span><input type=\"time\" class=\"form-control\" id=\"endInput\" value=\"20:00:00\" step=\"60\" />" +
                        "</form>" +
                        "<br>" +
                        "<button class=\"removeField btn btn-default\">Remove</button>" +
                    "</div>";

        $(bwContainer).append(this.html);
        fieldCount++;
    }

    //Initialize first backwaiter object into busser array
    busser[0] = new Backwaiter();

    $(".addField").click(function (e) {
        e.preventDefault(); //Makes button do nothing by default

        //checks for deleted backwaiters in array and fills them with the new backwaiter object
        for (i = 0; i < busser.length; i++) {
            if (busser[i] == undefined) {
                fieldCount = i;
            } else {
                fieldCount = busser.length;
            }
        }
        busser[fieldCount] = new Backwaiter();
    })

    $(bwContainer).on("click", ".removeField", function (e) {
        e.preventDefault();

        //Removes the busser object from the array
        for (i = 0; i < busser.length; i++) {
            console.log(busser[i].objId);
            if (busser[i].objId == $(this).parent('div').attr('id')) {
                busser.splice(i, 1)
            }
        }

        //Reassigns objId to all backwaiters for consistency
        for (i = 0; i < busser.length; i++) {
            busser[i].objId = i;
        }

        //Removes actual html busser time input
        $(this).parent('div').remove();
    })

    $(".calculate").click(function () {

        var tipPool = parseInt($("#tipPool").val());
        var hourPool = 0;
        var tipHourly = 0;

        var leftOver = $("#tipPool").val();

        $(".busser").each(function (i) {
            //Sets times for bussers
            busser[i].startTime = $("#" + i).children("form").children("#startInput").val().split(":");
            for (var j = 0; j < busser[i].startTime.length; j++) {
                busser[i].startTime[j] = parseInt(busser[i].startTime[j]);
            }
            busser[i].endTime = $("#" + i).children("form").children("#endInput").val().split(":");
            for (var j = 0; j < busser[i].endTime.length; j++) {
                busser[i].endTime[j] = parseInt(busser[i].endTime[j]);
            }
            busser[i].timeWorked = ((busser[i].endTime[0] - busser[i].startTime[0])*60+(busser[i].endTime[1] - busser[i].startTime[1]))
            //sets cummulative hours worked
            hourPool += busser[i].timeWorked;

        })

        tipHourly = (tipPool/hourPool);

        //sets tips for bussers and calculates money left over
        for (var i = 0; i < busser.length; i++){
            busser[i].tips = Math.round(busser[i].timeWorked * tipHourly);
            console.log("Busser " + i + " tips: " + busser[i].tips);
            leftOver -= busser[i].tips;
        }

        //creates a div for each busser's data
        for (var i = 0; i < busser.length; i++){
            var results_html = "<div class=\"jumbotron\">" + 
                                    "<h2>Busser " + (i+1) + ": </h2>" +
                                    "<p>Hours Worked: " + (Math.round((busser[i].timeWorked/60)*100)/100) + "</p>" +
                                    "<p>Tips: $" + busser[i].tips + "</p>" +
                                "</div>";
            $("#busser-data").append(results_html);
        }
        
        //sets text to match data
        $("#tip-pool").text("Tip Pool: $" + tipPool);
        $("#hour-pool").text("Total Hours worked by bussers: " + (Math.round((hourPool/60)*100)/100));
        $("#busser-hourly").text("Tip Hourly: $" + (Math.round(tipHourly*6000)/100));
        if(leftOver == 0){
            $("#left-over").css("display", "none");
        } else {
            $("#left-over").text("Money Left Over: $" + leftOver);
        }

        //Changes page shown
        $("#calc-page").css("display", "none");
        $("#results-page").css("display", "inline");

        //Changes buttons displayed
        $(".calculate, .addField").css("display", "none");
        $(".editData").css("display", "inline");

    })

    $(".editData").click(function(){
        //deletes busser divs
        $("#busser-data").empty();

        //Changes page shown
        $("#calc-page").css("display", "inline");
        $("#results-page").css("display", "none");

        //Changes buttons displayed
        $(".calculate, .addField").css("display", "inline");
        $(".editData").css("display", "none");
    })

    //changes the arrow when show/hide clicked
    $(".toggleTipPool").click(function () {
        if (tpHidden) {
            tpHidden = false;
            $(this).removeClass("glyphicon-chevron-down");
            $(this).addClass("glyphicon-chevron-up");
        } else {
            tpHidden = true;
            $(this).removeClass("glyphicon-chevron-up");
            $(this).addClass("glyphicon-chevron-down");
        }
    })

    //changes the arrow when show/hide clicked
    $(".toggleBackwaiters").click(function () {
        if (bwHidden) {
            bwHidden = false;
            $(this).removeClass("glyphicon-chevron-down");
            $(this).addClass("glyphicon-chevron-up");
        } else {
            bwHidden = true;
            $(this).removeClass("glyphicon-chevron-up");
            $(this).addClass("glyphicon-chevron-down");
        }
    })

});