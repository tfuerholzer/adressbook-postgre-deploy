"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_main_1 = require("./contact-main");
function contactDoDelete(request, response, next) {
    let personID = Number.parseInt(request.params.id);
    //Parsing number
    let description = "";
    contact_main_1.Person.deletePersonById(contact_main_1.databaseConnection, personID, (ret) => {
        if (ret) {
            response.statusCode = 200;
            description = "Delete successfull";
        }
        else {
            response.statusCode = 500;
            description = "Error deleting from database";
        }
        response.send(description);
        next();
    });
    //sending back the response and calling next
}
exports.contactDoDelete = contactDoDelete;
