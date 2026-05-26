const mongoose = require("mongoose");
const { string } = require("zod");

/**
 * - job description schema: String
 * - resume text : String
 * - Self Description : String
 * 
 * - match score : Number
 * - Technical Questions: [
 * {
 *  question: String,
 *  answer: String,
 *  intent: String,
 * }
 * ]
 * - Behavioral Questions: [
 * {
 *  question: String,
 *  answer: String,
 *  intention: String
 * }
 * ]
 * - Skill Gaps: [{
 * skill: String,
 * severity: {
 * type: String,
 * enum: ["low", "medium", "high"]
 * }
 * }]
 * - Preparation Plan: [{
 *  day: Number,
 *  focus: String,
 *  tasks: [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: { 
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Technical question intent is required"]
    },
    answer: {
        type: String,
        required: [true, "Technical question answer is required"]
    }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: { 
        type: String,
        required: [true, "Behavioral question is required"]
    },
    intention: {
        type: String,
        required: [true, "Behavioral question intent is required"]
    },
    answer: {
        type: String,
        required: [true, "Behavioral question answer is required"]
    }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: { 
        type: String,
        required: [true, "Skill gap skill is required"]
    },
    severity: {
        type: String,
        required: [true, "Skill gap severity is required"],
        enum: ["low", "medium", "high"]
    }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: { 
        type: Number,
        required: [true, "Preparation plan day is required"]
    },
    focus: {
        type: String,
        required: [true, "Preparation plan focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Preparation plan task is required"]
    }]
}, { _id: false });


const interviewReportSchema = new mongoose.Schema({
    jobDescription: { 
        type: String, 
        required: [true, "Job description is required"]
    },
    resume: { 
        type: String
    },
    selfDescription: { 
        type: String
    },
    matchScore: { 
        type: Number, 
        min: [0, "Match score cannot be less than 0"],
        max: [100, "Match score cannot be greater than 100"]
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Associated user is required"]
    },
    title: {
        type: string,
        required: [true , "Job Title is Required"]
    }


},{
    timestamps: true
});

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = InterviewReport;