
//skip=(page-1)*pageSize
// Where:
// - page = Current page number.
// - pageSize = Number of documents displayed per page.
const getReports = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = 5;

        const skip = (page - 1) * limit;

        const reports = await Analysis.find()   
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page: page,
            reports: reports
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};