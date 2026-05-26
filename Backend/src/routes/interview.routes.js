const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');
const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate an interview report based on the provided resume, self-description, and job description.
 * @access private
 */
interviewRouter.post('/', authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interview id
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewByIdController)

/**
 * @route GET /api/interview
 * @description get all interview reports of the logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReports)
module.exports = interviewRouter;