// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBeqiX6h_L-CXO--tG9R_etaVMTJPaAFBU",
    authDomain: "train-scheduler-9eebf.firebaseapp.com",
    databaseURL: "https://train-scheduler-9eebf.firebaseio.com",
    projectId: "train-scheduler-9eebf",
    storageBucket: "train-scheduler-9eebf.appspot.com",
    messagingSenderId: "209206039854",
    appId: "1:209206039854:web:f82830782d40ac8f"
};

firebase.initializeApp(config);

var database = firebase.database();

// Add train
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#train-time-input").val(), "HH").format("X");
    var frequency = $("#frequency-input").val();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

    // Uploads train to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTimeTrain = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    // First Time 
    var firstTimeConverted = moment(firstTimeTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    console.log(firstTimeTrain);


    // Difference between the times
    var diffTime = moment().diff(moment.unix(firstTimeTrain), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(tMinutesTillTrain),
    );

    // Append the new row to the table
    $("tbody").append(newRow);
});