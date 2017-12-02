"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_main_1 = require("./contact-main");
function contactDoPost(request, response, next) {
    let description = "";
    if (request.body.id === undefined || request.body.firstName === undefined || request.body.lastName === undefined || request.body.email === undefined) {
        description = "Invalid input (e.g. required field missing or empty)";
        response.statusCode = 400;
        //if any of these fields are undefined i will send back an error and the status-code 400
    }
    else {
        if ((new contact_main_1.Person(request.body.id, request.body.firstName, request.body.lastName, request.body.email).insertPerson(contact_main_1.databaseConnection))) {
            response.statusCode = 200;
            description = "Person successfully created";
            //if adding a new Person was successfull the status-code will be set to 200...
        }
        else {
            response.statusCode = 500;
            description = "Error from DB";
            //... but if not i return 400
        }
    }
    response.send(description);
    next();
    //sending and calling next
}
exports.contactDoPost = contactDoPost;
