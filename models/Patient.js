// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bid: { type: Number, required: true },
    // Add more fields as needed
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
