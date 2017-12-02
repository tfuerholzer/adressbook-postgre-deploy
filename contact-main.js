"use strict";
/**
 *@author Thomas Fürholzer, HTL-Perg, 4AHIF
 *@requires restify,ps
 */
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const contact_post_1 = require("./contact-post");
const contact_get_1 = require("./contact-get");
const contact_delete_1 = require("./contact-delete");
const pg_1 = require("pg");
class Person {
    /**
     * @param {int} id id of the person -> should be an integer that is greater or equal 0
     * @param {string} firstName first name of the new person
     * @param {string} lastName last name of the new person
     * @param {string} email email of the person (email syntax is not checked)
     */
    constructor(id, firstName, lastName, email) {
        this.firstName = firstName;
        this.id = id;
        this.lastName = lastName;
        this.email = email;
    }
    static getAllPersons(client) {
        let persons = new Array();
        let ret = true;
        let locked = true;
        let x = client.query("SELECT * FROM Persons", (error, result) => {
            console.log(result.rowCount);
            if (error) {
                console.log(error.stack);
                ret = false;
            }
            else {
                result.rows.forEach((row) => {
                    persons.push(new Person(row.personid, row.firstname, row.lastname, row.email));
                    console.log("i have pushed stuff into the array");
                });
            }
            locked = false;
        });
        while (locked) { }
        console.log("im return this stuff now");
        return [ret, persons];
    }
    static deletePersonById(client, id) {
        let ret = true;
        client.query(`DELETE FROM persons where personid=${id};`, (result, error) => {
            if (error) {
                ret = false;
            }
        });
        return ret;
    }
    insertPerson(client) {
        let ret = true;
        client.query(`INSERT into persons (personid,firstname,lastname,email)values(${this.id},'${this.firstName}','${this.lastName}','${this.email}');`, (result, error) => {
            if (error) {
                ret = false;
            }
        });
        return ret;
    }
}
exports.Person = Person;
exports.databaseConnection = new pg_1.Client({ connectionString: process.env.DATABASE_URL, ssl: true, });
exports.databaseConnection.connect();
/**
 * Function that checks if a person already existis in the array (same id)
 * @param {Person} newPerson Person to be added
 * @param {Array<Person>} storage  array where all persons are stored
 * @return {boolean} returns true if the person was added and false if not
 */
function addPerson(newPerson, storage) {
    if (storage.filter(person => person.id === newPerson.id).length === 0) {
        storage.push(newPerson);
        return true;
    }
    else {
        return false;
    }
}
exports.addPerson = addPerson;
const port = process.env.PORT || 8080;
//Defining Port
const server = restify_1.createServer();
server.use(restify_1.plugins.bodyParser());
server.post("/contacts", contact_post_1.contactDoPost);
server.get("/contacts", contact_get_1.contactDoGet);
server.del("/contacts/:id", contact_delete_1.contactDoDelete);
//Creating server and adding bodyParser plugin as well as setting all methods
server.listen(port, () => console.log(`Server is now listening to port ${port}`));
//Starting server 
