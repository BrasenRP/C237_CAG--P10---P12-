const ex = require("express");
const msql = require("mysql2");
const prodapp = ex();

const connect = msql.createConnection({
    // host: "localhost",
    // user: "root",
    // database: "proddyapp",
    // password: "",
    host: "alwaysdata.com",
    user: "brasen",
    password: "C237W/MYSQLDATABASE",
    database: "brasen_proddyapp"
});

connect.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

prodapp.set("view engine", "ejs");

prodapp.use(ex.urlencoded({
    extended: false
}));

// calendar

prodapp.get("/", (rq, res) => {
    const qry = "SELECT * FROM event";
    connect.query( qry, (err, data) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("ERROR Retreiving data");
        }
        res.render("calendar", {events: data});
    });
});

// read / get event details with id

prodapp.get("/event/:id", (rq, res) => {
    const eventId = rq.params.id;
    const qry = "SELECT * FROM event where eventId = ?";
    connect.query( qry, (err, data) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("ERROR Retreiving event by ID");
        }
        if (data.length > 0) {
            res.render("event", {event: data[0]});
        } else {
            res.status(404).send("Event not found");
        }
    });
});

// create a new event and its details

prodapp.get("/addEvent", (rq, res) => {
    res.render("addEvent");
});


prodapp.post("/addEvent", (rq, res) => {
    const {event_name, event_date, event_time} = rq.body;
    const qry = "INSERT INTO event (event_name, event_date, event_time) VALUE (?, ?, ?)";
    connect.query( qry, [event_name, event_date, event_time], (err, data) => {
        if (err) {
            console.error("Error adding event:", err);
            res.status(500).send("Error adding event");
        } else {
            res.redirect("/");
        }
    });
});

// update a specific event's details and finding it using id

prodapp.get("/editEvent/:id", (rq, res) => {
    const eventId = rq.params.id;
    const qry = "SELECT * FROM event where eventId = ?";
    connect.query( qry, [eventId], (err, data) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error rerieving event by ID");
        }
        if (data.length > 0) {
            res.render("editEvent", {event: data[0]});
        } else {
            res.status(404).send("Event not found");
        }
    });
});

prodapp.post("/editEvent/:id", (rq, res) => {
    const eventId = rq.params.id;
    const { event_name, event_date, event_time} = rq.body;
    const qry = "UPDATE event SET event_name = ? , event_date = ? , event_time = ? WHERE eventId = ?";
    
    connect.query( qry, [event_name, event_date, event_time, eventId], (err, data) => {
        if (err) {
            console.error("Error updating event:", err);
            res.status(500).send("Error updating event");
        } else {
            res.redirect("/");
        }
    });
});

// delete an event

prodapp.get("/deleteEvent/:id", (rq, res) => {
    const eventId = rq.params.id;
    const qry = "DELETE FROM event WHERE eventId = ?";
    connect.query( qry, [eventId], (err, data) => {
        if (err) {
            console.error("Error deleting event:", err);
            res.status(500).send("Error deleting event");
        } else {
            res.redirect("/");
        }
    });
});

// reminders

prodapp.get("/reminders", (rq, res) => {
    const qry = "SELECT * FROM reminder";
    connect.query( qry, (err, data1) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("ERROR Retreiving data");
        }
        res.render("reminders", {reminders: data1});
    });
});

// read / get reminder details with id

prodapp.get("/reminder/:id", (rq, res) => {
    const reminderId = rq.params.id;
    const qry = "SELECT * FROM reminder where reminderId = ?";
    connect.query( qry, (err, data1) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("ERROR Retreiving reminder by ID");
        }
        if (data1.length > 0) {
            res.render("reminder", {reminder: data1[0]});
        } else {
            res.status(404).send("Event not found");
        }
    });
});

// create a new reminder and its details

prodapp.get("/addReminder", (rq, res) => {
    res.render("addReminder");
});

prodapp.post("/addReminder", (rq, res) => {
    const {reminder_date, reminder_time, msg} = rq.body;
    const qry = "INSERT INTO reminder (reminder_time, reminder_date, msg) VALUE (?, ?, ?)";
    connect.query( qry, [reminder_date, reminder_time, msg], (err, data) => {
        if (err) {
            console.error("Error adding reminder:", err);
            res.status(500).send("Error adding reminder");
        } else {
            res.redirect("/");
        }
    });
});

// update a specific reminder's details and retrieving it using matching id

prodapp.get("/editReminder/:id", (rq, res) => {
    const reminderId = rq.params.id;
    const qry = "SELECT * FROM reminder WHERE reminderId = ?";
    connect.query( qry, [reminderId], (err, data1) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send("Error rerieving reminder by ID");
        }
        if (data1.length > 0) {
            res.render("editReminder", {reminder: data1[0]});
        } else {
            res.status(404).send("Reminder not found");
        }
    });
});

prodapp.post("/editReminder/:id", (rq, res) => {
    const reminderId = rq.params.id;
    const {reminder_date, reminder_time, msg} = rq.body;
    const qry = "UPDATE reminder SET reminder_date = ? , reminder_time = ? , msg = ? WHERE reminderId = ?";
    
    connect.query( qry, [reminder_date, reminder_time, msg, reminderId], (err, data1) => {
        if (err) {
            console.error("Error updating reminder:", err);
            res.status(500).send("Error updating reminder");
        } else {
            res.redirect("/");
        }
    });
});

// delete a reminder

prodapp.get("/deleteReminder/:id", (rq, res) => {
    const reminderId = rq.params.id;
    const qry = "DELETE FROM reminder WHERE reminderId = ?";
    connect.query( qry, [reminderId], (err, data1) => {
        if (err) {
            console.error("Error deleting reminder:", err);
            res.status(500).send("Error deleting reminder");
        } else {
            res.redirect("/");
        }
    });
});

const port = process.env.PORT || 3000;

prodapp.listen(port, () => console.log(`Server running on port ${port}`));