const pdfParse = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @description Controller to generate interview report based on self description resume and job description
 */
async function generateInterviewReportController(req, res) {
    const resumeFile = req.file;
    
    // Check if file was uploaded
    if (!resumeFile) {
        return res.status(400).json({ error: "Resume file is required" });
    }
    
    // Process the uploaded resume file
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
    const { selfDescription, jobDescription } = req.body;
    try {
        const report = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });
        const interviewReport = new interviewReportModel({
            user: req.user.userId,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...report

        });
        await interviewReport.save();
        res.status(201).json({
            message: "Interview report generated successfully",
            report: interviewReport
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ error: "Failed to generate interview report" });
    }

}

async function getInterviewByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.userId })
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview Report not found."
        })
    }

    res.status(200).json({
        message: "Interview Report fetched successfully.",
        interviewReport
    })

}
async function getAllInterviewReports(req, res) {
    const interviewReports = (await interviewReportModel.find({user: req.user.userId})).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if(!interviewReports){
        return res.status(404).json({
            message: "No reports found"
        })
    }
    res.status(200).json({
        message:'Interview reports fetched successfully.',
        interviewReports
    })
}

module.exports = {
    generateInterviewReportController,
    getInterviewByIdController,
    getAllInterviewReports
};